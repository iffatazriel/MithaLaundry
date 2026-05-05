import { NextResponse } from "next/server"
import { requireApiSession } from "@/lib/auth/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type XenditSimulateResponse = {
  id?: string
  status?: string
  message?: string
  error_code?: string
  errors?: unknown
  reference_id?: string
  qr_code?: {
    external_id?: string
    reference_id?: string
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { message: "Simulasi QRIS hanya tersedia di development." },
        { status: 403 }
      )
    }

    if (!process.env.XENDIT_SECRET_KEY) {
      return NextResponse.json(
        { message: "XENDIT_SECRET_KEY belum dikonfigurasi." },
        { status: 500 }
      )
    }

    const body = await req.json()
    const orderId = String(body.orderId || "").trim()

    if (!orderId) {
      return NextResponse.json({ message: "Order ID wajib diisi." }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ message: "Order tidak ditemukan." }, { status: 404 })
    }

    if (!order.xenditReferenceId || !order.xenditQrString) {
      return NextResponse.json(
        { message: "Buat QRIS terlebih dahulu sebelum simulasi pembayaran." },
        { status: 400 }
      )
    }

    const qrCodeId = order.xenditQrId ?? order.xenditReferenceId
    const url = `https://api.xendit.co/qr_codes/${encodeURIComponent(qrCodeId)}/payments/simulate`
    const authHeader =
      "Basic " +
      Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString("base64")

    const simulate = async (fieldName: "amount" | "nominal") => {
      const form = new URLSearchParams()
      form.set(fieldName, String(order.total))

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
          "api-version": "2022-07-31",
        },
        body: form.toString(),
      })

      const data = (await response.json()) as XenditSimulateResponse
      return { response, data, fieldName }
    }

    let result = await simulate("amount")

    if (!result.response.ok && result.response.status === 400) {
      result = await simulate("nominal")
    }

    const { response, data, fieldName } = result

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Gagal mensimulasikan pembayaran QRIS.",
          error_code: data.error_code,
          errors: data.errors,
          qr_code_id: qrCodeId,
          reference_id: order.xenditReferenceId,
          simulated_field: fieldName,
          xendit_status: response.status,
        },
        { status: response.status }
      )
    }

    const status = data.status?.toUpperCase()

    if (status === "COMPLETED" || status === "SUCCEEDED") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "paid",
          paymentProvider: "xendit",
          xenditPaymentId: data.id ?? null,
          paidAt: new Date(),
        },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Simulate QRIS error:", error)

    return NextResponse.json(
      {
        message: "Gagal mensimulasikan pembayaran QRIS.",
        detail:
          process.env.NODE_ENV === "production"
            ? undefined
            : error instanceof Error
              ? error.message
              : String(error),
      },
      { status: 500 }
    )
  }
}

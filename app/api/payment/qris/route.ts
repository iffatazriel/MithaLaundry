import { NextResponse } from "next/server"
import { requireApiSession } from "@/lib/auth/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type XenditQrResponse = {
  id?: string
  reference_id?: string
  qr_string?: string
  status?: string
  message?: string
  errors?: unknown
  error_code?: string
}

export async function POST(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.XENDIT_SECRET_KEY) {
      return NextResponse.json(
        { message: "XENDIT_SECRET_KEY belum dikonfigurasi." },
        { status: 500 }
      )
    }

    const body = await req.json()
    const orderId = String(body.orderId || "")
      .replace("#", "")
      .trim()

    if (!orderId) {
      return NextResponse.json({ message: "Order ID wajib diisi." }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ message: "Order tidak ditemukan." }, { status: 404 })
    }

    if (order.payment !== "qris") {
      return NextResponse.json(
        { message: "Order ini tidak menggunakan metode pembayaran QRIS." },
        { status: 400 }
      )
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { message: "Order ini sudah dibayar." },
        { status: 409 }
      )
    }

    const amount = Number(order.total)

    if (!Number.isInteger(amount) || amount < 1500) {
      return NextResponse.json(
        { message: "Nominal QRIS minimal Rp 1.500." },
        { status: 400 }
      )
    }

    if (order.xenditQrString) {
      return NextResponse.json({
        id: order.xenditQrId,
        reference_id: order.xenditReferenceId,
        qr_string: order.xenditQrString,
        status: order.paymentStatus === "unpaid" ? "ACTIVE" : order.paymentStatus.toUpperCase(),
      })
    }

    const referenceId = order.xenditReferenceId ?? `ORDER-${order.id}`
    const payload = {
      reference_id: referenceId,
      type: "DYNAMIC",
      currency: "IDR",
      amount,
    }

    const response = await fetch("https://api.xendit.co/qr_codes", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString("base64"),
        "Content-Type": "application/json",
        "api-version": "2022-07-31",
      },
      body: JSON.stringify(payload),
    })

    const data = (await response.json()) as XenditQrResponse

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Gagal membuat QRIS",
          error_code: data.error_code,
          errors: data.errors || data,
        },
        { status: response.status }
      )
    }

    if (!data.qr_string) {
      return NextResponse.json(
        { message: "Xendit tidak mengembalikan QR string." },
        { status: 502 }
      )
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "pending",
        paymentProvider: "xendit",
        xenditReferenceId: data.reference_id ?? referenceId,
        xenditQrId: data.id ?? null,
        xenditQrString: data.qr_string,
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Create QRIS error:", error)

    return NextResponse.json(
      { message: "Gagal membuat QRIS." },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { requireApiSession } from "@/lib/auth/server"
import { prisma } from "@/lib/prisma"
import {
  getMidtransAuthHeader,
  getMidtransSnapBaseUrl,
  type MidtransSnapResponse,
} from "@/lib/payment/midtrans"

export const runtime = "nodejs"

type MidtransPaymentCache = {
  midtransOrderId: string | null
  midtransTransactionId: string | null
  midtransQrString: string | null
  midtransQrCodeUrl: string | null
  midtransSnapToken: string | null
  midtransRedirectUrl: string | null
}

export async function POST(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY
    const clientKey = process.env.MIDTRANS_CLIENT_KEY

    if (!serverKey) {
      return NextResponse.json(
        { message: "MIDTRANS_SERVER_KEY belum dikonfigurasi." },
        { status: 500 }
      )
    }

    if (!clientKey) {
      return NextResponse.json(
        { message: "MIDTRANS_CLIENT_KEY belum dikonfigurasi." },
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
      include: {
        customer: true,
      },
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

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Nominal QRIS tidak valid." },
        { status: 400 }
      )
    }

    const [paymentCache] = await prisma.$queryRaw<MidtransPaymentCache[]>`
      SELECT
        "midtransOrderId",
        "midtransTransactionId",
        "midtransQrString",
        "midtransQrCodeUrl",
        "midtransSnapToken",
        "midtransRedirectUrl"
      FROM "Order"
      WHERE "id" = ${order.id}
      LIMIT 1
    `

    if (paymentCache?.midtransSnapToken && paymentCache.midtransRedirectUrl) {
      return NextResponse.json({
        id: paymentCache.midtransTransactionId,
        reference_id: paymentCache.midtransOrderId,
        order_id: paymentCache.midtransOrderId,
        token: paymentCache.midtransSnapToken,
        redirect_url: paymentCache.midtransRedirectUrl,
        client_key: clientKey,
        snap_script_url: `${getMidtransSnapBaseUrl()}/snap/snap.js`,
        qr_string: paymentCache.midtransQrString,
        qr_code_url: paymentCache.midtransQrCodeUrl,
        status: order.paymentStatus === "unpaid" ? "pending" : order.paymentStatus,
      })
    }

    const midtransOrderId = paymentCache?.midtransOrderId ?? `ML-${order.id}`
    const payload = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: order.customer.name,
        email: order.customer.email ?? undefined,
        phone: order.customer.phone,
      },
      custom_field1: order.id,
    }

    const response = await fetch(`${getMidtransSnapBaseUrl()}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: getMidtransAuthHeader(serverKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = (await response.json()) as MidtransSnapResponse

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.status_message || "Gagal membuat Snap Midtrans",
          error_code: data.status_code,
          errors: data.validation_messages ?? data.error_messages ?? data,
        },
        { status: response.status }
      )
    }

    if (!data.token || !data.redirect_url) {
      return NextResponse.json(
        { message: "Midtrans tidak mengembalikan token Snap." },
        { status: 502 }
      )
    }

    await prisma.$executeRaw`
      UPDATE "Order"
      SET
        "paymentStatus" = 'pending',
        "paymentProvider" = 'midtrans',
        "midtransOrderId" = ${midtransOrderId},
        "midtransSnapToken" = ${data.token},
        "midtransRedirectUrl" = ${data.redirect_url}
      WHERE "id" = ${order.id}
    `

    return NextResponse.json({
      ...data,
      id: data.token,
      reference_id: midtransOrderId,
      order_id: midtransOrderId,
      client_key: clientKey,
      snap_script_url: `${getMidtransSnapBaseUrl()}/snap/snap.js`,
      status: "pending",
    })
  } catch (error) {
    console.error("Create QRIS error:", error)

    return NextResponse.json(
      { message: "Gagal membuat QRIS." },
      { status: 500 }
    )
  }
}

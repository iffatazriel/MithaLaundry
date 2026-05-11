import { NextResponse } from "next/server"
import { requireApiSession } from "@/lib/auth/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type MidtransSimulateResponse = {
  transaction_id?: string | null
  status?: string
  transaction_status?: string
  order_id?: string | null
  message?: string
}

type MidtransSimulationCache = {
  midtransOrderId: string | null
  midtransTransactionId: string | null
  midtransSnapToken: string | null
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

    const [paymentCache] = await prisma.$queryRaw<MidtransSimulationCache[]>`
      SELECT "midtransOrderId", "midtransTransactionId", "midtransSnapToken"
      FROM "Order"
      WHERE "id" = ${order.id}
      LIMIT 1
    `

    if (!paymentCache?.midtransOrderId || !paymentCache.midtransSnapToken) {
      return NextResponse.json(
        { message: "Buat Snap payment terlebih dahulu sebelum simulasi pembayaran." },
        { status: 400 }
      )
    }

    await prisma.$executeRaw`
      UPDATE "Order"
      SET
        "paymentStatus" = 'paid',
        "paymentProvider" = 'midtrans',
        "paidAt" = NOW()
      WHERE "id" = ${order.id}
    `

    const data: MidtransSimulateResponse = {
      transaction_id: paymentCache.midtransTransactionId,
      order_id: paymentCache.midtransOrderId,
      status: "settlement",
      transaction_status: "settlement",
      message: "Simulasi pembayaran Midtrans berhasil.",
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

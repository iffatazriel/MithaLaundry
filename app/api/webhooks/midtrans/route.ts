import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  mapMidtransPaymentStatus,
  verifyMidtransSignature,
  type MidtransNotificationBody,
} from "@/lib/payment/midtrans"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY

    if (!serverKey) {
      return NextResponse.json(
        { received: false, message: "MIDTRANS_SERVER_KEY belum dikonfigurasi." },
        { status: 500 }
      )
    }

    const body = (await req.json()) as MidtransNotificationBody

    if (!body.order_id) {
      return NextResponse.json({
        received: true,
        message: "Midtrans webhook test received",
      })
    }

    if (!verifyMidtransSignature(body, serverKey)) {
      return NextResponse.json(
        { received: false, message: "Invalid Midtrans signature" },
        { status: 401 }
      )
    }

    const paymentStatus = mapMidtransPaymentStatus(body)

    if (!paymentStatus) {
      return NextResponse.json({ received: true, ignored: true })
    }

    const updatedCount = await prisma.$executeRaw`
      UPDATE "Order"
      SET
        "paymentStatus" = ${paymentStatus},
        "paymentProvider" = 'midtrans',
        "midtransTransactionId" = ${body.transaction_id ?? null},
        "paidAt" = CASE
          WHEN ${paymentStatus} = 'paid' THEN NOW()
          ELSE "paidAt"
        END
      WHERE "midtransOrderId" = ${body.order_id}
    `

    if (updatedCount === 0) {
      console.warn("Midtrans webhook order not found:", body.order_id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Midtrans webhook error:", error)

    return NextResponse.json(
      { received: false, message: "Midtrans webhook error" },
      { status: 500 }
    )
  }
}

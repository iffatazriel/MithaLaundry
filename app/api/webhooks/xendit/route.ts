import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type XenditWebhookBody = {
  event?: string
  id?: string
  status?: string
  amount?: number
  reference_id?: string
  qr_code?: {
    id?: string
    external_id?: string
    reference_id?: string
    status?: string
  }
  data?: {
    id?: string
    status?: string
    reference_id?: string
    qr_code?: {
      id?: string
      external_id?: string
      reference_id?: string
      status?: string
    }
  }
}

function getReferenceId(body: XenditWebhookBody) {
  return (
    body.qr_code?.reference_id ??
    body.qr_code?.external_id ??
    body.reference_id ??
    body.data?.qr_code?.reference_id ??
    body.data?.qr_code?.external_id ??
    body.data?.reference_id ??
    ""
  )
}

function getPaymentStatus(body: XenditWebhookBody) {
  return (
    body.status ??
    body.qr_code?.status ??
    body.data?.status ??
    body.data?.qr_code?.status ??
    ""
  ).toUpperCase()
}

export async function POST(req: Request) {
  try {
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN

    if (expectedToken) {
      const callbackToken = req.headers.get("x-callback-token")

      if (callbackToken !== expectedToken) {
        return NextResponse.json(
          { received: false, message: "Invalid webhook token" },
          { status: 401 }
        )
      }
    }

    const body = (await req.json()) as XenditWebhookBody

    console.log("XENDIT WEBHOOK:", body)

    const referenceId = getReferenceId(body)

    // Untuk test webhook dari Xendit
    if (!referenceId) {
      return NextResponse.json({
        received: true,
        message: "Webhook test received",
      })
    }

    const paymentStatus = getPaymentStatus(body)

    if (paymentStatus === "COMPLETED" || paymentStatus === "SUCCEEDED") {
      const result = await prisma.order.updateMany({
        where: { xenditReferenceId: referenceId },
        data: {
          paymentStatus: "paid",
          paymentProvider: "xendit",
          xenditPaymentId: body.id ?? body.data?.id ?? null,
          xenditQrId: body.qr_code?.id ?? body.data?.qr_code?.id ?? undefined,
          paidAt: new Date(),
        },
      })

      if (result.count === 0) {
        console.warn("Xendit webhook order not found:", referenceId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)

    return NextResponse.json(
      { received: false, message: "Webhook error" },
      { status: 500 }
    )
  }
}

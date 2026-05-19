import { NextResponse } from "next/server"
import { requireApiSession } from "@/lib/auth/server"
import { prisma } from "@/lib/prisma"
import { isOrderStatus } from "@/lib/orders/validation"

type OrderTransaction = Pick<typeof prisma, "order" | "orderStatusHistory">

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireApiSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const body = await req.json()
  const nextStatus = String(body.status ?? "").trim().toLowerCase()

  if (!isOrderStatus(nextStatus)) {
    return NextResponse.json(
      { error: "Status order tidak valid." },
      { status: 400 }
    )
  }

  const existingOrder = await prisma.order.findUnique({
    where: { id },
    select: { id: true, status: true },
  })

  if (!existingOrder) {
    return NextResponse.json(
      { error: "Order tidak ditemukan." },
      { status: 404 }
    )
  }

  if (existingOrder.status === nextStatus) {
    return NextResponse.json(existingOrder)
  }

  const order = await prisma.$transaction(async (tx: OrderTransaction) => {
    const updatedOrder = await tx.order.update({
      where: { id },
      data: {
        status: nextStatus,
      },
    })

    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        fromStatus: existingOrder.status,
        toStatus: nextStatus,
        note: typeof body.note === "string" ? body.note.trim() || null : null,
        changedBy: session.email,
      },
    })

    return updatedOrder
  })

  return NextResponse.json(order)
}

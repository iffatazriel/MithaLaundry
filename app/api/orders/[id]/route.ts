import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
    },
  })

  return NextResponse.json(order)
}
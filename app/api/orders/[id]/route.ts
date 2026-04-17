import { NextResponse } from "next/server"
import { requireApiSession } from "@/lib/auth/server"
import { prisma } from "@/lib/prisma"

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

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
    },
  })

  return NextResponse.json(order)
}

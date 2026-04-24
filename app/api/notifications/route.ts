import { NextResponse } from 'next/server'
import { requireApiSession } from '@/lib/auth/server'
import { getTopbarNotifications } from '@/lib/notifications'

export async function GET() {
  try {
    const session = await requireApiSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getTopbarNotifications()
    return NextResponse.json(payload)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Get the event
    const event = await prisma.event.findUnique({
      where: { slug },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Get the latest 50 posts ordered by postedAt desc
    const posts = await prisma.sourcePost.findMany({
      where: { eventId: event.id },
      orderBy: { postedAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      event,
      posts,
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

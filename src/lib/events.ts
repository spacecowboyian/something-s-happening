import { prisma } from './db'
import { Event, EventStatus } from '@prisma/client'

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return prisma.event.findUnique({
    where: { slug },
  })
}

export async function listEvents(): Promise<Event[]> {
  return prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function createEvent(data: {
  slug: string
  title: string
  description?: string
  centerLat?: number
  centerLng?: number
  radiusMeters?: number
  startsAt: Date
  endsAt?: Date
  status?: EventStatus
}): Promise<Event> {
  return prisma.event.create({
    data,
  })
}

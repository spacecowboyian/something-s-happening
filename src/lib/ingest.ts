import { prisma } from './db'
import { SourcePost, Platform, MediaType } from '@prisma/client'

export async function upsertSourcePost(
  eventId: string,
  postData: {
    platform: Platform
    platformPostId: string
    url: string
    authorHandle?: string
    postedAt: Date
    lat?: number
    lng?: number
    mediaType: MediaType
    text?: string
  }
): Promise<SourcePost> {
  return prisma.sourcePost.upsert({
    where: {
      platform_platformPostId: {
        platform: postData.platform,
        platformPostId: postData.platformPostId,
      },
    },
    update: {
      url: postData.url,
      authorHandle: postData.authorHandle,
      postedAt: postData.postedAt,
      lat: postData.lat,
      lng: postData.lng,
      mediaType: postData.mediaType,
      text: postData.text,
    },
    create: {
      ...postData,
      eventId,
    },
  })
}

export async function listEventPosts(eventId: string): Promise<SourcePost[]> {
  return prisma.sourcePost.findMany({
    where: { eventId },
    orderBy: { postedAt: 'desc' },
  })
}

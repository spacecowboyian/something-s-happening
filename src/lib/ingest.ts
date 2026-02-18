import { prisma } from './db'
import { SourcePost, Platform, MediaType } from '@prisma/client'
import type { TimelineItem } from '@/app/event/components/PlayableTimeline/PlayableTimeline'

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

/**
 * Convert a SourcePost to a TimelineItem for display in the event view
 */
export function sourcePostToTimelineItem(post: SourcePost): TimelineItem {
  // Map MediaType enum to TimelineItem mediaType
  const mediaTypeMap: Record<MediaType, TimelineItem['mediaType']> = {
    [MediaType.VIDEO]: 'video',
    [MediaType.IMAGE]: 'image',
    [MediaType.AUDIO]: 'audio',
    [MediaType.TEXT]: 'text',
    [MediaType.LINK]: 'text',
  }

  // Determine mediaUrl based on platform and mediaType
  let mediaUrl: string | undefined
  if (post.mediaType === MediaType.VIDEO && post.platform === Platform.YOUTUBE) {
    // YouTube videos use the URL as the mediaUrl
    mediaUrl = post.url
  }

  return {
    id: post.id,
    timestamp: post.postedAt,
    source: post.authorHandle || `${post.platform} User`,
    sourceUrl: post.url,
    content: post.text || '',
    mediaType: mediaTypeMap[post.mediaType],
    mediaUrl,
  }
}

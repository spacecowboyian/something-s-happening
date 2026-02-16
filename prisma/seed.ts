import 'dotenv/config'
import { PrismaClient, Platform, MediaType, EventStatus } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // Create a sample event
  const event = await prisma.event.upsert({
    where: { slug: 'sample-event' },
    update: {},
    create: {
      slug: 'sample-event',
      title: 'Sample Event',
      description: 'This is a sample event for testing the database',
      centerLat: 37.7749,
      centerLng: -122.4194,
      radiusMeters: 5000,
      startsAt: new Date('2024-01-01T00:00:00Z'),
      endsAt: new Date('2024-12-31T23:59:59Z'),
      status: EventStatus.OPEN,
    },
  })

  console.log('Created event:', event.slug)

  // Create 5 sample source posts
  const samplePosts = [
    {
      platform: Platform.X,
      platformPostId: 'x-post-1',
      url: 'https://x.com/user/status/1',
      authorHandle: '@user1',
      postedAt: new Date('2024-06-01T12:00:00Z'),
      lat: 37.7749,
      lng: -122.4194,
      mediaType: MediaType.TEXT,
      text: 'First sample post from X',
      eventId: event.id,
    },
    {
      platform: Platform.BLUESKY,
      platformPostId: 'bsky-post-1',
      url: 'https://bsky.app/profile/user/post/1',
      authorHandle: '@user2.bsky.social',
      postedAt: new Date('2024-06-02T14:30:00Z'),
      lat: 37.7849,
      lng: -122.4094,
      mediaType: MediaType.IMAGE,
      text: 'Sample post from Bluesky with image',
      eventId: event.id,
    },
    {
      platform: Platform.YOUTUBE,
      platformPostId: 'yt-video-1',
      url: 'https://youtube.com/watch?v=abc123',
      authorHandle: 'YouTuber123',
      postedAt: new Date('2024-06-03T10:15:00Z'),
      mediaType: MediaType.VIDEO,
      text: 'Sample YouTube video',
      eventId: event.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'x-post-2',
      url: 'https://x.com/user/status/2',
      authorHandle: '@user3',
      postedAt: new Date('2024-06-04T16:45:00Z'),
      lat: 37.7649,
      lng: -122.4294,
      mediaType: MediaType.LINK,
      text: 'Check out this link!',
      eventId: event.id,
    },
    {
      platform: Platform.OTHER,
      platformPostId: 'other-post-1',
      url: 'https://example.com/post/1',
      authorHandle: 'anonymous',
      postedAt: new Date('2024-06-05T09:00:00Z'),
      mediaType: MediaType.TEXT,
      text: 'Post from another platform',
      eventId: event.id,
    },
  ]

  for (const post of samplePosts) {
    await prisma.sourcePost.upsert({
      where: {
        platform_platformPostId: {
          platform: post.platform,
          platformPostId: post.platformPostId,
        },
      },
      update: post,
      create: post,
    })
    console.log(`Created post: ${post.platformPostId}`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

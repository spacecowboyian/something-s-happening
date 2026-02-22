import 'dotenv/config'
import { PrismaClient, Platform, MediaType, EventStatus } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // Create Super Bowl LX 2026 event with streaker incident
  const superBowlEvent = await prisma.event.upsert({
    where: { slug: 'superbowl-lx-2026' },
    update: {},
    create: {
      slug: 'superbowl-lx-2026',
      title: 'Super Bowl LX 2026',
      description: 'Super Bowl LX at Levi\'s Stadium - An unforgettable game with an unexpected fourth quarter interruption',
      centerLat: 37.4030,
      centerLng: -121.9700,
      radiusMeters: 1000,
      startsAt: new Date('2026-02-09T01:30:00Z'), // 5:30 PM PT = 01:30 UTC next day
      endsAt: new Date('2026-02-09T05:00:00Z'),   // ~9:00 PM PT = 05:00 UTC next day
      status: EventStatus.CLOSED,
    },
  })

  console.log('Created event:', superBowlEvent.slug)

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

  // Super Bowl LX streaker incident posts (8:00 PM - 11:59 PM PT on Feb 8, 2026)
  // Times in UTC: Feb 9, 2026 04:00:00Z - Feb 9, 2026 07:59:59Z
  const superBowlPosts = [
    // Initial reactions during game (8:05-8:15 PM PT)
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-1',
      url: 'https://x.com/NFLFanatic/status/1758234567890',
      authorHandle: '@NFLFanatic',
      postedAt: new Date('2026-02-09T04:05:00Z'), // 8:05 PM PT
      lat: 37.4030,
      lng: -121.9700,
      mediaType: MediaType.TEXT,
      text: 'LMAO SOMEONE JUST RAN ONTO THE FIELD IN THE MIDDLE OF THE SUPER BOWL 💀💀💀 Security is STRUGGLING #SuperBowlLX',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-2',
      url: 'https://x.com/SportsCenter/status/1758234589123',
      authorHandle: '@SportsCenter',
      postedAt: new Date('2026-02-09T04:08:00Z'), // 8:08 PM PT
      lat: 37.4030,
      lng: -121.9700,
      mediaType: MediaType.TEXT,
      text: 'BREAKING: Play has been stopped at Super Bowl LX after a streaker ran onto the field with 12:54 remaining in the 4th quarter',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.REDDIT,
      platformPostId: 'sb-reddit-1',
      url: 'https://reddit.com/r/nfl/comments/superbowl_streaker',
      authorHandle: 'u/FootballFan2026',
      postedAt: new Date('2026-02-09T04:10:00Z'), // 8:10 PM PT
      mediaType: MediaType.TEXT,
      text: 'Did that really just happen? Someone streaked across the field during the biggest game of the year. Security took like 30 seconds to catch them 😂',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-3',
      url: 'https://x.com/BleacherReport/status/1758234598765',
      authorHandle: '@BleacherReport',
      postedAt: new Date('2026-02-09T04:11:00Z'), // 8:11 PM PT
      mediaType: MediaType.TEXT,
      text: 'The streaker at Super Bowl LX just became the most talked about person at Levi\'s Stadium tonight',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.BLUESKY,
      platformPostId: 'sb-bsky-1',
      url: 'https://bsky.app/profile/sportsfan.bsky.social/post/abc123',
      authorHandle: '@sportsfan.bsky.social',
      postedAt: new Date('2026-02-09T04:12:00Z'), // 8:12 PM PT
      mediaType: MediaType.TEXT,
      text: 'That streaker had better moves than half the players on the field tonight ngl',
      eventId: superBowlEvent.id,
    },
    // More reactions (8:15-8:30 PM PT)
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-4',
      url: 'https://x.com/NFL_Memes/status/1758234612345',
      authorHandle: '@NFL_Memes',
      postedAt: new Date('2026-02-09T04:18:00Z'), // 8:18 PM PT
      mediaType: MediaType.TEXT,
      text: 'Security guard slipped trying to catch the streaker and fell flat on his face 💀 This Super Bowl has EVERYTHING',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.REDDIT,
      platformPostId: 'sb-reddit-2',
      url: 'https://reddit.com/r/sports/comments/sb_lx_streaker_vid',
      authorHandle: 'u/SuperBowlWatcher',
      postedAt: new Date('2026-02-09T04:22:00Z'), // 8:22 PM PT
      mediaType: MediaType.TEXT,
      text: 'The CBS broadcast cut away so fast but you could still hear the crowd going WILD. This is going to be legendary',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-5',
      url: 'https://x.com/TotalProSports/status/1758234634567',
      authorHandle: '@TotalProSports',
      postedAt: new Date('2026-02-09T04:25:00Z'), // 8:25 PM PT
      mediaType: MediaType.TEXT,
      text: 'The streaker delay might have actually given the offense time to reset their strategy. 4D chess move? 🤔 #SuperBowlLX',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-6',
      url: 'https://x.com/barstoolsports/status/1758234645678',
      authorHandle: '@barstoolsports',
      postedAt: new Date('2026-02-09T04:28:00Z'), // 8:28 PM PT
      mediaType: MediaType.TEXT,
      text: 'That streaker just paid $5000 for a stadium ban and internet immortality. Worth it tbh',
      eventId: superBowlEvent.id,
    },
    // Post-game reactions (9:00-10:00 PM PT)
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-7',
      url: 'https://x.com/SportsNation/status/1758234667890',
      authorHandle: '@SportsNation',
      postedAt: new Date('2026-02-09T05:15:00Z'), // 9:15 PM PT
      mediaType: MediaType.TEXT,
      text: 'In a game that will be remembered for an incredible comeback, somehow we\'re all still talking about the streaker',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.BLUESKY,
      platformPostId: 'sb-bsky-2',
      url: 'https://bsky.app/profile/nflnews.bsky.social/post/def456',
      authorHandle: '@nflnews.bsky.social',
      postedAt: new Date('2026-02-09T05:30:00Z'), // 9:30 PM PT
      mediaType: MediaType.TEXT,
      text: 'Security at Levi\'s Stadium has confirmed the streaker has been arrested and will face trespassing charges. Fine estimated at $5,000+',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-8',
      url: 'https://x.com/NFL/status/1758234689012',
      authorHandle: '@NFL',
      postedAt: new Date('2026-02-09T05:45:00Z'), // 9:45 PM PT
      mediaType: MediaType.TEXT,
      text: 'Despite the disruption, Super Bowl LX delivered an instant classic. What a game! 🏈',
      eventId: superBowlEvent.id,
    },
    // Late night social media buzz (10:00-11:00 PM PT)
    {
      platform: Platform.REDDIT,
      platformPostId: 'sb-reddit-3',
      url: 'https://reddit.com/r/SuperBowl/comments/streaker_video_mirror',
      authorHandle: 'u/MVPStreaker',
      postedAt: new Date('2026-02-09T06:10:00Z'), // 10:10 PM PT
      mediaType: MediaType.LINK,
      text: 'Mirror: Super Bowl LX Streaker Full Video (CBS tried to cut away but international feed caught it all)',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-9',
      url: 'https://x.com/TheScore/status/1758234712345',
      authorHandle: '@TheScore',
      postedAt: new Date('2026-02-09T06:25:00Z'), // 10:25 PM PT
      mediaType: MediaType.TEXT,
      text: '"Streaker at Super Bowl" is trending #1 worldwide. Over 2 million tweets in the last 2 hours',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-10',
      url: 'https://x.com/SInow/status/1758234734567',
      authorHandle: '@SInow',
      postedAt: new Date('2026-02-09T06:45:00Z'), // 10:45 PM PT
      mediaType: MediaType.TEXT,
      text: 'Sources: The Super Bowl streaker is a 23-year-old from San Jose who allegedly bet friends he would do it. He won the bet but lost his freedom (temporarily)',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.BLUESKY,
      platformPostId: 'sb-bsky-3',
      url: 'https://bsky.app/profile/comedian.bsky.social/post/ghi789',
      authorHandle: '@comedian.bsky.social',
      postedAt: new Date('2026-02-09T07:15:00Z'), // 11:15 PM PT
      mediaType: MediaType.TEXT,
      text: 'Imagine paying $10,000 for Super Bowl tickets just to get arrested for streaking. That\'s commitment to the bit 😂',
      eventId: superBowlEvent.id,
    },
    {
      platform: Platform.X,
      platformPostId: 'sb-streaker-11',
      url: 'https://x.com/espn/status/1758234756789',
      authorHandle: '@espn',
      postedAt: new Date('2026-02-09T07:50:00Z'), // 11:50 PM PT
      mediaType: MediaType.TEXT,
      text: 'Super Bowl LX will go down in history for many reasons. The streaker incident will definitely be one of them. Full recap coming on SportsCenter',
      eventId: superBowlEvent.id,
    },
  ]

  for (const post of superBowlPosts) {
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
    console.log(`Created Super Bowl post: ${post.platformPostId} (${post.platform})`)
  }

  // Create sample source posts including YouTube videos
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
      platformPostId: 'dQw4w9WgXcQ',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      authorHandle: 'Event Highlights',
      postedAt: new Date('2024-06-03T10:15:00Z'),
      mediaType: MediaType.VIDEO,
      text: 'Live Performance Highlights - Main Stage',
      eventId: event.id,
    },
    {
      platform: Platform.YOUTUBE,
      platformPostId: 'jNQXAC9IVRw',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      authorHandle: 'City Events Official',
      postedAt: new Date('2024-06-03T11:30:00Z'),
      mediaType: MediaType.VIDEO,
      text: 'Event Recap - Behind the Scenes',
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
    console.log(`Created post: ${post.platformPostId} (${post.platform})`)
  }

  console.log('Seed completed successfully!')
  console.log(`\n✅ Created ${samplePosts.length} sample posts including ${samplePosts.filter(p => p.platform === Platform.YOUTUBE).length} YouTube videos`)
  console.log(`✅ Created ${superBowlPosts.length} Super Bowl LX posts about the streaker incident`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

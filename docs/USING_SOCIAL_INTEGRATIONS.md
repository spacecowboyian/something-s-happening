# Using the Social Media Integrations

## Quick Start Example

Once you have API credentials set up, here's how to fetch social media posts for an event:

### Example: Fetch YouTube Videos for an Event

```typescript
import { searchYouTubeVideos, youtubeVideoToSourcePost } from '@/lib/youtube';
import { upsertSourcePost } from '@/lib/ingest';

// Define your event
const event = {
  id: 'event-123',
  title: 'Summer Music Festival 2026',
  location: 'Central Park, New York',
  latitude: 40.7829,
  longitude: -73.9654,
  startsAt: new Date('2026-06-15T18:00:00Z'),
  endsAt: new Date('2026-06-15T23:00:00Z'),
};

// Search for YouTube videos
const videos = await searchYouTubeVideos({
  query: `${event.title} ${event.location}`,
  location: `${event.latitude},${event.longitude}`,
  radius: '2km',
  maxResults: 20,
  publishedAfter: event.startsAt,
  publishedBefore: event.endsAt,
  order: 'date',
});

// Save videos to database
for (const video of videos) {
  const postData = youtubeVideoToSourcePost(video, event.id);
  await upsertSourcePost(event.id, postData);
}

console.log(`✅ Saved ${videos.length} YouTube videos to database`);
```

### Example: Fetch Bluesky Posts

```typescript
import { searchBlueskyPosts, blueskyPostToSourcePost } from '@/lib/bluesky';
import { upsertSourcePost } from '@/lib/ingest';

// Search Bluesky (no API key needed!)
const posts = await searchBlueskyPosts({
  query: 'Summer Music Festival Central Park',
  limit: 25,
  since: event.startsAt,
  until: event.endsAt,
});

// Save to database
for (const post of posts) {
  const postData = blueskyPostToSourcePost(post, event.id);
  await upsertSourcePost(event.id, postData);
}

console.log(`✅ Saved ${posts.length} Bluesky posts to database`);
```

### Example: Fetch Reddit Posts

```typescript
import { searchRedditPosts, redditPostToSourcePost } from '@/lib/reddit';
import { upsertSourcePost } from '@/lib/ingest';

// Search Reddit (no API key needed!)
const posts = await searchRedditPosts({
  query: 'Summer Music Festival Central Park 2026',
  limit: 25,
  sort: 'relevance',
  timeFilter: 'week',
  after: event.startsAt,
  before: event.endsAt,
});

// Save to database
for (const post of posts) {
  const postData = redditPostToSourcePost(post, event.id);
  await upsertSourcePost(event.id, postData);
}

console.log(`✅ Saved ${posts.length} Reddit posts to database`);
```

---

## Complete Integration Script

Here's a complete script that fetches from all available platforms:

```typescript
// scripts/fetch-event-social.ts
import { searchYouTubeVideos, youtubeVideoToSourcePost, isYouTubeConfigured } from '@/lib/youtube';
import { searchBlueskyPosts, blueskyPostToSourcePost, isBlueskyConfigured } from '@/lib/bluesky';
import { searchRedditPosts, redditPostToSourcePost, isRedditConfigured } from '@/lib/reddit';
import { upsertSourcePost } from '@/lib/ingest';
import { getEventBySlug } from '@/lib/events';

async function fetchSocialMediaForEvent(eventSlug: string) {
  // Get event from database
  const event = await getEventBySlug(eventSlug);
  if (!event) {
    throw new Error(`Event not found: ${eventSlug}`);
  }

  console.log(`\n🔍 Fetching social media for: ${event.title}\n`);

  let totalPosts = 0;

  // 1. Fetch from YouTube (if configured)
  if (isYouTubeConfigured()) {
    console.log('📺 Fetching YouTube videos...');
    try {
      const videos = await searchYouTubeVideos({
        query: `${event.title}`,
        location: event.centerLat && event.centerLng 
          ? `${event.centerLat},${event.centerLng}` 
          : undefined,
        radius: event.radiusMeters ? `${Math.floor(event.radiusMeters / 1000)}km` : '5km',
        maxResults: 20,
        publishedAfter: event.startsAt,
        publishedBefore: event.endsAt || undefined,
        order: 'date',
      });

      for (const video of videos) {
        const postData = youtubeVideoToSourcePost(video, event.id);
        await upsertSourcePost(event.id, postData);
      }

      console.log(`  ✅ Saved ${videos.length} YouTube videos`);
      totalPosts += videos.length;
    } catch (error) {
      console.error('  ❌ YouTube fetch failed:', error);
    }
  } else {
    console.log('  ⏭️  YouTube: Not configured (YOUTUBE_API_KEY missing)');
  }

  // 2. Fetch from Bluesky (always available)
  if (isBlueskyConfigured()) {
    console.log('🦋 Fetching Bluesky posts...');
    try {
      const posts = await searchBlueskyPosts({
        query: event.title,
        limit: 25,
        since: event.startsAt,
        until: event.endsAt || undefined,
      });

      for (const post of posts) {
        const postData = blueskyPostToSourcePost(post, event.id);
        await upsertSourcePost(event.id, postData);
      }

      console.log(`  ✅ Saved ${posts.length} Bluesky posts`);
      totalPosts += posts.length;
    } catch (error) {
      console.error('  ❌ Bluesky fetch failed:', error);
    }
  }

  // 3. Fetch from Reddit (always available)
  if (isRedditConfigured()) {
    console.log('🔴 Fetching Reddit posts...');
    try {
      const posts = await searchRedditPosts({
        query: event.title,
        limit: 25,
        sort: 'relevance',
        timeFilter: 'all',
        after: event.startsAt,
        before: event.endsAt || undefined,
      });

      for (const post of posts) {
        const postData = redditPostToSourcePost(post, event.id);
        await upsertSourcePost(event.id, postData);
      }

      console.log(`  ✅ Saved ${posts.length} Reddit posts`);
      totalPosts += posts.length;
    } catch (error) {
      console.error('  ❌ Reddit fetch failed:', error);
    }
  }

  console.log(`\n🎉 Total: Saved ${totalPosts} posts from social media\n`);
}

// Usage
fetchSocialMediaForEvent('sample-event').catch(console.error);
```

---

## API Module Reference

### Available Functions

Each platform module (`youtube.ts`, `bluesky.ts`, `reddit.ts`, etc.) exports:

1. **Search function** - Fetch posts/videos
   - `searchYouTubeVideos(params)`
   - `searchBlueskyPosts(params)`
   - `searchRedditPosts(params)`
   - `searchXTweets(params)` (if configured)

2. **Converter function** - Convert to SourcePost format
   - `youtubeVideoToSourcePost(video, eventId)`
   - `blueskyPostToSourcePost(post, eventId)`
   - `redditPostToSourcePost(post, eventId)`
   - `xTweetToSourcePost(tweet, eventId)`

3. **Config check** - Check if API is configured
   - `isYouTubeConfigured()`
   - `isBlueskyConfigured()` (always true)
   - `isRedditConfigured()` (always true)
   - `isXConfigured()`

---

## Database Integration

All posts are saved using the `upsertSourcePost` function:

```typescript
import { upsertSourcePost } from '@/lib/ingest';

await upsertSourcePost(eventId, {
  platform: 'YOUTUBE',           // Platform enum
  platformPostId: 'dQw4w9WgXcQ',  // Unique ID from platform
  url: 'https://youtube.com/...',
  authorHandle: '@channel_name',
  postedAt: new Date('2026-06-15T20:00:00Z'),
  lat: 40.7829,                   // Optional
  lng: -73.9654,                  // Optional
  mediaType: 'VIDEO',             // MediaType enum
  text: 'Video description',
});
```

The database schema (Prisma) automatically:
- Prevents duplicates (unique constraint on platform + platformPostId)
- Updates existing posts if re-fetched
- Associates posts with events via eventId

---

## Rate Limits & Best Practices

### YouTube
- 10,000 units/day free
- Search: 100 units each (max ~100 searches/day)
- Cache results, don't re-fetch

### Bluesky
- Public API, generous limits
- No auth required
- Be respectful with request rate

### Reddit
- 60 requests/min without auth
- Add `User-Agent` header
- Respect rate limits

### X/Twitter (if using)
- $100/month for 10,000 tweets
- Basic plan has low limits
- Consider alternatives

---

## Next Steps

1. Get API credentials (see `docs/API_CREDENTIALS_QUICK_REF.md`)
2. Test individual platforms with example code above
3. Create script to fetch for your events
4. Set up scheduled job (cron/GitHub Actions) for regular updates

For setup instructions, see: `docs/SOCIAL_API_SETUP.md`

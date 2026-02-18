# Scraping Real Social Media Posts

This guide explains how to scrape real posts from social media platforms and populate the database with actual content.

## Overview

The repository includes integration modules for:
- **YouTube** - Video search via YouTube Data API v3
- **Reddit** - Public API, no authentication required
- **Bluesky** - Public API, no authentication required
- **X/Twitter** - Requires paid API access ($100/month)

## Quick Start

### 1. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="file:prisma/dev.db"

# YouTube Data API v3 (Required)
YOUTUBE_API_KEY="your-api-key-here"

# Reddit (Optional - uses default user agent)
REDDIT_USER_AGENT="something-s-happening/0.1"
```

### 2. Run the Scraping Script

```bash
# Initialize database
npx prisma db push
npx prisma db seed

# Run the scraper
npx tsx scripts/scrape-superbowl-posts.ts
```

## How It Works

The scraping script (`scripts/scrape-superbowl-posts.ts`) does the following:

1. **Connects to database** - Finds the target event by slug
2. **Searches each platform** - Uses platform-specific APIs to search for relevant posts
3. **Converts format** - Transforms platform-specific data to `SourcePost` format
4. **Saves to database** - Uses `upsertSourcePost` to avoid duplicates

### Data Flow

```
Social Media API → Platform Module → Converter Function → Database
     ↓                    ↓                   ↓              ↓
  YouTube           youtube.ts        youtubeVideoToSourcePost    SourcePost
  Reddit            reddit.ts         redditPostToSourcePost      SourcePost
  Bluesky           bluesky.ts        blueskyPostToSourcePost     SourcePost
```

## Platform-Specific Details

### Reddit (No Auth Required)

**Advantages:**
- ✅ Free, no API key needed
- ✅ Search by keyword, subreddit, time range
- ✅ Rich post metadata (title, text, author, timestamp)

**Example:**
```typescript
import { searchRedditPosts, redditPostToSourcePost } from './src/lib/reddit'
import { upsertSourcePost } from './src/lib/ingest'

const posts = await searchRedditPosts({
  query: 'Super Bowl streaker',
  subreddit: 'nfl',  // optional
  limit: 25,
  sort: 'top',
  timeFilter: 'week'
})

for (const post of posts) {
  const postData = redditPostToSourcePost(post, eventId)
  await upsertSourcePost(eventId, postData)
}
```

### Bluesky (No Auth Required)

**Advantages:**
- ✅ Free, no API key needed
- ✅ Public API for read access
- ✅ Real-time search

**Example:**
```typescript
import { searchBlueskyPosts, blueskyPostToSourcePost } from './src/lib/bluesky'

const posts = await searchBlueskyPosts({
  query: 'Super Bowl',
  limit: 25,
  since: '2026-02-08T00:00:00Z'
})

for (const post of posts) {
  const postData = blueskyPostToSourcePost(post, eventId)
  await upsertSourcePost(eventId, postData)
}
```

### YouTube (API Key Required)

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable "YouTube Data API v3"
4. Create API Key
5. Add to `.env`: `YOUTUBE_API_KEY="your-key"`

**Example:**
```typescript
import { searchYouTubeVideos, youtubeVideoToSourcePost } from './src/lib/youtube'

const videos = await searchYouTubeVideos({
  query: 'Super Bowl highlights',
  maxResults: 10,
  order: 'date',
  publishedAfter: '2026-02-08T00:00:00Z'
})

for (const video of videos) {
  const postData = youtubeVideoToSourcePost(video, eventId)
  await upsertSourcePost(eventId, postData)
}
```

## Scraping Script Explained

The `scripts/scrape-superbowl-posts.ts` script demonstrates the complete workflow:

```typescript
// 1. Connect to database
const prisma = new PrismaClient({ adapter })

// 2. Get event
const event = await prisma.event.findUnique({
  where: { slug: 'superbowl-lx-2026' }
})

// 3. Search Reddit
const redditPosts = await searchRedditPosts({
  query: 'Super Bowl streaker',
  limit: 10,
  sort: 'top'
})

// 4. Convert and save
for (const post of redditPosts) {
  const postData = redditPostToSourcePost(post, event.id)
  await upsertSourcePost(event.id, postData)
}

// 5. Repeat for other platforms...
```

## Customizing for Your Event

To scrape posts for a different event:

1. **Create the event in seed.ts:**
```typescript
const myEvent = await prisma.event.create({
  slug: 'my-event-2026',
  title: 'My Event Title',
  centerLat: 37.7749,
  centerLng: -122.4194,
  startsAt: new Date('2026-06-01T00:00:00Z'),
  endsAt: new Date('2026-06-02T00:00:00Z'),
})
```

2. **Modify the scraping script:**
```typescript
// Change the event slug
const event = await prisma.event.findUnique({
  where: { slug: 'my-event-2026' }  // ← Change this
})

// Change search queries
const redditPosts = await searchRedditPosts({
  query: 'my event keywords',  // ← Change this
  limit: 25,
  after: event.startsAt,
  before: event.endsAt,
})
```

3. **Run the scraper:**
```bash
npx tsx scripts/scrape-superbowl-posts.ts
```

## Rate Limits & Best Practices

### Reddit
- **Limit:** 60 requests/minute (no auth)
- **Tip:** Add 2-second delay between requests
- **Best Practice:** Cache results, don't re-scrape

### Bluesky  
- **Limit:** Generous (no documented limit)
- **Tip:** Be respectful, add delays
- **Best Practice:** Search incrementally, not all at once

### YouTube
- **Limit:** 10,000 units/day (free tier)
- **Cost:** Search = 100 units, Video details = 1 unit
- **Tip:** Use video details API instead of search when possible
- **Best Practice:** Cache video IDs, fetch details in batch

## Troubleshooting

### "No posts found"
- Check search query relevance
- Adjust time filters
- Try different keywords
- Check API quotas

### "API key not valid"
- Verify key is correct in `.env`
- Check API is enabled in Google Cloud Console
- Wait 5 minutes after creating new key

### "Rate limit exceeded"
- Add delays between requests (`setTimeout`)
- Reduce batch sizes
- Wait for quota reset (varies by platform)

### Network errors in sandboxed environments
- The scraping script requires internet access
- Run locally or in environment with network access
- Cannot scrape from GitHub Actions or similar sandboxed CI

## Next Steps

1. **Get API credentials** (see `docs/API_CREDENTIALS_QUICK_REF.md`)
2. **Run the scraper** locally with network access
3. **Verify posts** appear in the event timeline
4. **Customize** queries for your specific use case

For more details on API setup, see:
- `docs/SOCIAL_API_SETUP.md` - Detailed setup guide
- `docs/USING_SOCIAL_INTEGRATIONS.md` - Usage examples

# YouTube API Integration Guide

## Overview
This guide explains how to integrate YouTube Data API v3 into "Something's Happening" to fetch event-related videos.

## Do You Need an API Key?

**YES** - YouTube Data API v3 requires a free API key from Google Cloud Console.

## Getting Your YouTube API Key

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "something-s-happening"

### Step 2: Enable YouTube Data API v3
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### Step 3: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key (starts with `AIza...`)
4. (Optional) Restrict the key to YouTube Data API v3 only for security

### Step 4: Add to Your Environment
Create or update `.env` file in your project root:

```bash
DATABASE_URL="file:./dev.db"
YOUTUBE_API_KEY="AIzaSy...your-key-here"
```

**Important**: Never commit your API key to git! The `.env` file is already in `.gitignore`.

## Cost & Quota

### Free Tier
- **Daily Quota**: 10,000 units/day
- **Cost**: $0 (free forever for basic usage)

### Unit Costs
- **Search query**: 100 units (100 searches/day free)
- **Video details**: 1 unit (10,000 requests/day free)
- **List videos by channel**: 1 unit

### Example Usage for MVP
If you search for videos 50 times/day and fetch details for 200 videos/day:
- Search: 50 × 100 = 5,000 units
- Details: 200 × 1 = 200 units
- **Total**: 5,200 units/day (well within free quota)

### If You Need More
- $0 - 10,000 units: FREE
- Above 10,000 units: Pay as you go (very cheap)
- Most MVPs never exceed free tier

## What You Can Search For

### 1. Location-Based Search
Search for videos near an event location:
```typescript
searchVideos({
  location: '40.7829,-73.9654',  // Central Park, NY
  locationRadius: '1km',
  q: 'concert music festival',
  publishedAfter: '2026-02-17T00:00:00Z'
})
```

### 2. Keyword Search
Search by event keywords:
```typescript
searchVideos({
  q: 'NBA Finals Game 7 Madison Square Garden',
  publishedAfter: '2026-02-15T00:00:00Z',
  publishedBefore: '2026-02-16T00:00:00Z'
})
```

### 3. Live Videos
Find live streams for ongoing events:
```typescript
searchVideos({
  q: 'marathon 2026',
  eventType: 'live',
  type: 'video'
})
```

## API Response Example

```json
{
  "items": [
    {
      "id": { "videoId": "dQw4w9WgXcQ" },
      "snippet": {
        "title": "Summer Music Festival 2026 - Main Stage",
        "description": "Live performance from Central Park",
        "thumbnails": {
          "default": { "url": "...", "width": 120, "height": 90 },
          "medium": { "url": "...", "width": 320, "height": 180 },
          "high": { "url": "...", "width": 480, "height": 360 }
        },
        "channelTitle": "Event Videographer",
        "publishedAt": "2026-02-17T00:30:00Z"
      }
    }
  ]
}
```

## Integration with Database

YouTube videos will be stored as `Media` items with:
- `type`: "video"
- `source`: "youtube"
- `sourceId`: Video ID (e.g., "dQw4w9WgXcQ")
- `url`: Full YouTube URL (e.g., "https://youtube.com/watch?v=dQw4w9WgXcQ")
- `thumbnailUrl`: YouTube thumbnail URL
- `title`: Video title
- `description`: Video description
- `author`: Channel name
- `timestamp`: Published date

## Usage Example

```typescript
import { searchYouTubeVideos } from '@/lib/youtube';

// Search for event videos
const videos = await searchYouTubeVideos({
  query: 'Summer Music Festival Central Park',
  location: '40.7829,-73.9654',
  radius: '2km',
  maxResults: 10,
  publishedAfter: event.startTime,
  publishedBefore: event.endTime
});

// Save to database
for (const video of videos) {
  await prisma.media.create({
    data: {
      eventId: event.id,
      type: 'video',
      source: 'youtube',
      sourceId: video.id,
      url: `https://youtube.com/watch?v=${video.id}`,
      thumbnailUrl: video.thumbnail,
      title: video.title,
      description: video.description,
      author: video.channelTitle,
      timestamp: new Date(video.publishedAt)
    }
  });
}
```

## Rate Limiting Best Practices

1. **Cache Results**: Store videos in database, don't re-fetch
2. **Batch Requests**: Fetch multiple video details in one request (up to 50)
3. **Monitor Quota**: Track your daily usage in Google Cloud Console
4. **Use Webhooks**: For live events, consider YouTube's push notifications

## Security Best Practices

1. ✅ Store API key in `.env` (already gitignored)
2. ✅ Never expose API key in client-side code
3. ✅ Use server-side API routes only
4. ✅ Restrict API key to YouTube Data API v3 in Google Cloud Console
5. ✅ Add HTTP referrer or IP restrictions if hosting on known domain

## Troubleshooting

### "API key not valid" Error
- Check that YouTube Data API v3 is enabled in Google Cloud Console
- Verify API key is copied correctly to `.env`
- Check if API key has restrictions that block your usage

### "Quota exceeded" Error
- You've used more than 10,000 units today
- Wait until midnight Pacific Time for quota reset
- Or enable billing in Google Cloud Console for pay-as-you-go

### "Video not available" Error
- Video may be private, deleted, or region-restricted
- Check video availability before saving to database
- Handle gracefully in UI (show placeholder or skip)

## Next Steps

1. Get your YouTube API key (5 minutes)
2. Add to `.env` file
3. Run the YouTube fetcher utility
4. Test with sample event
5. Integrate with frontend timeline

See `/src/lib/youtube.ts` for the implementation.

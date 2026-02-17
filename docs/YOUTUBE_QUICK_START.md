# YouTube API Integration - Quick Start

## YES, You Need an API Key! 🔑

**YouTube Data API v3 requires a FREE API key from Google Cloud Console.**

## Get Your Key (5 minutes)

1. **Go to**: https://console.cloud.google.com/
2. **Create** a new project (or use existing)
3. **Enable** "YouTube Data API v3" in API Library
4. **Create** Credentials > API Key
5. **Copy** the key (starts with `AIza...`)
6. **Add to `.env`**:
   ```bash
   YOUTUBE_API_KEY="AIzaSy...your-key-here"
   ```

## Cost: FREE Forever! 💰

- **Daily Quota**: 10,000 units (FREE)
- **Search**: 100 units per query = 100 searches/day free
- **Video Details**: 1 unit = 10,000 requests/day free
- **Typical MVP Usage**: ~5,000 units/day (well within free tier)

## Test It Now

```bash
# 1. Add your API key to .env
echo 'YOUTUBE_API_KEY="your-key-here"' >> .env

# 2. Test the integration
npm run test:youtube
```

## What You Can Do

### Search by Location
```typescript
import { searchYouTubeVideos } from '@/lib/youtube';

const videos = await searchYouTubeVideos({
  query: 'concert',
  location: '40.7829,-73.9654',  // Central Park, NY
  radius: '5km',
  maxResults: 10
});
```

### Search by Event
```typescript
import { searchEventVideos } from '@/lib/youtube';

const videos = await searchEventVideos({
  title: 'Summer Music Festival',
  latitude: 40.7829,
  longitude: -73.9654,
  startTime: new Date('2026-06-15T18:00:00Z'),
  endTime: new Date('2026-06-15T23:00:00Z')
});
```

### Find Live Streams
```typescript
const liveVideos = await searchYouTubeVideos({
  query: 'marathon 2026',
  eventType: 'live',
  order: 'date'
});
```

## Already Working!

The seed data now includes YouTube videos:
- ✅ Summer Music Festival → YouTube video
- ✅ City Marathon → YouTube video
- ✅ Database schema supports `source: 'youtube'`
- ✅ Thumbnails and metadata included

Run `npm run db:seed` to see them!

## Files Added

- 📄 `docs/YOUTUBE_API_GUIDE.md` - Complete guide
- 📄 `src/lib/youtube.ts` - YouTube API utilities
- 📄 `scripts/test-youtube.ts` - Test script
- 📄 `.env.example` - Environment template
- 📄 `docs/YOUTUBE_QUICK_START.md` - This file

## Next Steps

1. Get your YouTube API key (5 min)
2. Add to `.env` file
3. Run `npm run test:youtube`
4. Use in your event timeline!

## Need Help?

- Full guide: `docs/YOUTUBE_API_GUIDE.md`
- Code examples: `src/lib/youtube.ts`
- Test script: `scripts/test-youtube.ts`

**Questions about quota, costs, or setup?** See the full guide!

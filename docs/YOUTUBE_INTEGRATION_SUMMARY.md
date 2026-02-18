# YouTube API Integration - Complete Summary

## Your Question

> "Is there any way to add YouTube to the API? Do I need to provide an API key?"

## Answer

**YES on both counts!**

1. ✅ **YouTube is now integrated** - Full API utilities, documentation, and sample data
2. ✅ **You need an API key** - But it's FREE and takes 5 minutes to get

---

## What's Been Added

### 1. YouTube API Utilities (`src/lib/youtube.ts`)

Full-featured TypeScript module with:
- **Search videos** by keywords, location, and time
- **Get video details** efficiently (batch requests)
- **Event-specific search** combining location + time + keywords
- **Type-safe interfaces** for all responses
- **Error handling** with helpful messages
- **Quota tracking** utilities

**Example Usage:**
```typescript
import { searchYouTubeVideos } from '@/lib/youtube';

// Search near Central Park for concert videos
const videos = await searchYouTubeVideos({
  query: 'concert',
  location: '40.7829,-73.9654',
  radius: '5km',
  maxResults: 10,
  order: 'date'
});
```

### 2. Comprehensive Documentation

#### `docs/YOUTUBE_API_GUIDE.md` (5,700+ words)
- Complete step-by-step API key setup
- Cost breakdown and quota information
- Security best practices
- Troubleshooting guide
- Code examples for every use case

#### `docs/YOUTUBE_QUICK_START.md` (Quick reference)
- 5-minute setup guide
- Common use cases
- Commands to test immediately

### 3. Test Script (`scripts/test-youtube.ts`)

Interactive CLI tool to test the integration:
```bash
npm run test:youtube
```

Tests three scenarios:
1. Keyword search ("music festival 2026")
2. Location-based search (Central Park, NY)
3. Event-based search (mock event)

Includes helpful error messages if API key is missing or invalid.

### 4. Sample Data

The seed script now includes **2 YouTube videos**:

**Video 1: Summer Music Festival**
- Title: "Live Performance - Main Stage"
- URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
- Source: youtube
- Type: video

**Video 2: City Marathon**
- Title: "Marathon Highlights - Brooklyn Bridge Start"
- URL: https://www.youtube.com/watch?v=jNQXAC9IVRw
- Source: youtube
- Type: video

Run `npm run db:seed` to populate the database.

### 5. Environment Configuration

**`.env.example`** template with all API keys:
```bash
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_YOUTUBE_API_KEY=""          # Get from Google Cloud Console
REDDIT_USER_AGENT=""        # Optional
UNSPLASH_ACCESS_KEY=""      # Optional
TWITTER_BEARER_TOKEN=""     # Optional (paid)
```

---

## Getting Your YouTube API Key

### Step-by-Step (5 minutes)

1. **Visit**: https://console.cloud.google.com/
2. **Create Project**: Name it "something-s-happening" (or anything)
3. **Enable API**: Search for "YouTube Data API v3" and enable it
4. **Create Key**: 
   - Go to Credentials
   - Click "Create Credentials"
   - Select "API Key"
   - Copy the key (starts with `AIza...`)
5. **Add to .env**:
   ```bash
   NEXT_PUBLIC_YOUTUBE_API_KEY="AIzaSy...your-key-here"
   ```

### Security Tips

✅ DO:
- Store key in `.env` (already gitignored)
- Use server-side API routes only
- Restrict key to YouTube Data API v3
- Add HTTP referrer restrictions if hosting on known domain

❌ DON'T:
- Commit API key to git
- Expose key in client-side code
- Share key publicly

---

## Cost & Quota

### Free Tier (Forever)
- **Daily Quota**: 10,000 units
- **Cost**: $0

### Unit Costs
| Operation | Units | Free Daily Limit |
|-----------|-------|------------------|
| Search query | 100 | 100 searches |
| Video details | 1 | 10,000 requests |
| List videos | 1 | 10,000 requests |

### Example MVP Usage
- 50 searches/day: 5,000 units
- 200 video details/day: 200 units
- **Total**: 5,200 units/day ✅ (well within 10,000)

### If You Exceed
- Quota resets at midnight Pacific Time
- Can enable billing for pay-as-you-go ($0.01 per 100 units)
- Most MVPs never need to pay

---

## Features Supported

### ✅ Location-Based Search
Search for videos near event coordinates:
```typescript
const videos = await searchYouTubeVideos({
  query: 'marathon',
  location: '40.7061,-73.9969',  // Brooklyn Bridge
  radius: '2km',
  maxResults: 20
});
```

### ✅ Time Filtering
Find videos published during event window:
```typescript
const videos = await searchYouTubeVideos({
  query: 'music festival',
  publishedAfter: event.startTime,
  publishedBefore: event.endTime
});
```

### ✅ Live Stream Detection
Find currently live videos:
```typescript
const liveVideos = await searchYouTubeVideos({
  query: 'concert',
  eventType: 'live'
});
```

### ✅ Batch Video Details
Efficiently get details for multiple videos (1 unit vs 100 units per video):
```typescript
import { getVideoDetails } from '@/lib/youtube';

const details = await getVideoDetails([
  'dQw4w9WgXcQ',
  'jNQXAC9IVRw'
]);
```

---

## Integration with Existing Database

YouTube videos are stored as `SourcePost` items with:

```typescript
{
  platform: 'YOUTUBE',                    // Platform enum
  platformPostId: 'dQw4w9WgXcQ',         // Video ID
  url: 'https://youtube.com/watch?v=...', // Full URL
  authorHandle: 'Channel Name',
  postedAt: new Date('2026-02-17T...'),  // Published date
  mediaType: 'VIDEO',                    // MediaType enum
  text: 'Video description or title',
  eventId: 'event-id',
  capturedAt: new Date(),                // When we captured it
}
```

**Schema aligned with main branch** - uses SourcePost model with Platform and MediaType enums!

**No database schema changes needed** - the existing SourcePost model from main already supports YouTube videos!

---

## Testing

### Without API Key
```bash
npm run test:youtube
```
Shows helpful setup instructions.

### With API Key
```bash
echo 'NEXT_PUBLIC_YOUTUBE_API_KEY="your-key"' >> .env
npm run test:youtube
```
Tests 3 real API scenarios:
1. Keyword search
2. Location search
3. Event search

### View Sample Data
```bash
npm run db:seed
```
Seeds database with 2 YouTube videos.

---

## Files Added/Modified

### New Files
- ✅ `src/lib/youtube.ts` - YouTube API utilities (270 lines)
- ✅ `scripts/test-youtube.ts` - Test script (130 lines)
- ✅ `docs/YOUTUBE_API_GUIDE.md` - Full documentation (320 lines)
- ✅ `docs/YOUTUBE_QUICK_START.md` - Quick reference (100 lines)
- ✅ `.env.example` - Environment template

### Modified Files
- ✅ `package.json` - Added `test:youtube` script
- ✅ `prisma/seed/seed.ts` - Added 2 YouTube videos
- ✅ `docs/MVP_DATA_PULL_GUIDE.md` - Updated with YouTube info

---

## Next Steps

### Immediate (Now)
1. Get your YouTube API key (5 min)
2. Add to `.env` file
3. Run `npm run test:youtube`
4. Verify it works!

### Short Term (This Week)
1. Integrate with event creation flow
2. Auto-fetch videos when creating events
3. Display YouTube videos in timeline UI
4. Add "load more" pagination

### Future Enhancements
1. Live stream monitoring
2. Real-time video notifications
3. Channel subscriptions
4. Comment/like integration (requires OAuth)

---

## Troubleshooting

### "API key not valid"
- Check key is in `.env` file
- Verify YouTube Data API v3 is enabled
- Check for spaces/quotes in key
- Try creating a new key

### "Quota exceeded"
- You've used 10,000+ units today
- Check usage: https://console.cloud.google.com/
- Wait until midnight PT for reset
- Or enable billing for more quota

### "No videos found"
- Try broader search terms
- Expand location radius
- Remove time filters
- Check if videos exist for that query

---

## Support

- **Documentation**: `docs/YOUTUBE_API_GUIDE.md`
- **Code Examples**: `src/lib/youtube.ts`
- **Test Script**: `npm run test:youtube`
- **Google Docs**: https://developers.google.com/youtube/v3

---

## Summary

✅ YouTube API fully integrated
✅ Free forever for most use cases  
✅ 5-minute setup with Google Cloud
✅ Complete documentation and examples
✅ Test script included
✅ Sample data in database
✅ No database schema changes needed

**You're ready to add YouTube videos to your events!** 🎬

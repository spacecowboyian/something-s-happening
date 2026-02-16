# MVP Data Pull Implementation Guide

## Summary
This document outlines the MVP data pull strategy for "Something's Happening", including recommended services and what you need to extract time/place targeted data.

## Best Services to Start With

### 1. Mock Data ✅ (Implemented - Currently Debugging)
- **Why**: Enables immediate frontend development
- **Status**: Database schema created, seed script ready
- **What We Have**: 3 sample events with 8 media items using Picsum images

### 2. Reddit API 📋 (Recommended Next)
- **Why**: No OAuth, free, good public content
- **Rate Limits**: 60 requests/minute
- **What You Need**: Just HTTP requests, no API key
- **Cost**: $0

### 3. Unsplash API 📋 (For Supplemental Images)  
- **Why**: High-quality stock photos
- **Rate Limits**: 50 requests/hour (free tier)
- **What You Need**: Free API key from unsplash.com/developers
- **Cost**: $0

### 4. Twitter API ⏳ (Future - If Budget Allows)
- **Why**: Best for real-time events
- **Cost**: $100/month for Basic tier (includes location search)
- **Alternative**: Free tier (no location search)

## What You Need for Time/Place Targeting

### Location Targeting
1. **For Reddit**:
   - Target location subreddits (r/nyc, r/newyork, etc.)
   - Search by event keywords
   - No geographical coordinates needed

2. **For Future APIs** (Twitter):
   - Event latitude/longitude stored in database
   - Radius search (e.g., 1km around 40.7829,-73.9654)

### Time Targeting  
1. **Event Time Window**:
   - Start scraping: 2 hours before event
   - Continue until: Event end + 1 hour
   - For live events: Scrape every 5 minutes

2. **Media Filtering**:
   - Only include media created during event window
   - Sort by timestamp for chronological timeline

## What's Been Built

### ✅ Database Schema
```typescript
// Event: title, location, lat/long, start/end times, status
// Media: type, source, URLs, author, timestamp
```

### ✅ Infrastructure
- Prisma 7 ORM with SQLite
- Database migrations
- Seed script (debugging adapter issue)

### 📋 Next Steps
1. Fix Prisma 7 adapter issue
2. Create Next.js API routes
3. Build Reddit fetcher
4. Frontend integration

## Recommended MVP Stack

**Start with (Total Cost: $0)**:
1. Mock data (immediate development)
2. Reddit API (real public content)
3. Unsplash API (supplemental images)

Hold on Twitter until MVP is validated ($100/month).

## Files Created
- `/prisma/schema.prisma` - Database schema
- `/prisma/seed/seed.ts` - Mock data generator  
- `/src/lib/prisma.ts` - Database client
- `/docs/MVP_DATA_PULL_GUIDE.md` - This guide

See full implementation details in the complete guide.

# Social Media API Setup Guide

This guide explains how to get API credentials for all supported social media platforms.

## Quick Summary

| Platform | API Key Required? | Cost | Where to Get |
|----------|------------------|------|--------------|
| **YouTube** | ✅ Yes | 🆓 FREE | [Google Cloud Console](https://console.cloud.google.com/) |
| **Bluesky** | ❌ No | 🆓 FREE | Public API (no auth needed) |
| **Reddit** | ❌ No* | 🆓 FREE | Public API (optional auth) |

\* Reddit works without auth but has lower rate limits

---

## 1. YouTube Data API v3 (RECOMMENDED ✅)

### Why YouTube?
- ✅ Completely free (10,000 units/day)
- ✅ No credit card required
- ✅ Location-based search
- ✅ Time-based filtering
- ✅ Simple to set up (5 minutes)

### Setup Steps

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "Create Project"
   - Name it: "something-s-happening"

2. **Enable YouTube Data API**
   - Go to "APIs & Services" > "Library"
   - Search: "YouTube Data API v3"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the key (starts with `AIza...`)

4. **Add to .env**
   ```bash
   YOUTUBE_API_KEY="AIzaSy...your-key-here"
   ```

### Rate Limits
- **Free Quota**: 10,000 units/day
- **Search**: 100 units per request
- **Video details**: 1 unit per request
- **Example**: 50 searches + 200 video details = 5,200 units

### Security Tips
- Restrict key to YouTube Data API v3 only
- Add HTTP referrer restrictions if deployed
- Never commit to git (already in `.gitignore`)

---

## 2. Bluesky (EASIEST - NO AUTH NEEDED ✅)

### Why Bluesky?
- ✅ No API key required!
- ✅ Public API for read access
- ✅ Free forever
- ✅ Open protocol (AT Protocol)

### Setup Steps

**No setup required!** Just use the public API:
```
https://public.api.bsky.app
```

### Example Usage
```typescript
// Search for posts - no auth needed
const response = await fetch(
  'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=event&limit=25'
);
```

### Rate Limits
- Public API has generous rate limits
- No authentication required for read access
- For posting/following, you'd need app password

---

## 3. Reddit (NO AUTH NEEDED* ✅)

### Why Reddit?
- ✅ Read-only access without auth
- ✅ Free forever
- ✅ Subreddit and keyword search
- ✅ Just need a user agent string

### Setup Steps

**Minimal setup:**
1. Add to `.env`:
   ```bash
   REDDIT_USER_AGENT="something-s-happening/0.1"
   ```

That's it! No API key needed.

### Optional: OAuth for Higher Limits

If you need higher rate limits:

1. **Create Reddit App**
   - Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
   - Click "create another app"
   - Select "script"
   - Fill in name and redirect URI

2. **Get Credentials**
   - Copy Client ID and Client Secret

3. **Add to .env**
   ```bash
   REDDIT_CLIENT_ID="..."
   REDDIT_CLIENT_SECRET="..."
   ```

### Rate Limits
- **Without auth**: 60 requests/minute
- **With OAuth**: Higher limits
- Public read access is usually sufficient

---

## 4. X / Twitter (PAID - NOT RECOMMENDED ⚠️)

### Why NOT Twitter?
- ⚠️ **PAID ONLY** - Basic plan: $100/month
- ⚠️ Free tier discontinued in 2023
- ⚠️ High costs for minimal features

### If You Still Want It

1. **Sign up for API access**
   - Go to [Twitter Developer Portal](https://developer.twitter.com/)
   - Sign up for Basic plan ($100/month)

2. **Create an App**
   - Create a new app
   - Enable OAuth 2.0

3. **Get Bearer Token**
   - Generate Bearer Token
   - Copy the token

4. **Add to .env**
   ```bash
   X_BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAAxxxxxxxx"
   ```

### Pricing
- **Basic**: $100/month
  - 10,000 tweets/month
  - 3 app environments
- **Pro**: $5,000/month
  - Higher limits

### Alternatives
- Use Bluesky instead (similar platform, free API)
- Manually collect tweets with proper attribution
- Use RSS feeds or embed tweets

---

## 5. X / Twitter (PAID - NOT RECOMMENDED ⚠️)

For MVP and best developer experience:

1. **✅ YouTube** (5 min setup, free, powerful search)
2. **✅ Bluesky** (0 min setup, free, no auth)
3. **✅ Reddit** (1 min setup, free, no auth)
4. **❌ X/Twitter** (avoid unless you need it - $100/month)

---

## Testing Your Setup

After adding credentials to `.env`:

```bash
# Test YouTube
npm run test:youtube

# Or test directly in code
import { isYouTubeConfigured } from '@/lib/youtube';
console.log('YouTube:', isYouTubeConfigured());

import { isBlueskyConfigured } from '@/lib/bluesky';
console.log('Bluesky:', isBlueskyConfigured());

import { isRedditConfigured } from '@/lib/reddit';
console.log('Reddit:', isRedditConfigured());
```

---

## Security Checklist

- [ ] All credentials in `.env` (not `.env.example`)
- [ ] `.env` is in `.gitignore` ✅
- [ ] Never commit actual API keys
- [ ] Restrict API keys to specific services
- [ ] Use environment-specific keys (dev/prod)
- [ ] Rotate keys if exposed
- [ ] Monitor usage in respective dashboards

---

## Cost Comparison (Monthly)

| Platform | Cost | Free Tier | Quota |
|----------|------|-----------|-------|
| YouTube | $0 | ✅ Yes | 10,000 units/day |
| Bluesky | $0 | ✅ Yes | Unlimited |
| Reddit | $0 | ✅ Yes | 60 req/min |
| X/Twitter | $100 | ❌ No | 10k tweets/month |

**Total for MVP (without Twitter): $0/month** 🎉

---

## Next Steps

1. Choose which platforms you want (recommend: YouTube + Bluesky + Reddit)
2. Get API credentials following steps above
3. Add to `.env` file
4. Test connections
5. Start fetching event data!

For implementation details, see:
- `src/lib/youtube.ts` - YouTube integration
- `src/lib/bluesky.ts` - Bluesky integration
- `src/lib/reddit.ts` - Reddit integration
- `src/lib/x-twitter.ts` - X/Twitter integration

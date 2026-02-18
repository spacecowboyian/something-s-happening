# Quick Reference: API Credentials Needed

## What You Need to Get

Here's exactly what credentials you need to fetch for each platform:

### ✅ Priority 1: Easy & Free (Start Here!)

#### 1. YouTube Data API v3
**Cost:** FREE  
**Time:** 5 minutes  
**Get from:** https://console.google.com/

**What you need:**
- `YOUTUBE_API_KEY` - Single API key string

**Steps:**
1. Create Google Cloud project
2. Enable "YouTube Data API v3"
3. Create Credentials > API Key
4. Copy the key (starts with `AIza...`)

**Add to `.env`:**
```bash
YOUTUBE_API_KEY="AIzaSy...your-key-here"
```

---

#### 2. Bluesky
**Cost:** FREE  
**Time:** 0 minutes  
**Get from:** Nowhere! No auth needed

**What you need:**
- Nothing! Public API, no authentication required

---

#### 3. Reddit
**Cost:** FREE  
**Time:** 1 minute  
**Get from:** No signup needed

**What you need:**
- `REDDIT_USER_AGENT` - Just a string identifying your app

**Add to `.env`:**
```bash
REDDIT_USER_AGENT="something-s-happening/0.1"
```

---

### ⚠️ Priority 2: More Complex

#### 4. Instagram (If You Have a Business Account)
**Cost:** FREE  
**Time:** 30 minutes  
**Get from:** https://developers.facebook.com/

**What you need:**
- `INSTAGRAM_ACCESS_TOKEN` - Long token string
- `INSTAGRAM_USER_ID` - Your Instagram Business user ID

**Limitations:**
- Only works with Instagram Business accounts
- Cannot search public posts
- Can only access your own business account posts

**Steps:**
1. Create Facebook Developer account
2. Create app with Instagram Graph API
3. Link Instagram Business account
4. Generate access token
5. Get your user ID

**Add to `.env`:**
```bash
INSTAGRAM_ACCESS_TOKEN="IGQVx..."
INSTAGRAM_USER_ID="17841..."
```

---

#### 5. X / Twitter (NOT RECOMMENDED - Paid Only)
**Cost:** $100/month minimum  
**Time:** 15 minutes  
**Get from:** https://developer.twitter.com/

**What you need:**
- `X_BEARER_TOKEN` - Bearer token from Twitter API v2

**Why not recommended:**
- Free tier discontinued
- Minimum $100/month for Basic plan
- Use Bluesky instead (free, similar)

**If you still want it, add to `.env`:**
```bash
X_BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAAxxxxxxxx"
```

---

## Recommended Setup for MVP

**Start with these 3 (all free, easy to set up):**

1. ✅ **YouTube** - Most powerful, location search, completely free
2. ✅ **Bluesky** - No setup, free, similar to Twitter
3. ✅ **Reddit** - No API key needed, great for events/locations

**Total cost: $0/month**

---

## Where to Put Credentials

Create a `.env` file in your project root:

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your keys
nano .env
```

**Important:** 
- ✅ `.env` is already in `.gitignore`
- ❌ Never commit real credentials to git
- ✅ Only add real keys to `.env`, not `.env.example`

---

## Testing Your Credentials

After adding credentials to `.env`:

```bash
# Test YouTube
npm run test:youtube

# Or test in your app
npm run dev
# Then check logs for "YouTube: true"
```

---

## Summary Table

| Platform | API Key? | Cost | Time | Get From |
|----------|----------|------|------|----------|
| **YouTube** | ✅ Yes | $0 | 5 min | [Google Cloud](https://console.cloud.google.com/) |
| **Bluesky** | ❌ No | $0 | 0 min | N/A (public API) |
| **Reddit** | ❌ No* | $0 | 1 min | N/A (public API) |
| **Instagram** | ✅ Yes | $0** | 30 min | [FB Developers](https://developers.facebook.com/) |
| **X/Twitter** | ✅ Yes | $100/mo | 15 min | [Twitter Devs](https://developer.twitter.com/) |

\* Just needs user agent string  
\** Free but very limited (business accounts only)

---

## Next Steps

1. Get YouTube API key (5 min, most important)
2. Add Reddit user agent (30 sec)
3. Test with mock event data
4. Decide if you need Instagram (only if you have business account)
5. Skip X/Twitter unless you really need it ($100/month)

For detailed step-by-step instructions, see: `docs/SOCIAL_API_SETUP.md`

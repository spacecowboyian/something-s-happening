/**
 * X (Twitter) API Integration
 * 
 * This module provides utilities for fetching tweets for events using X API v2.
 * Requires X API credentials (API Key, Secret, and Bearer Token).
 * 
 * Get your credentials: https://developer.twitter.com/
 * 
 * NOTE: X API is now paid. Basic plan starts at $100/month.
 * Free tier was discontinued in 2023.
 * 
 * Alternative: Use nitter instances or public scraping (against TOS)
 */

const X_API_BASE = 'https://api.twitter.com/2';

export interface XSearchParams {
  query: string;
  maxResults?: number;       // Max 100 per request (Basic: 10, Pro: 100)
  startTime?: Date | string;
  endTime?: Date | string;
  geoLocation?: {
    latitude: number;
    longitude: number;
    radius: string;          // Format: "5km" or "5mi"
  };
}

export interface XTweet {
  id: string;
  text: string;
  authorId: string;
  authorUsername: string;
  createdAt: string;
  geoLocation?: {
    lat: number;
    lng: number;
  };
  mediaUrls?: string[];
}

/**
 * Convert X tweet to SourcePost data format
 */
export function xTweetToSourcePost(tweet: XTweet, eventId: string) {
  // Determine media type based on content
  let mediaType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK' = 'TEXT';
  if (tweet.mediaUrls && tweet.mediaUrls.length > 0) {
    // Simple heuristic: check if media looks like video
    mediaType = tweet.mediaUrls.some(url => url.includes('video')) ? 'VIDEO' : 'IMAGE';
  } else if (tweet.text.includes('http')) {
    mediaType = 'LINK';
  }

  return {
    platform: 'X' as const,
    platformPostId: tweet.id,
    url: `https://twitter.com/${tweet.authorUsername}/status/${tweet.id}`,
    authorHandle: `@${tweet.authorUsername}`,
    postedAt: new Date(tweet.createdAt),
    lat: tweet.geoLocation?.lat,
    lng: tweet.geoLocation?.lng,
    mediaType,
    text: tweet.text,
    eventId,
  };
}

/**
 * Search for tweets based on criteria
 * 
 * NOTE: Requires X API v2 Bearer Token (paid subscription)
 */
export async function searchXTweets(
  params: XSearchParams
): Promise<XTweet[]> {
  const bearerToken = process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    console.warn('⚠️  X_BEARER_TOKEN not set in environment variables');
    console.warn('X API is paid-only. Get credentials from: https://developer.twitter.com/');
    console.warn('Basic plan: $100/month');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      query: params.query,
      max_results: String(params.maxResults || 10),
      'tweet.fields': 'created_at,author_id,geo',
      'user.fields': 'username',
      expansions: 'author_id,geo.place_id',
    });

    // Add time filtering
    if (params.startTime) {
      const date = params.startTime instanceof Date 
        ? params.startTime.toISOString() 
        : params.startTime;
      searchParams.append('start_time', date);
    }

    if (params.endTime) {
      const date = params.endTime instanceof Date 
        ? params.endTime.toISOString() 
        : params.endTime;
      searchParams.append('end_time', date);
    }

    // Add geo location if provided
    if (params.geoLocation) {
      const { latitude, longitude, radius } = params.geoLocation;
      searchParams.append('query', `${params.query} point_radius:[${longitude} ${latitude} ${radius}]`);
    }

    const url = `${X_API_BASE}/tweets/search/recent?${searchParams.toString()}`;
    
    console.log('🔍 Searching X (Twitter):', params.query);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('X API error:', error);
      throw new Error(`X API error: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('No tweets found for query:', params.query);
      return [];
    }

    console.log(`✅ Found ${data.data.length} tweets`);

    // Map tweets with user data
    const users = data.includes?.users || [];
    
    return data.data.map((tweet: {
      id: string;
      text: string;
      author_id: string;
      created_at: string;
      geo?: {
        coordinates?: {
          coordinates: [number, number];
        };
      };
    }) => {
      const author = users.find((u: { id: string }) => u.id === tweet.author_id);
      return {
        id: tweet.id,
        text: tweet.text,
        authorId: tweet.author_id,
        authorUsername: author?.username || 'unknown',
        createdAt: tweet.created_at,
        geoLocation: tweet.geo ? {
          lat: tweet.geo.coordinates?.coordinates[1],
          lng: tweet.geo.coordinates?.coordinates[0],
        } : undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching X tweets:', error);
    throw error;
  }
}

/**
 * Check if X API is configured
 */
export function isXConfigured(): boolean {
  return !!(process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN);
}

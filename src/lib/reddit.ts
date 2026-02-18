/**
 * Reddit API Integration
 * 
 * This module provides utilities for fetching Reddit posts for events.
 * Reddit's public API allows read-only access without authentication.
 * 
 * For basic search: NO API KEY REQUIRED
 * For authenticated access (higher rate limits): OAuth credentials needed
 * 
 * Get credentials: https://www.reddit.com/prefs/apps
 * Documentation: https://www.reddit.com/dev/api/
 */

// const REDDIT_API_BASE = 'https://oauth.reddit.com';
const REDDIT_PUBLIC_BASE = 'https://www.reddit.com';

export interface RedditSearchParams {
  query: string;
  subreddit?: string;       // Search within specific subreddit
  limit?: number;           // Max 100
  sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
  timeFilter?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  after?: Date | string;    // Posts after this time
  before?: Date | string;   // Posts before this time
}

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;         // Post body text
  author: string;
  subreddit: string;
  created: number;          // Unix timestamp
  url: string;              // Post URL
  permalink: string;        // Relative URL
  thumbnail?: string;
  isVideo: boolean;
  media?: {
    type: string;
    oembed?: {
      thumbnail_url?: string;
      html?: string;
    };
  };
  postHint?: string;        // 'image', 'link', 'self', 'video'
}

/**
 * Convert Reddit post to SourcePost data format
 */
export function redditPostToSourcePost(post: RedditPost, eventId: string) {
  // Determine media type
  let mediaType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK' = 'TEXT';
  
  if (post.isVideo || post.postHint === 'video' || post.media?.type === 'video') {
    mediaType = 'VIDEO';
  } else if (post.postHint === 'image' || (post.thumbnail && post.thumbnail !== 'self')) {
    mediaType = 'IMAGE';
  } else if (post.postHint === 'link' && post.url !== post.permalink) {
    mediaType = 'LINK';
  }

  return {
    platform: 'REDDIT' as const,
    platformPostId: post.id,
    url: `https://reddit.com${post.permalink}`,
    authorHandle: `u/${post.author}`,
    postedAt: new Date(post.created * 1000), // Convert Unix timestamp to Date
    mediaType,
    text: post.title + (post.selftext ? `\n\n${post.selftext}` : ''),
    eventId,
  };
}

/**
 * Search Reddit posts using public API (no auth required)
 */
export async function searchRedditPosts(
  params: RedditSearchParams
): Promise<RedditPost[]> {
  try {
    // Use public API endpoint (no authentication needed)
    const searchPath = params.subreddit 
      ? `/r/${params.subreddit}/search.json`
      : '/search.json';
    
    const searchParams = new URLSearchParams({
      q: params.query,
      limit: String(params.limit || 25),
      sort: params.sort || 'relevance',
      t: params.timeFilter || 'all',
      type: 'link',
      restrict_sr: params.subreddit ? 'true' : 'false',
    });

    const url = `${REDDIT_PUBLIC_BASE}${searchPath}?${searchParams.toString()}`;
    
    console.log('🔍 Searching Reddit:', params.query);
    
    // Reddit requires a user agent
    const userAgent = process.env.REDDIT_USER_AGENT || 'something-s-happening/0.1';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Reddit API error:', error);
      throw new Error(`Reddit API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data?.children || data.data.children.length === 0) {
      console.log('No Reddit posts found for query:', params.query);
      return [];
    }

    console.log(`✅ Found ${data.data.children.length} Reddit posts`);

    // Extract post data from Reddit's response structure
    let posts = data.data.children.map((child: { data: RedditPost }) => child.data);

    // Filter by time if specified
    if (params.after) {
      const afterTime = params.after instanceof Date 
        ? params.after.getTime() / 1000 
        : new Date(params.after).getTime() / 1000;
      posts = posts.filter((post: RedditPost) => post.created >= afterTime);
    }
    
    if (params.before) {
      const beforeTime = params.before instanceof Date 
        ? params.before.getTime() / 1000 
        : new Date(params.before).getTime() / 1000;
      posts = posts.filter((post: RedditPost) => post.created <= beforeTime);
    }

    return posts;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    throw error;
  }
}

/**
 * Get posts from a specific subreddit
 */
export async function getSubredditPosts(
  subreddit: string,
  sort: 'hot' | 'new' | 'top' | 'rising' = 'hot',
  limit: number = 25
): Promise<RedditPost[]> {
  try {
    const url = `${REDDIT_PUBLIC_BASE}/r/${subreddit}/${sort}.json?` + new URLSearchParams({
      limit: String(limit),
    });
    
    const userAgent = process.env.REDDIT_USER_AGENT || 'something-s-happening/0.1';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.children.map((child: { data: RedditPost }) => child.data);
  } catch (error) {
    console.error('Error fetching subreddit posts:', error);
    throw error;
  }
}

/**
 * Check if Reddit API is configured (always true for public API)
 */
export function isRedditConfigured(): boolean {
  return true; // No API key needed for public read access!
}

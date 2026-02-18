/**
 * Bluesky API Integration
 * 
 * This module provides utilities for fetching posts from Bluesky (AT Protocol).
 * Bluesky has a public API that doesn't require authentication for basic search.
 * 
 * Documentation: https://docs.bsky.app/
 * 
 * NO API KEY REQUIRED for read-only access!
 */

const BLUESKY_API_BASE = 'https://public.api.bsky.app/xrpc';

export interface BlueskySearchParams {
  query: string;
  limit?: number;           // Max 100
  since?: Date | string;    // Posts after this time
  until?: Date | string;    // Posts before this time
}

export interface BlueskyPost {
  uri: string;              // Unique post URI
  cid: string;              // Content ID
  author: {
    did: string;            // Decentralized ID
    handle: string;         // Username handle
    displayName?: string;
  };
  record: {
    text: string;
    createdAt: string;
  };
  indexedAt: string;
  embed?: {
    $type: string;
    images?: Array<{
      thumb: string;
      fullsize: string;
      alt: string;
    }>;
    external?: {
      uri: string;
      title: string;
      description: string;
      thumb?: string;
    };
  };
}

/**
 * Convert Bluesky post to SourcePost data format
 */
export function blueskyPostToSourcePost(post: BlueskyPost, eventId: string) {
  // Determine media type
  let mediaType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK' = 'TEXT';
  if (post.embed) {
    if (post.embed.images && post.embed.images.length > 0) {
      mediaType = 'IMAGE';
    } else if (post.embed.$type === 'app.bsky.embed.video') {
      mediaType = 'VIDEO';
    } else if (post.embed.external) {
      mediaType = 'LINK';
    }
  }

  // Extract post ID from URI (e.g., at://did:plc:xxx/app.bsky.feed.post/abc123)
  const postId = post.uri.split('/').pop() || post.cid;
  
  return {
    platform: 'BLUESKY' as const,
    platformPostId: postId,
    url: `https://bsky.app/profile/${post.author.handle}/post/${postId}`,
    authorHandle: `@${post.author.handle}`,
    postedAt: new Date(post.record.createdAt),
    mediaType,
    text: post.record.text,
    eventId,
  };
}

/**
 * Search for Bluesky posts
 * 
 * NOTE: Bluesky doesn't require authentication for public search!
 */
export async function searchBlueskyPosts(
  params: BlueskySearchParams
): Promise<BlueskyPost[]> {
  try {
    const searchParams = new URLSearchParams({
      q: params.query,
      limit: String(params.limit || 25),
    });

    // Note: Bluesky's search API is still evolving
    // Current endpoint might change as the protocol stabilizes
    const url = `${BLUESKY_API_BASE}/app.bsky.feed.searchPosts?${searchParams.toString()}`;
    
    console.log('🔍 Searching Bluesky:', params.query);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Bluesky API error:', error);
      throw new Error(`Bluesky API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.posts || data.posts.length === 0) {
      console.log('No Bluesky posts found for query:', params.query);
      return [];
    }

    console.log(`✅ Found ${data.posts.length} Bluesky posts`);

    // Filter by time if specified
    let posts = data.posts;
    
    if (params.since) {
      const sinceTime = params.since instanceof Date ? params.since : new Date(params.since);
      posts = posts.filter((post: BlueskyPost) => 
        new Date(post.record.createdAt) >= sinceTime
      );
    }
    
    if (params.until) {
      const untilTime = params.until instanceof Date ? params.until : new Date(params.until);
      posts = posts.filter((post: BlueskyPost) => 
        new Date(post.record.createdAt) <= untilTime
      );
    }

    return posts;
  } catch (error) {
    console.error('Error fetching Bluesky posts:', error);
    throw error;
  }
}

/**
 * Get posts by specific user
 */
export async function getBlueskyUserPosts(
  handle: string,
  limit: number = 50
): Promise<BlueskyPost[]> {
  try {
    const url = `${BLUESKY_API_BASE}/app.bsky.feed.getAuthorFeed?` + new URLSearchParams({
      actor: handle,
      limit: String(limit),
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Bluesky API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.feed.map((item: { post: BlueskyPost }) => item.post);
  } catch (error) {
    console.error('Error fetching Bluesky user posts:', error);
    throw error;
  }
}

/**
 * Check if Bluesky API is configured (always true - no auth needed!)
 */
export function isBlueskyConfigured(): boolean {
  return true; // No API key needed!
}

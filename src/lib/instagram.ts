/**
 * Instagram API Integration
 * 
 * This module provides utilities for fetching Instagram posts for events.
 * Requires Instagram Graph API credentials (Facebook/Meta).
 * 
 * Get credentials: https://developers.facebook.com/
 * 
 * IMPORTANT: Instagram API requires:
 * 1. Facebook/Meta Developer Account
 * 2. Facebook App with Instagram Graph API enabled
 * 3. Instagram Business Account (cannot access personal accounts)
 * 4. Access Token from the business account
 * 
 * Limitations:
 * - Only works with Instagram Business/Creator accounts
 * - Cannot search public posts (only your own business account's posts)
 * - Location search requires location ID
 * - Hashtag search is limited
 * 
 * Alternative: Use unofficial APIs or web scraping (against TOS)
 */

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

export interface InstagramSearchParams {
  userId?: string;          // Instagram Business Account ID
  hashtag?: string;         // Search by hashtag (limited)
  limit?: number;           // Max 50
  since?: Date | string;
  until?: Date | string;
}

export interface InstagramPost {
  id: string;
  caption?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  username: string;
  thumbnailUrl?: string;
  children?: Array<{
    id: string;
    mediaType: string;
    mediaUrl: string;
  }>;
}

/**
 * Convert Instagram post to SourcePost data format
 */
export function instagramPostToSourcePost(post: InstagramPost, eventId: string) {
  // Map Instagram media types to our MediaType enum
  let mediaType: 'IMAGE' | 'VIDEO' | 'TEXT' = 'IMAGE';
  if (post.mediaType === 'VIDEO') {
    mediaType = 'VIDEO';
  } else if (post.mediaType === 'CAROUSEL_ALBUM') {
    // For carousel, use IMAGE unless first item is video
    mediaType = 'IMAGE';
  }

  return {
    platform: 'INSTAGRAM' as const,
    platformPostId: post.id,
    url: post.permalink,
    authorHandle: `@${post.username}`,
    postedAt: new Date(post.timestamp),
    mediaType,
    text: post.caption || '',
    eventId,
  };
}

/**
 * Get posts from an Instagram Business Account
 * 
 * NOTE: Requires Instagram Business Account access token
 * You can only access posts from accounts you manage
 */
export async function getInstagramBusinessPosts(
  userId: string,
  limit: number = 25
): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('⚠️  INSTAGRAM_ACCESS_TOKEN not set in environment variables');
    console.warn('Get your token from: https://developers.facebook.com/');
    console.warn('NOTE: Only works with Instagram Business accounts');
    return [];
  }

  try {
    const url = `${INSTAGRAM_API_BASE}/${userId}/media?` + new URLSearchParams({
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
      access_token: accessToken,
      limit: String(limit),
    });
    
    console.log('🔍 Fetching Instagram posts for user:', userId);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Instagram API error:', error);
      throw new Error(`Instagram API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('No Instagram posts found');
      return [];
    }

    console.log(`✅ Found ${data.data.length} Instagram posts`);

    return data.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}

/**
 * Search for posts by hashtag
 * 
 * NOTE: Very limited - requires special permissions
 * Returns hashtag ID, not actual posts in most cases
 */
export async function searchInstagramHashtag(
  hashtag: string,
  userId: string
): Promise<string | null> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('⚠️  INSTAGRAM_ACCESS_TOKEN not set');
    return null;
  }

  try {
    // First, search for the hashtag ID
    const searchUrl = `${INSTAGRAM_API_BASE}/ig_hashtag_search?` + new URLSearchParams({
      user_id: userId,
      q: hashtag,
      access_token: accessToken,
    });
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0].id; // Returns hashtag ID
    }

    return null;
  } catch (error) {
    console.error('Error searching Instagram hashtag:', error);
    return null;
  }
}

/**
 * Check if Instagram API is configured
 */
export function isInstagramConfigured(): boolean {
  return !!process.env.INSTAGRAM_ACCESS_TOKEN;
}

/**
 * Note about Instagram API limitations
 */
export const INSTAGRAM_API_NOTES = `
Instagram Graph API Limitations:
- Only works with Instagram Business/Creator accounts
- Cannot search public posts from other accounts
- Cannot get posts by location without location ID
- Hashtag search requires special permissions
- Rate limits: 200 calls per hour per user

Alternatives for public data:
- Use Instagram's embed API for specific posts
- Consider using Apify or similar services
- Manual collection with proper attribution
`;

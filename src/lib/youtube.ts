/**
 * YouTube Data API v3 Integration
 * 
 * This module provides utilities for fetching YouTube videos for events.
 * Requires YOUTUBE_API_KEY in environment variables.
 * 
 * Get your API key: https://console.cloud.google.com/
 * Enable: YouTube Data API v3
 * 
 * Free quota: 10,000 units/day
 * - Search: 100 units per request
 * - Video details: 1 unit per video
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeSearchParams {
  query: string;
  location?: string;        // Format: "latitude,longitude" (e.g., "40.7829,-73.9654")
  radius?: string;          // Format: "5km" or "5mi"
  maxResults?: number;      // Max 50 per request
  publishedAfter?: Date | string;
  publishedBefore?: Date | string;
  eventType?: 'completed' | 'live' | 'upcoming';
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
  thumbnailMedium?: string;
  thumbnailHigh?: string;
  videoUrl: string;
}

/**
 * Convert YouTube video to SourcePost data format
 */
export function youtubeVideoToSourcePost(video: YouTubeVideo, eventId: string) {
  return {
    platform: 'YOUTUBE' as const,
    platformPostId: video.id,
    url: video.videoUrl,
    authorHandle: video.channelTitle,
    postedAt: new Date(video.publishedAt),
    mediaType: 'VIDEO' as const,
    text: video.description || video.title,
    eventId,
  };
}

/**
 * Search for YouTube videos based on criteria
 */
export async function searchYouTubeVideos(
  params: YouTubeSearchParams
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  YOUTUBE_API_KEY not set in environment variables');
    console.warn('Get your key from: https://console.cloud.google.com/');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      key: apiKey,
      part: 'snippet',
      type: 'video',
      q: params.query,
      maxResults: String(params.maxResults || 10),
      order: params.order || 'relevance',
    });

    // Add location-based search if provided
    if (params.location) {
      searchParams.append('location', params.location);
      searchParams.append('locationRadius', params.radius || '5km');
    }

    // Add time filtering
    if (params.publishedAfter) {
      const date = params.publishedAfter instanceof Date 
        ? params.publishedAfter.toISOString() 
        : params.publishedAfter;
      searchParams.append('publishedAfter', date);
    }

    if (params.publishedBefore) {
      const date = params.publishedBefore instanceof Date 
        ? params.publishedBefore.toISOString() 
        : params.publishedBefore;
      searchParams.append('publishedBefore', date);
    }

    // Add event type filter (live, upcoming, completed)
    if (params.eventType) {
      searchParams.append('eventType', params.eventType);
    }

    const url = `${YOUTUBE_API_BASE}/search?${searchParams.toString()}`;
    
    console.log('🔍 Searching YouTube:', params.query);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('YouTube API error:', error);
      throw new Error(`YouTube API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log('No videos found for query:', params.query);
      return [];
    }

    console.log(`✅ Found ${data.items.length} videos`);

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.default?.url || '',
      thumbnailMedium: item.snippet.thumbnails.medium?.url,
      thumbnailHigh: item.snippet.thumbnails.high?.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
}

/**
 * Get detailed information about specific videos
 * More efficient than multiple search requests (1 unit vs 100 units)
 */
export async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  YOUTUBE_API_KEY not set');
    return [];
  }

  if (videoIds.length === 0) {
    return [];
  }

  try {
    // YouTube allows up to 50 video IDs in one request
    const ids = videoIds.slice(0, 50).join(',');
    
    const url = `${YOUTUBE_API_BASE}/videos?` + new URLSearchParams({
      key: apiKey,
      part: 'snippet',
      id: ids,
    });

    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.default?.url || '',
      thumbnailMedium: item.snippet.thumbnails.medium?.url,
      thumbnailHigh: item.snippet.thumbnails.high?.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    }));
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}

/**
 * Search for videos related to a specific event
 * Combines location, time, and keyword search
 */
export async function searchEventVideos(event: {
  title: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  startTime: Date;
  endTime?: Date;
}): Promise<YouTubeVideo[]> {
  const locationString = event.latitude && event.longitude
    ? `${event.latitude},${event.longitude}`
    : undefined;

  const searchParams: YouTubeSearchParams = {
    query: `${event.title} ${event.location || ''}`.trim(),
    maxResults: 20,
    order: 'date',
    publishedAfter: event.startTime,
  };

  // Add location search if coordinates available
  if (locationString) {
    searchParams.location = locationString;
    searchParams.radius = '5km';
  }

  // Add end time filter if event has ended
  if (event.endTime) {
    searchParams.publishedBefore = event.endTime;
  }

  return searchYouTubeVideos(searchParams);
}

/**
 * Check if YouTube API key is configured
 */
export function isYouTubeConfigured(): boolean {
  return !!process.env.YOUTUBE_API_KEY;
}

/**
 * Get quota information (estimate based on usage)
 */
export function estimateQuotaUsage(searches: number, videoDetails: number): number {
  // Search: 100 units each
  // Video details: 1 unit each
  return (searches * 100) + videoDetails;
}

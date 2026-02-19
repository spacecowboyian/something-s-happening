#!/usr/bin/env tsx
/**
 * YouTube API Test Script
 * 
 * Tests the YouTube API integration with sample searches.
 * Run: npm run test:youtube
 */

import 'dotenv/config';
import { searchYouTubeVideos, searchEventVideos, isYouTubeConfigured } from '../src/lib/youtube';

async function main() {
  console.log('🎬 YouTube API Test\n');

  // Check if API key is configured
  if (!isYouTubeConfigured()) {
    console.error('❌ YOUTUBE_API_KEY not found in environment variables');
    console.log('\n📝 To set up YouTube API:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a project or select existing');
    console.log('3. Enable "YouTube Data API v3"');
    console.log('4. Create credentials > API Key');
    console.log('5. Add to .env file: YOUTUBE_API_KEY="your-key-here"');
    console.log('\n💡 See docs/YOUTUBE_API_GUIDE.md for detailed instructions');
    process.exit(1);
  }

  console.log('✅ YouTube API key is configured\n');

  try {
    // Test 1: Simple keyword search
    console.log('Test 1: Search for "music festival 2026"');
    console.log('─'.repeat(50));
    const results1 = await searchYouTubeVideos({
      query: 'music festival 2026',
      maxResults: 3,
      order: 'relevance'
    });

    if (results1.length > 0) {
      console.log(`Found ${results1.length} videos:\n`);
      results1.forEach((video, i) => {
        console.log(`${i + 1}. ${video.title}`);
        console.log(`   Channel: ${video.channelTitle}`);
        console.log(`   Published: ${video.publishedAt}`);
        console.log(`   URL: ${video.videoUrl}\n`);
      });
    } else {
      console.log('No videos found.\n');
    }

    // Test 2: Location-based search
    console.log('\nTest 2: Search near Central Park, NY');
    console.log('─'.repeat(50));
    const results2 = await searchYouTubeVideos({
      query: 'concert',
      location: '40.7829,-73.9654',  // Central Park coordinates
      radius: '5km',
      maxResults: 3,
      order: 'date'
    });

    if (results2.length > 0) {
      console.log(`Found ${results2.length} videos:\n`);
      results2.forEach((video, i) => {
        console.log(`${i + 1}. ${video.title}`);
        console.log(`   Channel: ${video.channelTitle}`);
        console.log(`   URL: ${video.videoUrl}\n`);
      });
    } else {
      console.log('No videos found.\n');
    }

    // Test 3: Event-based search
    console.log('\nTest 3: Search for event videos');
    console.log('─'.repeat(50));
    const mockEvent = {
      title: 'Summer Music Festival',
      location: 'Central Park, New York',
      latitude: 40.7829,
      longitude: -73.9654,
      startTime: new Date('2026-06-15T18:00:00Z'),
      endTime: new Date('2026-06-15T23:00:00Z')
    };

    const results3 = await searchEventVideos(mockEvent);
    
    if (results3.length > 0) {
      console.log(`Found ${results3.length} videos:\n`);
      results3.slice(0, 3).forEach((video, i) => {
        console.log(`${i + 1}. ${video.title}`);
        console.log(`   Channel: ${video.channelTitle}`);
        console.log(`   URL: ${video.videoUrl}\n`);
      });
    } else {
      console.log('No videos found.\n');
    }

    console.log('✅ All tests completed successfully!');
    console.log('\n💡 Tip: You can now integrate YouTube videos into your events');
    console.log('   See src/lib/youtube.ts for usage examples');

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', errMsg);
    
    if (errMsg.includes('API key not valid')) {
      console.log('\n🔧 Fix:');
      console.log('1. Check your API key in .env file');
      console.log('2. Verify YouTube Data API v3 is enabled in Google Cloud Console');
      console.log('3. Make sure there are no spaces or quotes in the key');
    } else if (errMsg.includes('quota')) {
      console.log('\n📊 Quota exceeded:');
      console.log('- Free tier: 10,000 units/day');
      console.log('- Each search uses 100 units');
      console.log('- Quota resets at midnight Pacific Time');
      console.log('- Check usage: https://console.cloud.google.com/');
    }
    
    process.exit(1);
  }
}

main();

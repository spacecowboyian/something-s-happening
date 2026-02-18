#!/usr/bin/env tsx
/**
 * Scrape real social media posts about Super Bowl streaker incidents
 * 
 * This script fetches actual posts from Reddit, Bluesky, and YouTube
 * and stores them in the database for the Super Bowl event.
 * 
 * Note: Since Super Bowl LX 2026 is in the future, we're searching for
 * real posts about past Super Bowl streaker incidents to demonstrate
 * the actual scraping functionality.
 * 
 * Usage:
 *   tsx scripts/scrape-superbowl-posts.ts
 */

import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { searchRedditPosts, redditPostToSourcePost } from '../src/lib/reddit'
import { searchBlueskyPosts, blueskyPostToSourcePost } from '../src/lib/bluesky'
import { searchYouTubeVideos, youtubeVideoToSourcePost } from '../src/lib/youtube'
import { upsertSourcePost } from '../src/lib/ingest'

const adapter = new PrismaBetterSqlite3({ url: 'prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function scrapeSuperbowlPosts() {
  console.log('🏈 Starting Super Bowl post scraping...\n')

  // Get the Super Bowl event
  const event = await prisma.event.findUnique({
    where: { slug: 'superbowl-lx-2026' },
  })

  if (!event) {
    console.error('❌ Super Bowl event not found in database')
    console.error('Run: npx prisma db seed')
    process.exit(1)
  }

  console.log(`📍 Event: ${event.title}`)
  console.log(`📅 Date: ${event.startsAt.toISOString()}`)
  console.log(`🆔 Event ID: ${event.id}\n`)

  let totalPosts = 0
  const errors: string[] = []

  // Note: Searching for real historical Super Bowl streaker incidents
  // since the 2026 event hasn't happened yet
  const searchQueries = [
    'Super Bowl streaker',
    'Super Bowl LV streaker',
    'Super Bowl field invasion',
    'NFL streaker arrested',
  ]

  // 1. Scrape Reddit posts
  console.log('📱 Scraping Reddit...')
  try {
    for (const query of searchQueries) {
      const redditPosts = await searchRedditPosts({
        query,
        limit: 10,
        sort: 'top',
        timeFilter: 'year',
      })

      console.log(`  Found ${redditPosts.length} posts for "${query}"`)

      for (const post of redditPosts) {
        try {
          const postData = redditPostToSourcePost(post, event.id)
          await upsertSourcePost(event.id, postData)
          totalPosts++
          console.log(`  ✅ Saved: ${post.title.substring(0, 60)}...`)
        } catch (error) {
          const errMsg = `Failed to save Reddit post ${post.id}: ${error}`
          errors.push(errMsg)
          console.error(`  ❌ ${errMsg}`)
        }
      }

      // Rate limiting - wait between queries
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  } catch (error) {
    const errMsg = `Reddit scraping failed: ${error}`
    errors.push(errMsg)
    console.error(`❌ ${errMsg}`)
  }

  // 2. Scrape Bluesky posts
  console.log('\n🦋 Scraping Bluesky...')
  try {
    for (const query of ['Super Bowl streaker', 'NFL field invader']) {
      try {
        const blueskyPosts = await searchBlueskyPosts({
          query,
          limit: 10,
        })

        console.log(`  Found ${blueskyPosts.length} posts for "${query}"`)

        for (const post of blueskyPosts) {
          try {
            const postData = blueskyPostToSourcePost(post, event.id)
            await upsertSourcePost(event.id, postData)
            totalPosts++
            console.log(`  ✅ Saved: ${post.record.text.substring(0, 60)}...`)
          } catch (error) {
            const errMsg = `Failed to save Bluesky post: ${error}`
            errors.push(errMsg)
            console.error(`  ❌ ${errMsg}`)
          }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.log(`  ⚠️  Query "${query}" failed: ${error}`)
      }
    }
  } catch (error) {
    const errMsg = `Bluesky scraping failed: ${error}`
    errors.push(errMsg)
    console.error(`❌ ${errMsg}`)
  }

  // 3. Scrape YouTube videos
  console.log('\n📺 Scraping YouTube...')
  try {
    const youtubeVideos = await searchYouTubeVideos({
      query: 'Super Bowl streaker',
      maxResults: 10,
      order: 'relevance',
    })

    console.log(`  Found ${youtubeVideos.length} videos`)

    for (const video of youtubeVideos) {
      try {
        const postData = youtubeVideoToSourcePost(video, event.id)
        await upsertSourcePost(event.id, postData)
        totalPosts++
        console.log(`  ✅ Saved: ${video.title.substring(0, 60)}...`)
      } catch (error) {
        const errMsg = `Failed to save YouTube video ${video.id}: ${error}`
        errors.push(errMsg)
        console.error(`  ❌ ${errMsg}`)
      }
    }
  } catch (error) {
    const errMsg = `YouTube scraping failed: ${error}`
    errors.push(errMsg)
    console.error(`❌ ${errMsg}`)
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Scraping Summary')
  console.log('='.repeat(60))
  console.log(`✅ Total posts saved: ${totalPosts}`)
  console.log(`❌ Errors encountered: ${errors.length}`)

  if (errors.length > 0) {
    console.log('\n⚠️  Errors:')
    errors.forEach((error, i) => {
      console.log(`  ${i + 1}. ${error}`)
    })
  }

  console.log('\n🎉 Scraping complete!')
  console.log(`\n📍 View event at: http://localhost:3000/event/${event.slug}/`)
}

// Run the scraper
scrapeSuperbowlPosts()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

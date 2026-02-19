#!/usr/bin/env tsx
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
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

function isWithinEventWindow(date: Date, startsAt: Date, endsAt?: Date | null) {
  if (date < startsAt) return false
  if (endsAt && date > endsAt) return false
  return true
}

function preferGeolocated<T>(posts: T[]) {
  const geolocated = posts.filter((post) => {
    const candidate = post as { lat?: number | null; lng?: number | null }
    return candidate.lat != null && candidate.lng != null
  })
  return geolocated.length > 0 ? geolocated : posts
}

function matchesStreakerFocus(text?: string | null) {
  if (!text) return false
  const normalized = text.toLowerCase()
  return [
    'streaker',
    'field invader',
    'field invasion',
    'ran onto the field',
    'ran on the field',
    'ran onto',
    'ran on',
  ].some((keyword) => normalized.includes(keyword))
}

function applyStreakerFallback<T extends { text?: string | null }>(posts: T[]) {
  const focused = posts.filter((post) => matchesStreakerFocus(post.text))
  return focused.length > 0 ? focused : posts
}

function getLocationRadius(radiusMeters?: number | null) {
  if (!radiusMeters || radiusMeters <= 0) return '10km'
  const km = Math.max(1, Math.round(radiusMeters / 1000))
  return `${km}km`
}

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

  const eventWindow = {
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  }

  const location =
    event.centerLat != null && event.centerLng != null
      ? `${event.centerLat},${event.centerLng}`
      : undefined
  const locationRadius = getLocationRadius(event.radiusMeters)

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
        // Don't filter by event window - we want historical posts
        // since this is a demo script for a future event
      })

      console.log(`  Found ${redditPosts.length} posts for "${query}"`)

      // Apply streaker focus filter and prefer geolocated posts
      const redditPostData = preferGeolocated(
        applyStreakerFallback(
          redditPosts
            .map((post) => redditPostToSourcePost(post, event.id))
        )
      )

      for (const postData of redditPostData) {
        try {
          await upsertSourcePost(event.id, postData)
          totalPosts++
          console.log(`  ✅ Saved: ${postData.text?.substring(0, 60)}...`)
        } catch (error) {
          const errMsg = `Failed to save Reddit post ${postData.platformPostId}: ${error}`
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
          // Don't filter by event window - we want historical posts
        })

        console.log(`  Found ${blueskyPosts.length} posts for "${query}"`)

        const blueskyPostData = preferGeolocated(
          applyStreakerFallback(
            blueskyPosts
              .map((post) => blueskyPostToSourcePost(post, event.id))
          )
        )

        for (const postData of blueskyPostData) {
          try {
            await upsertSourcePost(event.id, postData)
            totalPosts++
            console.log(`  ✅ Saved: ${postData.text?.substring(0, 60)}...`)
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
      location,
      radius: location ? locationRadius : undefined,
      // Don't filter by event window - we want historical videos
    })

    console.log(`  Found ${youtubeVideos.length} videos`)

    const youtubePostData = preferGeolocated(
      applyStreakerFallback(
        youtubeVideos
          .map((video) => youtubeVideoToSourcePost(video, event.id))
      )
    )

    for (const postData of youtubePostData) {
      try {
        await upsertSourcePost(event.id, postData)
        totalPosts++
        console.log(`  ✅ Saved: ${postData.text?.substring(0, 60)}...`)
      } catch (error) {
        const errMsg = `Failed to save YouTube video ${postData.platformPostId}: ${error}`
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

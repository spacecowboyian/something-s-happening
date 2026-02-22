#!/usr/bin/env tsx
import { PrismaClient, MediaType, Platform } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { writeFile } from 'node:fs/promises'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL?.replace('file:', '') || 'prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

const mediaTypeMap: Record<MediaType, 'video' | 'image' | 'audio' | 'text'> = {
  [MediaType.VIDEO]: 'video',
  [MediaType.IMAGE]: 'image',
  [MediaType.AUDIO]: 'audio',
  [MediaType.TEXT]: 'text',
  [MediaType.LINK]: 'text',
}

type RawCode = { __raw: string }

function raw(code: string): RawCode {
  return { __raw: code }
}

function isRawCode(value: unknown): value is RawCode {
  return Boolean(value && typeof value === 'object' && '__raw' in value)
}

function getStatus(startsAt: Date, endsAt?: Date | null) {
  const now = new Date()
  if (now < startsAt) return 'upcoming'
  if (endsAt && now > endsAt) return 'completed'
  return 'live'
}

function isWithinEventWindow(postedAt: Date, startsAt: Date, endsAt?: Date | null) {
  if (postedAt < startsAt) return false
  if (endsAt && postedAt > endsAt) return false
  return true
}

function matchesSuperbowlStreakerFocus(text?: string | null) {
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
    'ran onto the field',
    'ran on to the field',
  ].some((keyword) => normalized.includes(keyword))
}

function getSuperbowlWindowOverride() {
  // 9:45 PM – 10:45 PM CST on Feb 8, 2026
  // CST is UTC-6, so this is 03:45–04:45 UTC on Feb 9, 2026.
  return {
    startsAt: new Date('2026-02-09T03:45:00.000Z'),
    endsAt: new Date('2026-02-09T04:45:00.000Z'),
  }
}

function formatValue(value: unknown, indentLevel = 0): string {
  const indent = '  '.repeat(indentLevel)
  const nextIndent = '  '.repeat(indentLevel + 1)

  if (isRawCode(value)) {
    return value.__raw
  }

  if (value instanceof Date) {
    return `new Date('${value.toISOString()}')`
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((item) => `${nextIndent}${formatValue(item, indentLevel + 1)}`)
    return `[
${items.join(',\n')}
${indent}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const lines = entries.map(([key, val]) => {
      return `${nextIndent}${JSON.stringify(key)}: ${formatValue(val, indentLevel + 1)}`
    })
    return `{
${lines.join(',\n')}
${indent}}`
  }

  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null) return 'null'
  return 'undefined'
}

async function exportMockData() {
  const events = await prisma.event.findMany({
    include: {
      sourcePosts: {
        orderBy: { postedAt: 'asc' },
      },
    },
  })

  const mockEventData = Object.fromEntries(
    events.map((event) => {
      const overrideWindow = event.slug === 'superbowl-lx-2026'
        ? getSuperbowlWindowOverride()
        : undefined
      const windowStartsAt = overrideWindow?.startsAt ?? event.startsAt
      const windowEndsAt = overrideWindow?.endsAt ?? event.endsAt

      const filteredPosts = event.sourcePosts
        .filter((post) => isWithinEventWindow(post.postedAt, windowStartsAt, windowEndsAt))
        .filter((post) => {
          if (event.slug !== 'superbowl-lx-2026') return true
          return matchesSuperbowlStreakerFocus(post.text)
        })
        .sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime())

      const pinnedYouTube = event.slug === 'superbowl-lx-2026'
        ? event.sourcePosts.find((post) =>
            post.platform === Platform.YOUTUBE && matchesSuperbowlStreakerFocus(post.text)
          )
        : undefined

      const items = filteredPosts.map((post) => {
        const mediaUrl =
          post.mediaType === MediaType.VIDEO && post.platform === Platform.YOUTUBE
            ? post.url
            : undefined

        return {
          id: post.platformPostId || post.id,
          timestamp: post.postedAt,
          source: post.authorHandle || `${post.platform} User`,
          sourceUrl: post.url,
          content: post.text || '',
          mediaType: raw(`${JSON.stringify(mediaTypeMap[post.mediaType])} as const`),
          mediaUrl,
        }
      })

      if (pinnedYouTube) {
        const mediaUrl = pinnedYouTube.url
        items.unshift({
          id: pinnedYouTube.platformPostId || pinnedYouTube.id,
          timestamp: pinnedYouTube.postedAt,
          source: pinnedYouTube.authorHandle || `${pinnedYouTube.platform} User`,
          sourceUrl: pinnedYouTube.url,
          content: pinnedYouTube.text || '',
          mediaType: raw(`${JSON.stringify(mediaTypeMap[pinnedYouTube.mediaType])} as const`),
          mediaUrl,
        })
      }

      const uniqueItems = Array.from(
        new Map(items.map((item) => [item.id, item])).values()
      )

      return [event.slug, {
        title: event.title,
        startDate: windowStartsAt,
        endDate: windowEndsAt ?? undefined,
        status: raw(`${JSON.stringify(getStatus(windowStartsAt, windowEndsAt))} as const`),
        description: event.description ?? undefined,
        items: uniqueItems,
        pendingLiveItems: [],
      }]
    })
  )

  const fileContents = `// This file is auto-generated by scripts/export-mock-data.ts\n// Do not edit manually.\n\nexport const mockEventData = ${formatValue(mockEventData)};\n\nexport type EventId = keyof typeof mockEventData;\nexport type EventData = typeof mockEventData[EventId];\n`

  await writeFile('src/lib/mockEventData.ts', fileContents)
  console.log('✅ Updated src/lib/mockEventData.ts with database content')
}

exportMockData()
  .catch((error) => {
    console.error('❌ Failed to export mock data:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

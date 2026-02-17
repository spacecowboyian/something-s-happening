import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

// For Prisma 7 with libsql adapter, we need to pass the connection URL through the adapter
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'error', 'warn']
});

async function main() {
  console.log('🌱 Seeding database with mock data...');
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

  try {
    // Test connection first
    await prisma.$connect();
    console.log('✅ Connected to database');

    await prisma.media.deleteMany();
    console.log('✅ Cleared media table');
    
    await prisma.event.deleteMany();
    console.log('✅ Cleared event table');
    
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const concertEvent = await prisma.event.create({
      data: {
        title: 'Summer Music Festival 2026',
        description: 'Annual outdoor music festival',
        location: 'Central Park, New York',
        latitude: 40.7829,
        longitude: -73.9654,
        startTime: twoHoursAgo,
        endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        status: 'live',
        media: {
          create: [
            {
              type: 'image',
              source: 'instagram',
              url: 'https://picsum.photos/seed/concert1/800/600',
              thumbnailUrl: 'https://picsum.photos/seed/concert1/400/300',
              title: 'Main stage setup',
              author: '@musiclover',
              timestamp: twoHoursAgo,
            },
            {
              type: 'image',
              source: 'twitter',
              url: 'https://picsum.photos/seed/concert2/800/600',
              thumbnailUrl: 'https://picsum.photos/seed/concert2/400/300',
              title: 'Crowd is getting hyped',
              author: '@concertgoer',
              timestamp: new Date(twoHoursAgo.getTime() + 30 * 60 * 1000),
            },
            {
              type: 'text',
              source: 'twitter',
              url: '',
              description: 'Best festival of the year! The energy is incredible 🎸🎵',
              author: '@musicfan',
              timestamp: new Date(now.getTime() - 30 * 60 * 1000),
            },
            {
              type: 'video',
              source: 'youtube',
              sourceId: 'dQw4w9WgXcQ',
              url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
              title: 'Live Performance - Main Stage',
              description: 'Amazing performance at the summer festival',
              author: 'Festival Live Stream',
              timestamp: new Date(twoHoursAgo.getTime() + 45 * 60 * 1000),
            },
          ],
        },
      },
    });

    const sportsEvent = await prisma.event.create({
      data: {
        title: 'NBA Finals Game 7',
        description: 'Championship deciding game',
        location: 'Madison Square Garden, New York',
        latitude: 40.7505,
        longitude: -73.9934,
        startTime: new Date(yesterday.getTime() - 3 * 60 * 60 * 1000),
        endTime: yesterday,
        status: 'completed',
        media: {
          create: [
            {
              type: 'image',
              source: 'twitter',
              url: 'https://picsum.photos/seed/sports1/800/600',
              thumbnailUrl: 'https://picsum.photos/seed/sports1/400/300',
              title: 'Pre-game warmup',
              author: '@sportsfan',
              timestamp: new Date(yesterday.getTime() - 3 * 60 * 60 * 1000),
            },
            {
              type: 'image',
              source: 'instagram',
              url: 'https://picsum.photos/seed/sports2/800/600',
              thumbnailUrl: 'https://picsum.photos/seed/sports2/400/300',
              title: 'Game-winning shot!',
              author: '@nbashots',
              timestamp: new Date(yesterday.getTime() - 30 * 60 * 1000),
            },
          ],
        },
      },
    });

    const marathonEvent = await prisma.event.create({
      data: {
        title: 'City Marathon 2026',
        description: 'Annual city-wide marathon',
        location: 'Brooklyn Bridge',
        latitude: 40.7061,
        longitude: -73.9969,
        startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        status: 'live',
        media: {
          create: [
            {
              type: 'image',
              source: 'reddit',
              url: 'https://picsum.photos/seed/marathon1/800/600',
              thumbnailUrl: 'https://picsum.photos/seed/marathon1/400/300',
              title: 'Starting line packed with runners',
              author: 'u/marathonrunner',
              timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
            },
            {
              type: 'text',
              source: 'twitter',
              url: '',
              description: 'Mile 10 checkpoint - runners looking strong! 🏃‍♂️',
              author: '@runnersworld',
              timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            },
            {
              type: 'image',
              source: 'instagram',
              url: 'https://picsum.photos/seed/marathon2/800/600',
              thumbnailUrl: 'https://picsum.photos/seed/marathon2/400/300',
              title: 'Amazing crowd support',
              author: '@citymarathon',
              timestamp: new Date(now.getTime() - 60 * 60 * 1000),
            },
            {
              type: 'video',
              source: 'youtube',
              sourceId: 'jNQXAC9IVRw',
              url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
              thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg',
              title: 'Marathon Highlights - Brooklyn Bridge Start',
              description: 'Watch the incredible start of the 2026 City Marathon',
              author: 'City Marathon Official',
              timestamp: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
            },
          ],
        },
      },
    });

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${await prisma.event.count()} events`);
    console.log(`Created ${await prisma.media.count()} media items`);
    console.log('\nEvents:');
    console.log(`- ${concertEvent.title} (${concertEvent.status}) - includes YouTube video`);
    console.log(`- ${sportsEvent.title} (${sportsEvent.status})`);
    console.log(`- ${marathonEvent.title} (${marathonEvent.status}) - includes YouTube video`);
    console.log('\n💡 Tip: YouTube videos are now supported!');
    console.log('   Run "npm run test:youtube" to test YouTube API integration');
  } catch (error) {
    console.error('Detailed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

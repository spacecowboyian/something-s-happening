import { PlayableTimeline } from '../components/PlayableTimeline';
import styles from './page.module.css';

// Mock data for the MVP - will be replaced with real data later
const mockEventData = {
  'test-event-123': {
    title: 'Tech Conference 2026',
    startDate: new Date('2026-02-16T09:00:00'),
    endDate: new Date('2026-02-16T16:12:00'),
    status: 'live' as const,
    description: 'Annual technology conference featuring the latest innovations in AI, cloud computing, and web development.',
    items: [
      {
        id: '1',
        timestamp: new Date('2026-02-16T09:03:00'),
        source: '@techconference',
        sourceUrl: 'https://twitter.com/techconference',
        content: 'Opening keynote starting now! CEO announces exciting new product launches for 2026.',
        mediaType: 'text' as const,
      },
      {
        id: '2',
        timestamp: new Date('2026-02-16T09:41:00'),
        source: '@attendee_jane',
        sourceUrl: 'https://twitter.com/attendee_jane',
        content: 'Amazing demo of the new AI-powered development tools. This is going to change everything!',
        mediaType: 'text' as const,
      },
      {
        id: '2b',
        timestamp: new Date('2026-02-16T10:27:00'),
        source: '@conference_video',
        sourceUrl: 'https://youtube.com',
        content: 'Short floor clip from the expo hall.',
        mediaType: 'video' as const,
        mediaUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      },
      {
        id: '3',
        timestamp: new Date('2026-02-16T11:56:00'),
        source: '@techblog',
        sourceUrl: 'https://twitter.com/techblog',
        content: 'Panel discussion on the future of web frameworks. Experts from React, Vue, and Angular teams sharing insights.',
        mediaType: 'text' as const,
      },
      {
        id: '3b',
        timestamp: new Date('2026-02-16T12:38:00'),
        source: '@event_audio',
        sourceUrl: 'https://example.com/audio',
        content: 'Audio highlight from the keynote recap.',
        mediaType: 'audio' as const,
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
      {
        id: '4',
        timestamp: new Date('2026-02-16T13:22:00'),
        source: '@livestream',
        sourceUrl: 'https://twitter.com/livestream',
        content: 'Lunch break. Networking session in the main hall. Great conversations happening!',
        mediaType: 'text' as const,
      },
      {
        id: '5',
        timestamp: new Date('2026-02-16T14:47:00'),
        source: '@devnews',
        sourceUrl: 'https://twitter.com/devnews',
        content: 'Workshop on modern CSS techniques. Learning about container queries and CSS layers.',
        mediaType: 'text' as const,
      },
    ],
    pendingLiveItems: [
      {
        id: '6',
        timestamp: new Date('2026-02-16T15:31:00'),
        source: '@conferencehall',
        sourceUrl: 'https://twitter.com/conferencehall',
        content: 'Lightning talks are live now with rapid demos from startup founders.',
        mediaType: 'text' as const,
      },
      {
        id: '7',
        timestamp: new Date('2026-02-16T15:54:00'),
        source: '@devcommunity',
        sourceUrl: 'https://twitter.com/devcommunity',
        content: 'Crowd Q&A is underway and panelists are answering architecture questions in real time.',
        mediaType: 'text' as const,
      },
      {
        id: '8',
        timestamp: new Date('2026-02-16T16:08:00'),
        source: '@conference_video',
        sourceUrl: 'https://youtube.com',
        content: 'Another short clip showing live audience reactions.',
        mediaType: 'video' as const,
        mediaUrl: 'https://www.youtube.com/watch?v=BaW_jenozKc',
      },
    ],
  },
  'sample-event': {
    title: 'Product Launch Event',
    startDate: new Date('2026-01-15T14:00:00'),
    endDate: new Date('2026-01-15T16:00:00'),
    status: 'completed' as const,
    description: 'Live streaming event for the launch of our new product line.',
    items: [
      {
        id: '1',
        timestamp: new Date('2026-01-15T14:05:00'),
        source: '@company',
        sourceUrl: 'https://twitter.com/company',
        content: 'Welcome everyone! Thank you for joining our product launch event.',
        mediaType: 'text' as const,
      },
      {
        id: '2',
        timestamp: new Date('2026-01-15T14:30:00'),
        source: '@company',
        sourceUrl: 'https://twitter.com/company',
        content: 'Introducing our flagship product with revolutionary features.',
        mediaType: 'text' as const,
      },
      {
        id: '3',
        timestamp: new Date('2026-01-15T15:00:00'),
        source: '@journalist',
        sourceUrl: 'https://twitter.com/journalist',
        content: 'First impressions: This looks very promising. The design is sleek and modern.',
        mediaType: 'text' as const,
      },
    ],
    pendingLiveItems: [],
  },
};

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = await params;
  const eventData = mockEventData[eventId as keyof typeof mockEventData];

  if (!eventData) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>Event Not Found</h1>
          <p className={styles.errorMessage}>
            The event &quot;{eventId}&quot; could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PlayableTimeline
        title={eventData.title}
        startDate={eventData.startDate}
        endDate={eventData.endDate}
        initialStatus={eventData.status}
        description={eventData.description}
        initialItems={eventData.items}
        pendingLiveItems={eventData.pendingLiveItems}
      />
    </div>
  );
}

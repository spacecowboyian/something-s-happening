import { PlayableTimeline } from '../components/PlayableTimeline';
import { mockEventData } from '@/lib/mockEventData';
import styles from './page.module.css';

export async function generateStaticParams() {
  // For static export, only generate params for mock data
  return Object.keys(mockEventData).map((id) => ({ id }));
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = await params;
  
  // In development, try to use database if available
  if (process.env.NODE_ENV === 'development') {
    try {
      const { getEventBySlug } = await import('@/lib/events');
      const { listEventPosts, sourcePostToTimelineItem } = await import('@/lib/ingest');
      
      const dbEvent = await getEventBySlug(eventId);
      
      if (dbEvent) {
        // Event exists in database, fetch its posts and convert to timeline items
        const posts = await listEventPosts(dbEvent.id);
        const items = posts.map(sourcePostToTimelineItem);
        
        // Determine status based on event dates
        const now = new Date();
        let status: 'live' | 'upcoming' | 'completed' = 'upcoming';
        if (now >= dbEvent.startsAt) {
          status = dbEvent.endsAt && now > dbEvent.endsAt ? 'completed' : 'live';
        }
        
        return (
          <div className={styles.pageContainer}>
            <PlayableTimeline
              title={dbEvent.title}
              startDate={dbEvent.startsAt}
              endDate={dbEvent.endsAt || undefined}
              initialStatus={status}
              description={dbEvent.description || undefined}
              initialItems={items}
              pendingLiveItems={[]}
            />
          </div>
        );
      }
    } catch (error) {
      console.log('Database not available, using mock data:', error);
    }
  }
  
  // Fall back to mock data (used in production/static export)
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

import { PlayableTimeline } from '../components/PlayableTimeline';
import { mockEventData } from '@/lib/mockEventData';
import styles from './page.module.css';

export async function generateStaticParams() {
  // Generate static params for all available event IDs
  return Object.keys(mockEventData).map((id) => ({ id }));
}

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

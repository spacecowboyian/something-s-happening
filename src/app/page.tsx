'use client';

import { Button } from '@/components/Button';
import { mockEventData } from '@/lib/mockEventData';
import styles from './page.module.css';

export default function Home() {
  const handleEventClick = (eventId: string) => {
    window.location.assign(`/event/${eventId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Something&apos;s Happening
        </h1>
        <p className={styles.description}>
          Welcome to your Next.js React application. This project is ready for development with react-aria and a custom design system!
        </p>
        <div className={styles.buttonGroup}>
          {Object.entries(mockEventData).map(([eventId, eventData]) => (
            <Button
              key={eventId}
              onPress={() => handleEventClick(eventId)}
              aria-label={`View ${eventData.title} timeline`}
            >
              {eventData.title}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}

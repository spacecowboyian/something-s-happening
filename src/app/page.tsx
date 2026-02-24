'use client';

import Link from 'next/link';
import { mockEventData } from '@/lib/mockEventData';
import styles from './page.module.css';

export default function Home() {

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
            <Link
              key={eventId}
              href={`/event/${eventId}`}
              className={styles.eventLink}
              aria-label={`View ${eventData.title} timeline`}
            >
              {eventData.title}
            </Link>
          ))}
          <Link
            href="/live-timing"
            className={styles.eventLink}
            aria-label="View live timing results"
          >
            🏁 Live Timing
          </Link>
        </div>
      </main>
    </div>
  );
}

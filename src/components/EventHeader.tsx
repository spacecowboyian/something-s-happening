'use client';

import { Heading } from 'react-aria-components';
import styles from './EventHeader.module.css';

export interface EventHeaderProps {
  title: string;
  startDate: Date;
  endDate?: Date;
  status?: 'live' | 'upcoming' | 'completed';
  description?: string;
}

export function EventHeader({ 
  title, 
  startDate, 
  endDate, 
  status = 'completed',
  description 
}: EventHeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'live':
        return 'Live Now';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.statusContainer}>
        {status && (
          <span className={`${styles.statusBadge} ${styles[status]}`}>
            {getStatusLabel()}
          </span>
        )}
      </div>
      
      <Heading className={styles.title} level={1}>
        {title}
      </Heading>
      
      <div className={styles.dateInfo}>
        <time className={styles.date} dateTime={startDate.toISOString()}>
          {formatDate(startDate)}
        </time>
        {endDate && (
          <>
            <span className={styles.dateSeparator}>—</span>
            <time className={styles.date} dateTime={endDate.toISOString()}>
              {formatDate(endDate)}
            </time>
          </>
        )}
      </div>
      
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </header>
  );
}

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
  description,
}: EventHeaderProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  const isSameDay = endDate
    ? startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    : false;

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
      <div className={styles.mainRow}>
        <div className={styles.leftBlock}>
          <Heading className={styles.title} level={1}>
            {title}
          </Heading>

          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>

        <div className={styles.rightBlock}>
          <div className={styles.dateInfo}>
            <time className={styles.date} dateTime={startDate.toISOString()}>
              {isSameDay ? `${formatDate(startDate)} ${formatTime(startDate)}` : formatDateTime(startDate)}
            </time>
            {endDate && (
              <>
                <span className={styles.dateSeparator}>—</span>
                <time className={styles.date} dateTime={endDate.toISOString()}>
                  {isSameDay ? formatTime(endDate) : formatDateTime(endDate)}
                </time>
              </>
            )}
          </div>

          {status && (
            <span className={`${styles.statusBadge} ${styles[status]}`}>
              {getStatusLabel()}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

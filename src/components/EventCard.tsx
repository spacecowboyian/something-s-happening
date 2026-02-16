import styles from './EventCard.module.css';

export interface EventCardProps {
  timestamp: Date;
  source: string;
  sourceUrl?: string;
  content: string;
  mediaType?: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

export function EventCard({
  timestamp,
  source,
  sourceUrl,
  content,
  mediaType = 'text',
  mediaUrl
}: EventCardProps) {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <article className={styles.card}>
      <div className={styles.timeline}>
        <div className={styles.timelineDot}></div>
        <div className={styles.timelineLine}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <time className={styles.timestamp} dateTime={timestamp.toISOString()}>
            {formatTimestamp(timestamp)}
          </time>
          {sourceUrl ? (
            <a 
              href={sourceUrl} 
              className={styles.source}
              target="_blank" 
              rel="noopener noreferrer"
            >
              {source}
            </a>
          ) : (
            <span className={styles.source}>{source}</span>
          )}
        </div>
        
        {mediaUrl && mediaType === 'image' && (
          <div className={styles.mediaContainer}>
            <img 
              src={mediaUrl} 
              alt={content} 
              className={styles.media}
            />
          </div>
        )}
        
        {mediaUrl && mediaType === 'video' && (
          <div className={styles.mediaContainer}>
            <video 
              src={mediaUrl} 
              className={styles.media}
              controls
            />
          </div>
        )}
        
        <p className={styles.text}>{content}</p>
      </div>
    </article>
  );
}

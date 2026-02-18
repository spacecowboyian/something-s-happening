import { ForwardedRef, forwardRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button as AriaButton, Tooltip, TooltipTrigger } from 'react-aria-components';
import {
  faGlobe,
  faImage,
  faPlay,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { faSoundcloud, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { getYouTubeVideoId } from '@/lib/youtube';
import styles from './MomentCard.module.css';
import tooltipStyles from '@/components/Tooltip/Tooltip.module.css';

export interface MomentCardProps {
  timestamp: Date;
  source: string;
  sourceUrl?: string;
  content: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  isActive?: boolean;
  isStartMoment?: boolean;
  isEndMoment?: boolean;
  showTopConnector?: boolean;
  showBottomConnector?: boolean;
  extendTopConnector?: boolean;
  extendBottomConnector?: boolean;
  onPress?: () => void;
}

function getTimelineIcon(mediaType: MomentCardProps['mediaType'], sourceUrl?: string) {
  if (mediaType === 'video') {
    return faPlay;
  }

  if (mediaType === 'audio') {
    return faVolumeHigh;
  }

  if (mediaType === 'image') {
    return faImage;
  }

  if (!sourceUrl) {
    return faGlobe;
  }

  if (sourceUrl.includes('twitter.com') || sourceUrl.includes('x.com')) {
    return faXTwitter;
  }

  if (sourceUrl.includes('youtube.com') || sourceUrl.includes('youtu.be')) {
    return faYoutube;
  }

  if (sourceUrl.includes('soundcloud.com') || sourceUrl.includes('soundhelix.com')) {
    return faSoundcloud;
  }

  return faGlobe;
}

function MomentCardImpl({
  timestamp,
  source,
  sourceUrl,
  content,
  mediaType = 'text',
  mediaUrl,
  isActive = false,
  isStartMoment = false,
  isEndMoment = false,
  showTopConnector = true,
  showBottomConnector = true,
  extendTopConnector = false,
  extendBottomConnector = false,
  onPress,
}: MomentCardProps, ref: ForwardedRef<HTMLButtonElement>) {
  const formatTimelineTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const youtubeId = mediaType === 'video' ? getYouTubeVideoId(mediaUrl) : null;
  const youtubeThumbnail = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : null;
  const timelineIcon = getTimelineIcon(mediaType, sourceUrl);
  const markerTooltip = isStartMoment
    ? 'Start of event timeline'
    : isEndMoment
      ? 'End of completed event timeline'
      : undefined;

  return (
    <AriaButton
      ref={ref}
      className={`${styles.card} ${isActive ? styles.active : ''} ${isStartMoment ? styles.startMoment : ''} ${isEndMoment ? styles.endMoment : ''}`}
      onPress={onPress}
      aria-pressed={isActive}
    >
      <div className={styles.timeRail}>
        <time className={styles.railTimestamp} dateTime={timestamp.toISOString()}>
          {formatTimelineTimestamp(timestamp)}
        </time>
      </div>

      <div
        className={`${styles.timeline} ${!showTopConnector ? styles.timelineNoTop : ''} ${!showBottomConnector ? styles.timelineNoBottom : ''} ${extendTopConnector ? styles.timelineExtendTop : ''} ${extendBottomConnector ? styles.timelineExtendBottom : ''}`}
      >
        {markerTooltip ? (
          <TooltipTrigger delay={0} closeDelay={0}>
            <span
              className={styles.timelineDotButton}
              aria-label={markerTooltip}
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={timelineIcon} className={styles.timelineIcon} />
            </span>
            <Tooltip className={tooltipStyles.tooltip} placement="right">
              {markerTooltip}
            </Tooltip>
          </TooltipTrigger>
        ) : (
          <div className={styles.timelineDot}>
            <FontAwesomeIcon icon={timelineIcon} className={styles.timelineIcon} />
          </div>
        )}
        <div className={styles.timelineLine}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          {sourceUrl ? (
            <a 
              href={sourceUrl} 
              className={styles.source}
              onClick={(event) => event.stopPropagation()}
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
            <Image 
              src={mediaUrl} 
              alt={content} 
              className={styles.media}
              width={800}
              height={400}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}
        
        {youtubeThumbnail && mediaType === 'video' && (
          <div className={styles.youtubePreview}>
            <div className={styles.youtubeThumbWrap}>
              <Image
                src={youtubeThumbnail}
                alt={`${source} video thumbnail`}
                className={styles.youtubeThumb}
                width={180}
                height={102}
                unoptimized
              />
            </div>
            <div className={styles.youtubeMeta}>
              <p className={styles.youtubeTitle}>
                <span className={styles.youtubeTitleIcon} aria-hidden="true">
                  <FontAwesomeIcon icon={faPlay} />
                </span>
                <span>{content}</span>
              </p>
              <time className={styles.youtubeDate} dateTime={timestamp.toISOString()}>
                {formatDateTime(timestamp)}
              </time>
            </div>
          </div>
        )}

        {!youtubeId && mediaUrl && mediaType === 'video' && (
          <div className={styles.mediaContainer}>
            <video 
              src={mediaUrl} 
              className={styles.media}
              controls
            />
          </div>
        )}

        {mediaUrl && mediaType === 'audio' && (
          <div className={styles.audioIndicator}>
            <span className={styles.audioIcon} aria-hidden="true">
              <FontAwesomeIcon icon={faVolumeHigh} />
            </span>
            <span className={styles.audioLabel}>Audio clip</span>
          </div>
        )}
        
        {!(youtubeThumbnail && mediaType === 'video') && (
          <p className={styles.text}>{content}</p>
        )}
      </div>
    </AriaButton>
  );
}

export const MomentCard = forwardRef<HTMLButtonElement, MomentCardProps>(MomentCardImpl);
MomentCard.displayName = 'MomentCard';

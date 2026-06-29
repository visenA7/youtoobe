import React, { useState } from 'react';
import { formatViews, formatTimeAgo } from '../utils';

const VideoPlayer = ({
  video,
  cinemaMode,
  setCinemaMode,
  isLiked,
  isDisliked,
  onLikeToggle,
  onDislikeToggle,
  isWatchLater,
  onWatchLaterToggle,
  onAddToPlaylist,
  isSubscribed,
  onSubscribeToggle
}) => {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  if (!video) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const { id, snippet, statistics } = video;
  const videoId = id?.videoId || id;
  const title = snippet?.title || 'No Title';
  const description = snippet?.description || 'No description available.';
  const channelTitle = snippet?.channelTitle || 'Unknown Channel';
  const publishedAt = snippet?.publishedAt;
  const channelAvatar = video.channelAvatar;

  // Formatting values
  const viewsText = statistics?.viewCount 
    ? parseInt(statistics.viewCount, 10).toLocaleString() + ' views' 
    : '124,532 views';

  const likesText = statistics?.likeCount 
    ? formatViews(statistics.likeCount).replace(' views', '')
    : '8.4K';

  const timeAgoText = publishedAt 
    ? formatTimeAgo(publishedAt) 
    : '3 days ago';

  const subscriberCount = video.channelSubscribers 
    ? formatViews(video.channelSubscribers).replace(' views', ' subscribers')
    : '1.45M subscribers';

  // Toggle description accordion
  const toggleDescription = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
    alert('Video link copied to clipboard!');
  };

  return (
    <div className="player-wrapper">
      <div className="player-container">
        <iframe
          title={title}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="video-frame"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </div>

      <div className="player-info">
        <h1 className="player-title" dangerouslySetInnerHTML={{ __html: title }} />

        <div className="player-actions-row">
          <div className="channel-section">
            <img 
              src={channelAvatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80'} 
              alt={channelTitle} 
              className="channel-avatar"
              style={{ width: '40px', height: '40px' }}
            />
            <div className="channel-info-meta">
              <span className="channel-name">{channelTitle}</span>
              <span className="channel-subscribers">{subscriberCount}</span>
            </div>
            <button 
              className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
              onClick={onSubscribeToggle}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="actions-buttons-container">
            {/* Like/Dislike Group */}
            <div className="btn-group-pill">
              <button 
                className="btn-pill" 
                onClick={onLikeToggle}
                title="Like this video"
                style={{ color: isLiked ? 'var(--accent-blue)' : 'inherit' }}
              >
                {isLiked ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                )}
                <span>{likesText}</span>
              </button>
              <div className="btn-pill-divider"></div>
              <button 
                className="btn-pill" 
                onClick={onDislikeToggle}
                title="Dislike this video"
                style={{ color: isDisliked ? 'var(--accent-red)' : 'inherit' }}
              >
                {isDisliked ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M23 3h-4v12h4V3zm-22 11c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2H6c-.83 0-1.54.5-1.84 1.22L1.14 11.27c-.09.23-.14.47-.14.73v1.91l.01.01L1 14z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm12-3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Share */}
            <button className="btn-pill" style={{ borderRadius: '20px', backgroundColor: 'var(--bg-hover)' }} onClick={handleShare}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span>Share</span>
            </button>

            {/* Watch Later */}
            <button 
              className="btn-pill" 
              style={{ borderRadius: '20px', backgroundColor: 'var(--bg-hover)', color: isWatchLater ? 'var(--accent-blue)' : 'inherit' }}
              onClick={onWatchLaterToggle}
              title="Add to Watch Later"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h-3V8h2v3h1v2z"/>
              </svg>
              <span>{isWatchLater ? 'Added' : 'Later'}</span>
            </button>

            {/* Save to Playlist */}
            <button 
              className="btn-pill" 
              style={{ borderRadius: '20px', backgroundColor: 'var(--bg-hover)' }}
              onClick={onAddToPlaylist}
              title="Add to Playlist"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 14h8v-2H2v2z"/>
              </svg>
              <span>Save</span>
            </button>

            {/* Cinema/Theater Mode Toggle */}
            <button 
              className="btn-pill" 
              style={{ borderRadius: '20px', backgroundColor: 'var(--bg-hover)', color: cinemaMode ? 'var(--accent-blue)' : 'inherit' }}
              onClick={() => setCinemaMode(!cinemaMode)}
              title="Toggle Cinema Mode"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0-2-.9-2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
              </svg>
              <span>Theater</span>
            </button>
          </div>
        </div>

        {/* Video Description Box Accordion */}
        <div className="video-description-box" onClick={toggleDescription}>
          <div className="description-summary-stats">
            <span>{viewsText}</span>
            <span>{timeAgoText}</span>
          </div>
          <p className={`description-text ${descriptionExpanded ? 'expanded' : ''}`}>
            {description}
          </p>
          <span className="show-more-toggle">
            {descriptionExpanded ? 'Show less' : '...more'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

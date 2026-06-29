import React from 'react';
import VideoCard from './VideoCard';

const LibraryViews = ({
  view,
  playlists = [],
  likedVideos = [],
  watchLater = [],
  watchHistory = [],
  selectedPlaylistId,
  onVideoClick,
  onClearHistory,
  onDeletePlaylist,
  onRemovePlaylistVideo
}) => {

  const renderEmptyState = (title, message, iconType) => {
    let iconSvg;
    if (iconType === 'heart') {
      iconSvg = (
        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      );
    } else if (iconType === 'clock') {
      iconSvg = (
        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.01 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
        </svg>
      );
    } else {
      iconSvg = (
        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
        </svg>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-state-icon">{iconSvg}</div>
        <div className="empty-state-text" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{message}</div>
      </div>
    );
  };

  // Render Liked Videos
  if (view === 'liked') {
    return (
      <div>
        <div className="library-view-header">
          <h2 className="library-view-title">Liked Videos</h2>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {likedVideos.length} video{likedVideos.length !== 1 ? 's' : ''}
          </span>
        </div>
        {likedVideos.length === 0 ? (
          renderEmptyState('No liked videos yet', 'Videos you like will be saved here.', 'heart')
        ) : (
          <div className="videos-grid">
            {likedVideos.map((video) => (
              <VideoCard
                key={video.id?.videoId || video.id}
                video={video}
                onClick={() => onVideoClick(video)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render Watch Later
  if (view === 'watchLater') {
    return (
      <div>
        <div className="library-view-header">
          <h2 className="library-view-title">Watch Later</h2>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {watchLater.length} video{watchLater.length !== 1 ? 's' : ''}
          </span>
        </div>
        {watchLater.length === 0 ? (
          renderEmptyState('Your list is empty', 'Add videos to watch later while browsing.', 'clock')
        ) : (
          <div className="videos-grid">
            {watchLater.map((video) => (
              <VideoCard
                key={video.id?.videoId || video.id}
                video={video}
                onClick={() => onVideoClick(video)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render History
  if (view === 'history') {
    return (
      <div>
        <div className="library-view-header">
          <h2 className="library-view-title">Watch History</h2>
          {watchHistory.length > 0 && (
            <button className="library-clear-btn" onClick={onClearHistory}>
              Clear History
            </button>
          )}
        </div>
        {watchHistory.length === 0 ? (
          renderEmptyState('No search or view history', 'Videos you play will show up here.', 'clock')
        ) : (
          <div className="videos-grid">
            {watchHistory.map((video, index) => (
              <VideoCard
                key={`${video.id?.videoId || video.id}-${index}`}
                video={video}
                onClick={() => onVideoClick(video)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render playlists list directory
  if (view === 'playlists') {
    return (
      <div>
        <div className="library-view-header">
          <h2 className="library-view-title">My Playlists</h2>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </span>
        </div>
        {playlists.length === 0 ? (
          renderEmptyState('No playlists yet', 'Create playlists to group related videos together.', 'playlist')
        ) : (
          <div className="videos-grid">
            {playlists.map((playlist) => {
              const hasVideos = playlist.videos.length > 0;
              const thumbnail = hasVideos 
                ? (playlist.videos[0].snippet?.thumbnails?.medium?.url || playlist.videos[0].snippet?.thumbnails?.default?.url)
                : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=320&h=180&q=80';
              
              return (
                <div 
                  key={playlist.id} 
                  className="video-card" 
                  style={{ position: 'relative' }}
                >
                  <div className="video-card-thumbnail-container" onClick={() => onVideoClick(null, playlist.id)}>
                    <img src={thumbnail} alt={playlist.name} className="video-card-thumbnail" />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: 0, 
                        bottom: 0, 
                        width: '40%', 
                        background: 'rgba(0, 0, 0, 0.8)', 
                        backdropFilter: 'blur(4px)',
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 700
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ marginBottom: '4px' }}>
                        <path d="M19 9H2v2h17V9zm0-4H2v2h17V5zM2 15h13v-2H2v2zm15-2v6l5-3-5-3z"/>
                      </svg>
                      <span>{playlist.videos.length}</span>
                    </div>
                  </div>
                  <div className="video-card-details" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => onVideoClick(null, playlist.id)}>
                      <h4 className="video-card-title">{playlist.name}</h4>
                      <div className="video-card-channel">Playlist</div>
                    </div>
                    <button
                      onClick={() => onDeletePlaylist(playlist.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '8px' }}
                      title="Delete Playlist"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render individual playlist items
  if (view.startsWith('playlist-')) {
    const playlist = playlists.find(p => p.id === selectedPlaylistId);
    if (!playlist) return <div>Playlist not found.</div>;

    return (
      <div>
        <div className="library-view-header">
          <div>
            <h2 className="library-view-title">{playlist.name}</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
              Playlist • {playlist.videos.length} video{playlist.videos.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button 
            className="library-clear-btn" 
            onClick={() => onDeletePlaylist(playlist.id)}
            style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
          >
            Delete Playlist
          </button>
        </div>

        {playlist.videos.length === 0 ? (
          renderEmptyState('Playlist is empty', 'Add videos from search or details page.', 'playlist')
        ) : (
          <div className="videos-grid">
            {playlist.videos.map((video) => (
              <div key={video.id?.videoId || video.id} style={{ position: 'relative' }}>
                <VideoCard
                  video={video}
                  onClick={() => onVideoClick(video)}
                />
                <button
                  onClick={() => onRemovePlaylistVideo(playlist.id, video.id?.videoId || video.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#fff',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                  title="Remove from playlist"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default LibraryViews;

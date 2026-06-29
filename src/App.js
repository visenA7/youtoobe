import React, { useState, useEffect } from 'react';
import { searchVideos, getVideoDetails, getChannelDetails } from './api/Youtube';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CategoryTags from './components/CategoryTags';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import CommentsSection from './components/CommentsSection';
import PlaylistModal from './components/PlaylistModal';
import LibraryViews from './components/LibraryViews';

const App = () => {
  // Navigation & View States
  const [activeView, setActiveView] = useState('home'); // home, trending, subscriptions, history, watchLater, liked, playlists, playlist-*, search
  const [activeCategoryTag, setActiveCategoryTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('Trending');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  // Video Data States
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loading, setLoading] = useState(false);

  // Layout & UI States
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);

  // User Library Persisted States
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem('searchHistory')) || []
  );
  const [likedVideos, setLikedVideos] = useState(
    JSON.parse(localStorage.getItem('likedVideos')) || []
  );
  const [dislikedVideoIds, setDislikedVideoIds] = useState(
    JSON.parse(localStorage.getItem('dislikedVideoIds')) || []
  );
  const [watchLater, setWatchLater] = useState(
    JSON.parse(localStorage.getItem('watchLater')) || []
  );
  const [watchHistory, setWatchHistory] = useState(
    JSON.parse(localStorage.getItem('watchHistory')) || []
  );
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem('playlists')) || []
  );
  const [subscriptions, setSubscriptions] = useState(
    JSON.parse(localStorage.getItem('subscriptions')) || []
  );

  // Effect to apply HTML dataset theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect to persist library structures
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
  }, [likedVideos]);

  useEffect(() => {
    localStorage.setItem('dislikedVideoIds', JSON.stringify(dislikedVideoIds));
  }, [dislikedVideoIds]);

  useEffect(() => {
    localStorage.setItem('watchLater', JSON.stringify(watchLater));
  }, [watchLater]);

  useEffect(() => {
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Initial load
  useEffect(() => {
    fetchRichVideos('Trending');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch YouTube API data and augment with details and channel icons
  const fetchRichVideos = async (query, pageToken = '', isAppend = false) => {
    setLoading(true);
    try {
      const searchData = await searchVideos(query, pageToken);
      const searchItems = searchData.items || [];
      const nextPage = searchData.nextPageToken || '';
      setNextPageToken(nextPage);

      const videoIds = searchItems.map((item) => item.id?.videoId).filter(Boolean);
      if (videoIds.length === 0) {
        if (!isAppend) setVideos([]);
        setLoading(false);
        return;
      }

      // 1. Fetch detailed statistics and duration from /videos
      const details = await getVideoDetails(videoIds);
      const detailsMap = {};
      details.forEach((item) => {
        detailsMap[item.id] = item;
      });

      // 2. Fetch channel profiles (avatar icon) from /channels
      const channelIds = [...new Set(searchItems.map((item) => item.snippet?.channelId).filter(Boolean))];
      const channels = await getChannelDetails(channelIds);
      const channelsMap = {};
      channels.forEach((item) => {
        channelsMap[item.id] = item;
      });

      // 3. Merge video data with stats, duration and channel avatars
      const richVideos = searchItems.map((item) => {
        const videoId = item.id?.videoId;
        const detailInfo = detailsMap[videoId] || {};
        const channelId = item.snippet?.channelId;
        const channelInfo = channelsMap[channelId] || {};

        return {
          ...item,
          statistics: detailInfo.statistics || null,
          contentDetails: detailInfo.contentDetails || null,
          channelAvatar: channelInfo.snippet?.thumbnails?.default?.url || null,
          channelSubscribers: channelInfo.statistics?.subscriberCount || null
        };
      });

      if (isAppend) {
        setVideos((prev) => [...prev, ...richVideos]);
      } else {
        setVideos(richVideos);
      }
    } catch (error) {
      console.error('Error fetching rich videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Theme Toggler
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Search execution handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategoryTag('All');
    setActiveView('search');
    setActiveVideo(null); // stop playback when search is submitted

    // Add query to search history (unique queue of 10 items max)
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 10);
    });

    fetchRichVideos(query);
  };

  const handleDeleteHistoryItem = (queryToDelete) => {
    setSearchHistory((prev) => prev.filter((item) => item !== queryToDelete));
  };

  // Load More button handler
  const handleLoadMore = () => {
    if (nextPageToken) {
      fetchRichVideos(searchQuery, nextPageToken, true);
    }
  };

  // Tag filter chips handler
  const handleTagClick = (tag) => {
    setActiveCategoryTag(tag);
    setActiveVideo(null);
    if (tag === 'All') {
      setSearchQuery('Trending');
      fetchRichVideos('Trending');
    } else {
      setSearchQuery(tag);
      fetchRichVideos(tag);
    }
  };

  // Select video to play
  const handlePlayVideo = (video) => {
    setActiveVideo(video);
    if (video) {
      // Add video to Watch History (avoid duplicates)
      setWatchHistory((prev) => {
        const videoId = video.id?.videoId || video.id;
        const filtered = prev.filter(
          (v) => (v.id?.videoId || v.id) !== videoId
        );
        return [video, ...filtered];
      });
    }
  };

  // Likes & Dislikes state management
  const isVideoLiked = (video) => {
    if (!video) return false;
    const videoId = video.id?.videoId || video.id;
    return likedVideos.some((v) => (v.id?.videoId || v.id) === videoId);
  };

  const isVideoDisliked = (video) => {
    if (!video) return false;
    const videoId = video.id?.videoId || video.id;
    return dislikedVideoIds.includes(videoId);
  };

  const handleLikeToggle = () => {
    if (!activeVideo) return;
    const videoId = activeVideo.id?.videoId || activeVideo.id;
    const liked = isVideoLiked(activeVideo);

    if (liked) {
      // Remove from likes
      setLikedVideos((prev) => prev.filter((v) => (v.id?.videoId || v.id) !== videoId));
    } else {
      // Add to likes, remove from dislikes
      setLikedVideos((prev) => [activeVideo, ...prev]);
      setDislikedVideoIds((prev) => prev.filter((id) => id !== videoId));
    }
  };

  const handleDislikeToggle = () => {
    if (!activeVideo) return;
    const videoId = activeVideo.id?.videoId || activeVideo.id;
    const disliked = isVideoDisliked(activeVideo);

    if (disliked) {
      // Remove from dislikes
      setDislikedVideoIds((prev) => prev.filter((id) => id !== videoId));
    } else {
      // Add to dislikes, remove from likes
      setDislikedVideoIds((prev) => [...prev, videoId]);
      setLikedVideos((prev) => prev.filter((v) => (v.id?.videoId || v.id) !== videoId));
    }
  };

  // Watch Later toggle
  const isVideoInWatchLater = (video) => {
    if (!video) return false;
    const videoId = video.id?.videoId || video.id;
    return watchLater.some((v) => (v.id?.videoId || v.id) === videoId);
  };

  const handleWatchLaterToggle = () => {
    if (!activeVideo) return;
    const videoId = activeVideo.id?.videoId || activeVideo.id;
    const inWatchLater = isVideoInWatchLater(activeVideo);

    if (inWatchLater) {
      setWatchLater((prev) => prev.filter((v) => (v.id?.videoId || v.id) !== videoId));
    } else {
      setWatchLater((prev) => [activeVideo, ...prev]);
    }
  };

  // Subscribe channel handler
  const isChannelSubscribed = (video) => {
    if (!video) return false;
    const channelId = video.snippet?.channelId;
    return subscriptions.some((sub) => sub.channelId === channelId);
  };

  const handleSubscribeToggle = () => {
    if (!activeVideo) return;
    const channelId = activeVideo.snippet?.channelId;
    const channelTitle = activeVideo.snippet?.channelTitle;
    const channelAvatar = activeVideo.channelAvatar;
    const subscribed = isChannelSubscribed(activeVideo);

    if (subscribed) {
      setSubscriptions((prev) => prev.filter((sub) => sub.channelId !== channelId));
    } else {
      setSubscriptions((prev) => [...prev, { channelId, channelTitle, channelAvatar }]);
    }
  };

  // Playlist management
  const handleCreatePlaylist = (name) => {
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      videos: []
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const handleToggleVideoInPlaylist = (playlistId, video) => {
    const videoId = video.id?.videoId || video.id;
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const exists = pl.videos.some((v) => (v.id?.videoId || v.id) === videoId);
          if (exists) {
            return {
              ...pl,
              videos: pl.videos.filter((v) => (v.id?.videoId || v.id) !== videoId)
            };
          } else {
            return {
              ...pl,
              videos: [...pl.videos, video]
            };
          }
        }
        return pl;
      })
    );
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('Delete this playlist?')) {
      setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
      if (activeView === `playlist-${playlistId}`) {
        setActiveView('playlists');
      }
    }
  };

  const handleRemovePlaylistVideo = (playlistId, videoId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            videos: pl.videos.filter((v) => (v.id?.videoId || v.id) !== videoId)
          };
        }
        return pl;
      })
    );
  };

  // History clears
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      setWatchHistory([]);
    }
  };

  // Render main feed page content (videos grid + filter tags + load more)
  const renderMainFeedContent = () => {
    if (loading && videos.length === 0) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      );
    }

    if (videos.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div className="empty-state-text">No videos found.</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Try searching for a different keyword or category.</p>
        </div>
      );
    }

    return (
      <>
        <div className="videos-grid">
          {videos.map((video) => (
            <VideoCard
              key={video.id?.videoId || video.id}
              video={video}
              onClick={() => handlePlayVideo(video)}
            />
          ))}
        </div>
        {nextPageToken && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </>
    );
  };

  // Handle playing video or showing secondary view
  const renderMainContent = () => {
    if (activeVideo) {
      const filteredRelated = videos.filter(
        (v) => (v.id?.videoId || v.id) !== (activeVideo.id?.videoId || activeVideo.id)
      );

      // Sub-Layout: Cinema mode vs standard two-column
      if (cinemaMode) {
        return (
          <div className="cinema-mode-layout">
            <div className="cinema-video-container">
              <div className="cinema-player-inner">
                <iframe
                  title={activeVideo.snippet?.title}
                  src={`https://www.youtube.com/embed/${activeVideo.id?.videoId || activeVideo.id}?autoplay=1`}
                  className="video-frame"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>
            </div>
            <div className="playback-layout" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
              <div>
                <VideoPlayer
                  video={activeVideo}
                  cinemaMode={cinemaMode}
                  setCinemaMode={setCinemaMode}
                  isLiked={isVideoLiked(activeVideo)}
                  isDisliked={isVideoDisliked(activeVideo)}
                  onLikeToggle={handleLikeToggle}
                  onDislikeToggle={handleDislikeToggle}
                  isWatchLater={isVideoInWatchLater(activeVideo)}
                  onWatchLaterToggle={handleWatchLaterToggle}
                  onAddToPlaylist={() => setPlaylistModalOpen(true)}
                  isSubscribed={isChannelSubscribed(activeVideo)}
                  onSubscribeToggle={handleSubscribeToggle}
                />
                <CommentsSection videoId={activeVideo.id?.videoId || activeVideo.id} />
              </div>
              <div className="related-list">
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Up next</h3>
                {filteredRelated.map((video) => (
                  <VideoCard
                    key={video.id?.videoId || video.id}
                    video={video}
                    layout="list"
                    onClick={() => handlePlayVideo(video)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="playback-layout">
          <div>
            <VideoPlayer
              video={activeVideo}
              cinemaMode={cinemaMode}
              setCinemaMode={setCinemaMode}
              isLiked={isVideoLiked(activeVideo)}
              isDisliked={isVideoDisliked(activeVideo)}
              onLikeToggle={handleLikeToggle}
              onDislikeToggle={handleDislikeToggle}
              isWatchLater={isVideoInWatchLater(activeVideo)}
              onWatchLaterToggle={handleWatchLaterToggle}
              onAddToPlaylist={() => setPlaylistModalOpen(true)}
              isSubscribed={isChannelSubscribed(activeVideo)}
              onSubscribeToggle={handleSubscribeToggle}
            />
            <CommentsSection videoId={activeVideo.id?.videoId || activeVideo.id} />
          </div>
          <div className="related-list">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Up next</h3>
            {filteredRelated.map((video) => (
              <VideoCard
                key={video.id?.videoId || video.id}
                video={video}
                layout="list"
                onClick={() => handlePlayVideo(video)}
              />
            ))}
          </div>
        </div>
      );
    }

    // Sidebar Views routing
    if (
      activeView === 'liked' ||
      activeView === 'watchLater' ||
      activeView === 'history' ||
      activeView === 'playlists' ||
      activeView.startsWith('playlist-')
    ) {
      return (
        <LibraryViews
          view={activeView}
          playlists={playlists}
          likedVideos={likedVideos}
          watchLater={watchLater}
          watchHistory={watchHistory}
          selectedPlaylistId={selectedPlaylistId}
          onVideoClick={(video, playlistId = null) => {
            if (video) {
              handlePlayVideo(video);
            } else if (playlistId) {
              // Direct playlist view play
              setSelectedPlaylistId(playlistId);
              setActiveView(`playlist-${playlistId}`);
            }
          }}
          onClearHistory={handleClearHistory}
          onDeletePlaylist={handleDeletePlaylist}
          onRemovePlaylistVideo={handleRemovePlaylistVideo}
        />
      );
    }

    if (activeView === 'trending') {
      return (
        <div>
          <div className="library-view-header">
            <h2 className="library-view-title">Trending Videos</h2>
          </div>
          {renderMainFeedContent()}
        </div>
      );
    }

    if (activeView === 'subscriptions') {
      return (
        <div>
          <div className="library-view-header">
            <h2 className="library-view-title">Subscriptions Feed</h2>
          </div>
          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              <div className="empty-state-text">No subscriptions yet</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
                Subscribe to channels inside the video player page to customize this feed.
              </p>
            </div>
          ) : (
            renderMainFeedContent()
          )}
        </div>
      );
    }

    // Default Main Feed (Home & Search views)
    return (
      <>
        <CategoryTags activeTag={activeCategoryTag} onTagClick={handleTagClick} />
        {renderMainFeedContent()}
      </>
    );
  };

  return (
    <div className="app-wrapper">
      <Header
        onSearchSubmit={handleSearch}
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={() => {
          if (window.innerWidth <= 768) {
            setMobileSidebarOpen(!mobileSidebarOpen);
          } else {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchHistory={searchHistory}
        onDeleteSearchHistory={handleDeleteHistoryItem}
      />

      <div className="main-layout">
        <Sidebar
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            setActiveVideo(null); // clear player when switching pages
            setMobileSidebarOpen(false); // close mobile sidebar drawer
            if (view === 'trending') {
              setSearchQuery('Trending');
              fetchRichVideos('Trending');
            } else if (view === 'home') {
              setSearchQuery('Trending');
              setActiveCategoryTag('All');
              fetchRichVideos('Trending');
            } else if (view === 'subscriptions') {
              // Fetch search query for first subscribed channel as feed if available
              if (subscriptions.length > 0) {
                const subQuery = subscriptions.map(s => s.channelTitle).join(' | ');
                fetchRichVideos(subQuery);
              }
            }
          }}
          collapsed={sidebarCollapsed}
          showMobile={mobileSidebarOpen}
          playlists={playlists}
          setSelectedPlaylistId={setSelectedPlaylistId}
          subscriptions={subscriptions}
        />

        <main className={`content-area ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {renderMainContent()}
        </main>
      </div>

      <PlaylistModal
        isOpen={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        video={activeVideo}
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onToggleVideoInPlaylist={handleToggleVideoInPlaylist}
      />
    </div>
  );
};

export default App;

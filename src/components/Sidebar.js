import React from 'react';

const Sidebar = ({
  activeView,
  setActiveView,
  collapsed,
  showMobile,
  playlists = [],
  setSelectedPlaylistId,
  subscriptions = []
}) => {
  const handleLinkClick = (viewName, playlistId = null) => {
    setActiveView(viewName);
    if (playlistId !== null) {
      setSelectedPlaylistId(playlistId);
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      )
    },
    {
      id: 'trending',
      label: 'Trending',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.09.02-.17.06-.25.09-2.22.99-3.7 3.2-3.7 5.62 0 1.15.28 2.27.76 3.28l.05.12c-.2-.04-.37-.1-.56-.15-.73-.21-1.43-.6-1.92-1.16-.48-.56-.76-1.25-.87-1.95-.02-.13-.02-.27-.03-.41-.51.4-1.01.91-1.39 1.5-.7 1.09-1.09 2.4-1.09 3.73 0 3.73 3.01 6.75 6.75 6.75 3.1 0 5.75-2.09 6.55-4.96.11-.38.16-.76.16-1.15.02-1.38-.49-2.73-1.39-3.74zm-5.18 5.55c-.62-.05-1.11-.31-1.5-.7-.32-.32-.47-.74-.47-1.22 0-.85.45-1.51 1.29-1.81.44-.16.92-.17 1.37-.17.15 0 .3 0 .44.02.02.43-.02.94-.21 1.36-.26.57-.75.92-1.31.95l-.22.02z"/>
        </svg>
      )
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
        </svg>
      )
    }
  ];

  const libraryItems = [
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
        </svg>
      )
    },
    {
      id: 'watchLater',
      label: 'Watch Later',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
        </svg>
      )
    },
    {
      id: 'liked',
      label: 'Liked Videos',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
        </svg>
      )
    }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${showMobile ? 'show-mobile' : ''}`}>
      <div className="sidebar-section">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
            onClick={() => handleLinkClick(item.id)}
            title={item.label}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-text">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Library</div>
        {libraryItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
            onClick={() => handleLinkClick(item.id)}
            title={item.label}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-text">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Custom Playlists section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Playlists</div>
        <div
          className={`sidebar-link ${activeView === 'playlists' ? 'active' : ''}`}
          onClick={() => handleLinkClick('playlists')}
          title="All Playlists"
        >
          <span className="sidebar-link-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 9H2v2h17V9zm0-4H2v2h17V5zM2 15h13v-2H2v2zm15-2v6l5-3-5-3z"/>
            </svg>
          </span>
          <span className="sidebar-link-text">All Playlists</span>
        </div>

        {!collapsed && playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`sidebar-link ${activeView === `playlist-${playlist.id}` ? 'active' : ''}`}
            onClick={() => handleLinkClick(`playlist-${playlist.id}`, playlist.id)}
            style={{ paddingLeft: '28px' }}
            title={playlist.name}
          >
            <span className="sidebar-link-icon" style={{ fontSize: '14px', opacity: 0.7 }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </span>
            <span className="sidebar-link-text" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {playlist.name}
            </span>
          </div>
        ))}
      </div>

      {/* Subscriptions section */}
      {!collapsed && subscriptions.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Subscriptions</div>
          {subscriptions.map((sub, idx) => (
            <div
              key={idx}
              className="sidebar-link"
              onClick={() => handleLinkClick('search', sub.channelTitle)}
              title={sub.channelTitle}
              style={{ gap: '16px' }}
            >
              <span className="sidebar-link-icon">
                <img
                  src={sub.channelAvatar || 'https://via.placeholder.com/24'}
                  alt={sub.channelTitle}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </span>
              <span className="sidebar-link-text" style={{ fontSize: '13px' }}>
                {sub.channelTitle}
              </span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

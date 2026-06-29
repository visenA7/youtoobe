import React, { useState } from 'react';

const PlaylistModal = ({
  isOpen,
  onClose,
  video,
  playlists = [],
  onCreatePlaylist,
  onToggleVideoInPlaylist
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');

  if (!isOpen || !video) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  // Helper to check if video is in playlist
  const isVideoInPlaylist = (playlist) => {
    const videoId = video.id?.videoId || video.id;
    return playlist.videos.some(v => (v.id?.videoId || v.id) === videoId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Save video to...</span>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="playlist-checkbox-list">
          {playlists.map((playlist) => (
            <label key={playlist.id} className="playlist-checkbox-item">
              <input
                type="checkbox"
                checked={isVideoInPlaylist(playlist)}
                onChange={() => onToggleVideoInPlaylist(playlist.id, video)}
              />
              <span>{playlist.name}</span>
            </label>
          ))}
          {playlists.length === 0 && (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '8px 0' }}>
              No playlists found. Create one below!
            </div>
          )}
        </div>

        <form className="new-playlist-section" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Create new playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="new-playlist-input"
            required
          />
          <button type="submit" className="new-playlist-btn">
            Create Playlist
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaylistModal;

import React, { useState, useEffect } from 'react';
import { formatTimeAgo } from '../utils';

const SEED_COMMENTS = [
  {
    id: 'seed-1',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    text: 'This video is exactly what I was looking for! The production value is top-notch and the explanations are super clear. Thanks for uploading!',
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    likes: 42
  },
  {
    id: 'seed-2',
    author: 'Devon Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    text: 'Can anyone explain how they achieved that transition at 02:40? That was absolutely brilliant. Added to my favorites playlist!',
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
    likes: 19
  },
  {
    id: 'seed-3',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80',
    text: 'I have watched so many tutorials on this topic, but this one is by far the most straightforward and helpful. Subscribing right away.',
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    likes: 128
  }
];

const CommentsSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    const storedComments = localStorage.getItem(`comments-${videoId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      // Seed comments for the first time
      setComments(SEED_COMMENTS);
      localStorage.setItem(`comments-${videoId}`, JSON.stringify(SEED_COMMENTS));
    }
  }, [videoId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
      text: commentText.trim(),
      publishedAt: new Date().toISOString(),
      likes: 0,
      isUserComment: true
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments-${videoId}`, JSON.stringify(updatedComments));
    setCommentText('');
    setShowActions(false);
  };

  const handleCommentCancel = () => {
    setCommentText('');
    setShowActions(false);
  };

  const handleLikeComment = (commentId) => {
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        // Toggle mock comment like
        const alreadyLiked = c.userLiked;
        return {
          ...c,
          likes: alreadyLiked ? c.likes - 1 : c.likes + 1,
          userLiked: !alreadyLiked
        };
      }
      return c;
    });
    setComments(updatedComments);
    localStorage.setItem(`comments-${videoId}`, JSON.stringify(updatedComments));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Delete comment?')) {
      const updatedComments = comments.filter(c => c.id !== commentId);
      setComments(updatedComments);
      localStorage.setItem(`comments-${videoId}`, JSON.stringify(updatedComments));
    }
  };

  return (
    <div className="comments-container">
      <div className="comments-header">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </div>

      <form className="comment-input-section" onSubmit={handleCommentSubmit}>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
          alt="My Avatar"
          className="profile-avatar"
          style={{ width: '40px', height: '40px' }}
        />
        <div className="comment-input-wrapper">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setShowActions(true)}
            className="comment-textarea"
          />
          {showActions && (
            <div className="comment-actions">
              <button type="button" className="comment-btn-cancel" onClick={handleCommentCancel}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="comment-btn-submit" 
                disabled={!commentText.trim()}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="profile-avatar"
              style={{ width: '40px', height: '40px' }}
            />
            <div className="comment-body">
              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{formatTimeAgo(comment.publishedAt)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              
              <div className="comment-item-actions">
                <button 
                  className="comment-like-btn" 
                  onClick={() => handleLikeComment(comment.id)}
                  style={{ color: comment.userLiked ? 'var(--accent-blue)' : 'inherit' }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill={comment.userLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  <span>{comment.likes}</span>
                </button>
                
                {comment.isUserComment && (
                  <button 
                    className="comment-like-btn"
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{ color: 'var(--accent-red)' }}
                    title="Delete Comment"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;

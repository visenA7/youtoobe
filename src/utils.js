/**
 * Formats a view count number (or string) into a human-readable abbreviation (e.g., 1.2M, 45K).
 * @param {number|string} count 
 * @returns {string}
 */
export const formatViews = (count) => {
  const num = parseInt(count, 10);
  if (isNaN(num)) return '0 views';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B views';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
  }
  return num + (num === 1 ? ' view' : ' views');
};

/**
 * Parses an ISO 8601 duration string (e.g. PT1H2M30S) into H:MM:SS or M:SS.
 * @param {string} durationStr 
 * @returns {string}
 */
export const formatDuration = (durationStr) => {
  if (!durationStr) return '0:00';
  
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1], 10) || 0;
  const minutes = parseInt(match[2], 10) || 0;
  const seconds = parseInt(match[3], 10) || 0;

  if (hours > 0) {
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
};

/**
 * Formats an ISO date string into a relative time string (e.g. "3 days ago").
 * @param {string} dateString 
 * @returns {string}
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 0) return 'Just now';

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

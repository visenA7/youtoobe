import axios from 'axios';

const KEY = 'AIzaSyDkM7RDHtB0D2tU1_H0AjmI1zCaLPuHPgw';

const youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: KEY,
  },
});

export const searchVideos = async (query, pageToken = '') => {
  const response = await youtube.get('/search', {
    params: {
      part: 'snippet',
      maxResults: 12,
      type: 'video',
      q: query,
      pageToken: pageToken,
    },
  });
  return response.data;
};

export const getVideoDetails = async (videoIds) => {
  if (!videoIds || videoIds.length === 0) return [];
  const response = await youtube.get('/videos', {
    params: {
      part: 'snippet,contentDetails,statistics',
      id: videoIds.join(','),
    },
  });
  return response.data.items;
};

export const getChannelDetails = async (channelIds) => {
  if (!channelIds || channelIds.length === 0) return [];
  const response = await youtube.get('/channels', {
    params: {
      part: 'snippet,statistics',
      id: channelIds.join(','),
    },
  });
  return response.data.items;
};

export default youtube;

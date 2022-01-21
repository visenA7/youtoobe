import axios from 'axios';

const KEY = 'AIzaSyDkM7RDHtB0D2tU1_H0AjmI1zCaLPuHPgw';

export default axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: { part: 'snippet', maxResults: 5, type: 'video', key: KEY },
});

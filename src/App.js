import React, { useState, useEffect } from 'react';
import Youtube from './api/Youtube';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoPlay from './components/VideoPlay';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [videoP, setVideoP] = useState(null);

  const onSubmitHandler = async (inputValue) => {
    const response = await Youtube.get('/search', {
      params: {
        q: inputValue,
      },
    });
    setVideos(response.data.items);
    setVideoP(response.data.items[0]);
  };
  const onPlayBack = (e) => {
    setVideoP(e);
  };
  useEffect(() => {
    onSubmitHandler('Harry Potter');
  }, []);

  return (
    <div className="container">
      <SearchBar onSubmit={onSubmitHandler} />
      <div className="row">
        <VideoPlay data={videoP} />
        <VideoList videos={videos} playBack={onPlayBack} />
      </div>
    </div>
  );
};
export default App;

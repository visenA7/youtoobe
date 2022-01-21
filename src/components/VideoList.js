import React from 'react';
import VideoDetail from './VideoDetail';

const VideoList = (props) => {
  const { videos, playBack } = props;
  const renderdList = videos.map((video) => {
    return <VideoDetail key={video.etag} video={video} playBack={playBack} />;
  });
  return <div className="col">{renderdList}</div>;
};

export default VideoList;

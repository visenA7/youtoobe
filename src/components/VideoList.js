import React from 'react';
import VideoDetail from './VideoDetail';

class VideoList extends React.Component {
  render() {
    const { videos, playBack } = this.props;
    const renderdList = videos.map((video) => {
      return <VideoDetail key={video.etag} video={video} playBack={playBack} />;
    });
    return <div className="col">{renderdList}</div>;
  }
}

export default VideoList;

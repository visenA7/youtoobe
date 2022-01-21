import React from 'react';

const VideoDetail = ({ video, playBack }) => {
  const onClickHandler = () => {
    playBack(video);
  };
  return (
    <div className="card mb-3" style={{ maxWidth: '540px' }}>
      <div className="row g-0" onClick={onClickHandler}>
        <div className="col-md-4">
          <img
            src={video.snippet.thumbnails.medium.url}
            className="img-fluid rounded-start"
            alt={video.snippet.title}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{video.snippet.title}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;

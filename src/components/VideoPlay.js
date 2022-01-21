import React from 'react';

const VideoPlay = ({ data }) => {
  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <div className="col">
      <div className="ratio ratio-4x3">
        <iframe
          title={data.snippet.title}
          src={`https://www.youtube.com/embed/${data.id.videoId}`}
        />
      </div>
      <h4>{data.snippet.title}</h4>
      <p>{data.snippet.description}</p>
    </div>
  );
};

export default VideoPlay;

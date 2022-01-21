import React from 'react';
import Youtube from './api/Youtube';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoPlay from './components/VideoPlay';

class App extends React.Component {
  state = { videos: [], videoP: null };
  onSubmitHandler = async ({ inputValue }) => {
    const response = await Youtube.get('/search', {
      params: {
        q: inputValue,
      },
    });

    this.setState({
      videos: response.data.items,
      videoP: response.data.items[0],
    });
  };
  onPlayBack = (e) => {
    this.setState({ videoP: e });
  };
  componentDidMount() {
    this.onSubmitHandler({ inputValue: 'Trending' });
  }

  render() {
    return (
      <div className="container">
        <SearchBar onSubmit={this.onSubmitHandler} />
        <div className="row">
          <VideoPlay data={this.state.videoP} />
          <VideoList videos={this.state.videos} playBack={this.onPlayBack} />
        </div>
      </div>
    );
  }
}
export default App;

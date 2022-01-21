import React from 'react';

class SearchBar extends React.Component {
  state = { inputValue: '' };

  onFormSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Search Video</label>
          <input
            type="text"
            value={this.state.inputValue}
            onChange={(e) => this.setState({ inputValue: e.target.value })}
            className="form-control"
          />
        </div>
      </form>
    );
  }
}
export default SearchBar;

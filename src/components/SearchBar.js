import React, { useState } from 'react';

const SearchBar = (props) => {
  const [inputValue, setInputValue] = useState('');

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(inputValue);
  };
  return (
    <form onSubmit={onFormSubmit}>
      <div className="mb-3">
        <label className="form-label">Search Video</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="form-control"
        />
      </div>
    </form>
  );
};

export default SearchBar;

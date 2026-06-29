import React from 'react';

const TAGS = [
  'All',
  'Coding',
  'Lo-Fi Beats',
  'Gaming',
  'Acoustic Music',
  'Tech News',
  'React JS',
  'Movie Trailers',
  'Space Science',
  'Relaxing ASMR',
  'JavaScript',
  'Cooking Easy',
  'Tokyo Travel'
];

const CategoryTags = ({ activeTag, onTagClick }) => {
  return (
    <div className="category-tags-container">
      {TAGS.map((tag) => (
        <button
          key={tag}
          className={`category-tag ${activeTag === tag ? 'active' : ''}`}
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default CategoryTags;

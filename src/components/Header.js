import React, { useState, useEffect, useRef } from 'react';

const POPULAR_SUGGESTIONS = [
  'React JS tutorials',
  'JavaScript course for beginners',
  'Lofi hip hop radio to study/relax',
  'Gaming walkthrough gameplay',
  'Coding music mix',
  'Marvel movies official trailers',
  'Tech review latest smartphones',
  'ASMR for sleeping deep',
  'How to build a web application',
  'CSS tricks and animation tutorials',
  'Next.js crash course',
  'Space exploration documentary',
  'Cooking recipes easy dinner',
  'Travel vlog Tokyo',
  'Web development roadmap 2026'
];

const Header = ({
  onSearchSubmit,
  theme,
  toggleTheme,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  searchHistory = [],
  onDeleteSearchHistory
}) => {
  const [inputValue, setInputValue] = useState(searchQuery || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Handle clicking outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearchSubmit(inputValue.trim());
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (val) => {
    setInputValue(val);
    setSearchQuery(val);
    onSearchSubmit(val);
    setShowDropdown(false);
  };

  const handleClearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };

  // Filter suggestions based on input
  const getFilteredSuggestions = () => {
    if (!inputValue.trim()) {
      // Show search history when input is empty
      return searchHistory.map(item => ({ text: item, isHistory: true }));
    }

    const filtered = POPULAR_SUGGESTIONS.filter(item =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Limit to 8 items
    return filtered.slice(0, 8).map(item => ({ text: item, isHistory: false }));
  };

  const suggestions = getFilteredSuggestions();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <div className="logo-container" onClick={() => handleSuggestionClick('Harry Potter')}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.387.508 9.387.508s7.517 0 9.387-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <span className="logo-text">YouToobe</span>
        </div>
      </div>

      <div className="header-middle" ref={dropdownRef}>
        <form className="search-form" onSubmit={handleFormSubmit}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="search-input"
            />
            {inputValue && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="Clear Search"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </form>

        {showDropdown && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(item.text)}
              >
                <span className="suggestion-icon">
                  {item.isHistory ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  )}
                </span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.text}
                </span>
                {item.isHistory && (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSearchHistory(item.text);
                    }}
                    title="Remove from history"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="header-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            // Sun Icon for Light Mode option
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
            </svg>
          ) : (
            // Moon Icon for Dark Mode option
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          )}
        </button>
        <button className="header-icon-btn" title="Create Video (Mock)">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
          </svg>
        </button>
        <button className="header-icon-btn" title="Notifications (Mock)">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
          alt="Profile Avatar"
          className="profile-avatar"
          title="Your Account"
        />
      </div>
    </header>
  );
};

export default Header;

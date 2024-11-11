"use client";

import React, { useState } from 'react';

function Header({ isLoggedIn, setIsLoggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignInOut = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-section">
        <img src="path/to/logo.png" alt="Logo" className="logo" />
        <h1>WeatherTabs.net</h1>
      </div>
      <div className="user-section">
        <img
          src="./image/userIcon.png"
          alt="User"
          className="user-icon"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="dropdown">
            {isLoggedIn ? (
              <>
                <button onClick={handleSignInOut}>Sign Out</button>
                <button>User Preferences</button>
                <button>Arrange Tabs</button>
                <button>Report an Issue</button>
              </>
            ) : (
              <button onClick={handleSignInOut}>Sign In</button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

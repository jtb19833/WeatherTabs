"use client";

import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import ImageButton from './ImageButton';

function Header({ isLoggedIn, setIsLoggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignIn = () => {
    setIsDropdownOpen(false);
    redirect("/login", "replace")
  };
  
  const handleSignOut = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsDropdownOpen(false);
    redirect("/", "replace")
  };

  return (
    <header className="header">
      <div className="logo-section">
        <ImageButton data = {{linkTo:isLoggedIn?"/userpage":"/", source:"/logo.png",altText:"Logo",ht:64,wd:247}}/>
      </div>
      <div className="user-section">
        <div className='user-bg'>
          <img
            src="/userIcon.png"
            alt="User"
            className="user-icon"
            height={45}
            width={45}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>
        {isDropdownOpen && (
          <div className="dropdown">
            {isLoggedIn ? (
              <>
                <button onClick={handleSignOut}>Sign Out</button>
                <button>User Preferences</button>
                <button>Arrange Tabs</button>
                <button>Report an Issue</button>
              </>
            ) : (
              <button onClick={handleSignIn}>Sign In</button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

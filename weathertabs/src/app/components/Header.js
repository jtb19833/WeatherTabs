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
    <header className="flex flex-row items-center justify-between bg-blue-600 px-3 py-2 fixed w-full">
      <ImageButton data = {{linkTo:isLoggedIn?"/userpage":"/", source:"/logo.png",altText:"Logo",ht:64,wd:247}}/>
        <div className='h-[50px] w-[50px] bg-indigo-400 rounded-3xl'>
        <img
          src="/userIcon.png"
          alt="User"
          className="h-[45px] w-[45px] self-center rounded-xl"
          height={45}
          width={45}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="flex flex-col bg-white mt-5 w-500 absolute end-0 justify-start items-start p-5 gap-2 text-lg underline decoration-1 rounded-xl">
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



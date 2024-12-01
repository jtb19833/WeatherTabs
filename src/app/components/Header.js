"use client";

import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ImageButton from './ImageButton';
import axios from 'axios';
import { useParams } from 'next/navigation';

function Header({ isLoggedIn, toggleEdit }) {
  console.log("function: " + toggleEdit)
  const { id: token } = useParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState('/userIcon.png'); // State for user image
  const router = useRouter();

  const userPrefs = () => {
    setIsDropdownOpen(false);
    redirect('/'+token+"/preferences","replace")
  }

  const reportIssues = () => {
    setIsDropdownOpen(false);
    redirect('/'+token+"/reportIssues","replace")
  }

  const handleSignIn = () => {
    setIsDropdownOpen(false);
    redirect("/login", "replace")
  };

  const handleLogout = async () => {
    try {
        const response = await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });

        if (response.status === 200) {
            console.log(response.data.message); // "Logged out successfully"
            router.push('/'); // Redirect to homepage
        }
    } catch (error) {
        console.error('Error logging out:', error.response || error);
        window.alert('Failed to log out. Please try again.');
    }
};

useEffect(() => {
  const fetchUserData = async () => {
      try {
          const response = await axios.get('http://localhost:3001/api/user', { withCredentials: true });
          if (response.data.imagePath) {
              // Correct variable usage
              setUserImage(`http://localhost:3001/${response.data.imagePath.replace(/\\/g, '/')}`);
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
          setUserImage('/userIcon.png'); // Fallback image
      }
  };

  fetchUserData();
}, []);

  return (
    <header className="flex flex-row items-center justify-between bg-blue-600 z-10 px-3 py-2 fixed w-full">
      <ImageButton data = {{linkTo:isLoggedIn?"/"+token:"/", source:"/logo.png",altText:"Logo",ht:64,wd:247}}/>
        <div className='h-[50px] w-[50px] bg-indigo-400 rounded-3xl'>
        <img
          src={userImage}
          alt="User"
          className="h-[50px] w-[50px] self-center rounded-3xl"
          height={50}
          width={50}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="flex flex-col bg-white mt-5 w-500 absolute end-0 justify-start items-start px-5 py-3 text-lg underline decoration-1 rounded-xl">
            {isLoggedIn ? (
              <>
                <button className = "py-2" onClick={handleLogout}>Sign Out</button>
                <button className = "py-2" onClick={userPrefs}>User Preferences</button>
                {toggleEdit?<button className = "py-2" onClick={toggleEdit}>Arrange Tabs</button>:<div></div>}
                <button className = "py-2" onClick={reportIssues}>Report an Issue</button>
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



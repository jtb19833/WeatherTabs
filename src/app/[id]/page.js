"use client";

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import WeatherItem from '../components/WeatherItem';
import axios from 'axios';
import { useParams, redirect } from "next/navigation";

function Home() {

  const [weatherData, setWeatherData] = useState([]);
  const [tabs, setTabs] = useState({ content: [] });
  const { id: token } = useParams();
  console.log(token);

  const getTabs = async () => {
    console.log(token);
    try {
      const tabResponse = await axios.get('http://localhost:3001/api/tabs', { withCredentials: true });
      console.log("Successfully retrieved user tabs");
      setTabs({ content: tabResponse.data.tabs });
    } catch (error) {
      console.log("Error retrieving tabs (" + error + ")");
      setTabs({ content: [] });
    }
  };

  // Handle deletion of a tab
  const handleDelete = async (position) => {
    console.log("Deleting tab with position:", position);
    try {
      const response = await axios.delete('http://localhost:3001/api/delete_tab', {
        data: {
          token: token,
          position: position, // Send position for the tab to be deleted
        },
      });
      console.log('Tab deleted successfully', response.data);

      // Update state after deletion
      setTabs(prevTabs => ({
        content: prevTabs.content.filter(tab => tab.position !== position)
      }));
      window.location.reload();
    } catch (error) {
      console.error('Error deleting tab:', error);
    }
  };

  useEffect(() => {
    getTabs();
  }, [token]); 

  useEffect(() => {
    console.log("Loading tabs")
    setWeatherData(tabs.content);
  }, [tabs.content]);

  const addCity = () => {
    redirect("/" + token + "/addtab", "replace");
  };

  return (
    <div className='flex flex-col items-center bg-sky-200 min-h-screen min-w-screen pb-10'>
      <Header isLoggedIn={true} setIsLoggedIn={() => {}} />
      <div className="min-h-[50px]"></div>
      <div className="flex flex-col p-8 w-full max-w-[1200px]">
        {weatherData.sort().map((item, index) => (
          <div key={index}>
            <WeatherItem key={index} data={{ units: "imperial", location: item }} />
            <button
              className="font-bold text-lg bg-red-600 text-white py-2 px-4 rounded-lg mt-4"
              onClick={() => handleDelete(item.position)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="px-8 w-full max-w-[1200px]">
        <button
          className="font-bold text-7xl bg-inherit border-dashed border-[7px] border-indigo-300 text-white w-full max-w-[1200px] h-[300px] rounded-2xl"
          onClick={addCity}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Home;

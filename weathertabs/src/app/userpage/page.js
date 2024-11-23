"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import WeatherItem from '../components/WeatherItem';
import { redirect } from "next/navigation";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
  const [weatherData, setWeatherData] = useState([
    {
      location: 'Athens, GA, USA',
      temp: 76,
      condition: 'Sunny',
      highLow: { high: 80, low: 66 },
      forecast: {
        summary: 'Clear throughout the next 8 hours',
      },
    },
    {
      location: 'Atlanta, GA, USA',
      temp: 68,
      condition: 'Thunderstorm',
      highLow: { high: 72, low: 57 },
      forecast: {
        summary: 'Thunderstorms likely with chances of rain',
      },
    },
    {
      location: 'New York, NY, USA',
      temp: 53,
      condition: 'Partly Cloudy',
      highLow: { high: 65, low: 50 },
      forecast: {
        summary: 'Partly cloudy conditions expected',
      },
    },
  ]);
  /*
  const addCity = () => {
    const newCity = {
      location: 'Sample City, SC, USA',
      temp: 70,
      condition: 'Cloudy',
      highLow: { high: 75, low: 65 },
      forecast: { summary: 'Cloudy with a chance of rain' },
    };
    setWeatherData([...weatherData, newCity]);
  };
  */
  const addCity = () => {
    redirect("/addtab", "replace")
  }

  return (
    <div className='flex flex-col items-center bg-sky-200 min-h-screen min-w-screen'>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="min-h-[50px]"></div>
      <div className="flex flex-col p-8 w-full max-w-[1200px]">
        {weatherData.map((item, index) => (
          <WeatherItem key={index} {...item} />
        ))}
      </div>
      {isLoggedIn && (
        <div className="p-8 w-full max-w-[1200px]">
          <div className="flex flex-col self-center items-center gap-2 bg-indigo-300 w-full max-w-[1200px] rounded-2xl shadow-lg p-5 gap-20">
            <h2 className='font-bold text-white text-2xl'>Add a City</h2>
            <button className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={addCity}>Add Tab</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import WeatherItem from '../components/WeatherItem';
import { redirect } from "next/navigation";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
  const [weatherData, setWeatherData] = useState([
    {
      lat: 33.9519,
      long: -83.3576,
      position:1
    },
    {
      lat: 33.7501,
      long: -84.3885,
      position:2
    },
    {
      lat: 40.7128,
      long: -74.0060,
      position:3
    },
    {
      lat: 35.2072,
      long: -3.75,
      position:4
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
    <div className='flex flex-col items-center bg-sky-200 min-h-screen min-w-screen pb-10'>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="min-h-[50px]"></div>
      <div className="flex flex-col p-8 w-full max-w-[1200px]">
        {weatherData.sort().map((item, index) => (
          <WeatherItem key={index} data={{units:"imperial", location:item}}/>
        ))}
      </div>
      {isLoggedIn && (
        <div className="px-8 w-full max-w-[1200px]">
          <button className="font-bold text-7xl bg-inherit border-dashed border-[7px] border-indigo-300 text-white w-full max-w-[1200px] h-[300] rounded-2xl" onClick={addCity}>+</button>
        </div>
      )}
    </div>
  );
}

export default Home;

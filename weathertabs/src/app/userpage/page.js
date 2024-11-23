"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import WeatherItem from '../components/WeatherItem';
import { redirect } from "next/navigation";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
  const [weatherData, setWeatherData] = useState([
    {
      location: 'Athens, GA, USA asidbgeriobgiuwboyihrejqbfvgu jkhkfjcyvubhl jctguybhlvgcytfgyocfcgj vhhygcfy guvtdvbyibj hctf7icfjhk hvhff76ith gjbhj cgnf7tvhgftd',
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
    <div className='flex flex-col items-center bg-sky-200 min-h-screen min-w-screen pb-10'>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="min-h-[50px]"></div>
      <div className="flex flex-col p-8 w-full max-w-[1200px]">
        {weatherData.map((item, index) => (
          <WeatherItem key={index} {...item} />
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

"use client";

import React, { useState } from 'react';
import Header from './components/Header';
import WeatherItem from './components/WeatherItem';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state here
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
  ]);

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

  return (
    <div className='flex flex-col items-center bg-sky-200 min-h-screen min-w-screen'>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="min-h-[50px]"></div>
      <div className="flex flex-col p-8 w-full max-w-[1200px]">
        {weatherData.map((item, index) => (
          <WeatherItem key={index} data={{units:"imperial", location:item}}/>
        ))}
      </div>
    </div>
  );
}

export default Home;

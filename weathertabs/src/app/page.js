"use client";

import React, { useState } from 'react';
import Header from './components/Header';
import WeatherItem from './components/WeatherItem';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state here
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
    <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="weather-list">
        {weatherData.map((item, index) => (
          <WeatherItem key={index} {...item} />
        ))}
      </div>
      {isLoggedIn && (
        <div className="add-city-form">
          <h2>Add a City</h2>
          <button onClick={addCity}>Add Sample City</button>
        </div>
      )}
    </div>
  );
}

export default Home;

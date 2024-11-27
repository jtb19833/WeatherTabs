"use client";

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import WeatherItem from '../../components/WeatherItem';
import axios from 'axios';
import { useParams, redirect } from "next/navigation";

function Home() {

  let tabs = []
  const { id: token } = useParams();
  console.log(token)
  
  useEffect(  () => {
    const getTabs = async () => {
      tabs = await axios.get('http://localhost:3001/api/tabs',{token})
    }
    getTabs()
  })

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
  const [weatherData, setWeatherData] = useState(tabs);
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
    redirect("/addtab/"+token, "replace")
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
          <button className="font-bold text-7xl bg-inherit border-dashed border-[7px] border-indigo-300 text-white w-full max-w-[1200px] h-[300px] rounded-2xl" onClick={addCity}>+</button>
        </div>
      )}
    </div>
  );
}

export default Home;
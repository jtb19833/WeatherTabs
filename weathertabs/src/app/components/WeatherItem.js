"use client";

import React from 'react';
import { useState } from 'react';

function WeatherItem({ location, temp, condition, highLow, forecast }) {

  const [selectedItem,setItem] = useState('Overview')

  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 self-center rounded-2xl bg-indigo-300 mt-5 shadow-lg text-white h-[300] w-full max-w-1200 ">
      <div className="flex flex-row items-center mx-2 gap-5 h-full w-2/3">
        <img src="path/to/weather-icon.png" alt="Weather Icon" className="self-center w-[120px] h-[120px]" />
        <div className="flex flex-col p-1 justify-start gap-2 content-center h-full py-5 w-full pe-5">
          <h2 className='overflow-x-auto text-nowrap pe-5 pb-2 min-w-0 text-2xl font-bold'>{location}</h2>
          <p className='text-xl font-semibold'>{condition}, {temp}° F</p>
          {switchItems(selectedItem)}
        </div>
      </div>
      <view className='h-full w-1 bg-white'></view>
      <div className="flex flex-col justify-center gap-5 items-center h-full w-1/5 text-white text-lg font-bold">
        <ul>
          <li onClick={() => setItem("Overview")} className='py-2'>Overview</li>
          <li onClick={() => setItem("Forecast-D")} className='py-2'>7-Day Forecast</li>
          <li onClick={() => setItem("Forecast-H")} className='py-2'>Hourly Forecast</li>
          <li onClick={() => setItem("Conditions")} className='py-2'>Typical Conditions</li>
          <li onClick={() => setItem("Advisories")} className='py-2'>Weather Advisories</li>
        </ul>
      </div>
    </div>
  );
}

function switchItems(item, ) {
  switch(item) {
    case 'Overview':
      return (
        <div>
          <p className='text-lg font-med'>Overview</p>
        </div>
      )
    case "Forecast-D":
      return (
        <div>
          <p className='text-lg font-med'>Daily Forecast</p>
        </div>
      )
    case "Forecast-H":
      return (
        <div>
          <p className='text-lg font-med'>Hourly Forecast</p>
        </div>
      )
    case "Conditions":
      return (
        <div>
          <p className='text-lg font-med'>Conditions</p>
        </div>
      )
    case "Advisories":  
    return (
      <div>
        <p className='text-lg font-med'>Advisories</p>
      </div>
    )
    default:
      return (
        <div>
          <p className='text-lg font-med'>High {highLow.high}° F, Low {highLow.low}° F</p>
          <p className='text-lg font-med'>{forecast.summary}</p>
        </div>
      )

  }
};

export default WeatherItem;


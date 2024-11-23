"use client";

import React from 'react';

function WeatherItem({ location, temp, condition, highLow, forecast }) {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 self-center rounded-2xl bg-indigo-300 mt-5 shadow-lg text-white h-[300] w-full max-w-1200 ">
      <div className="flex flex-row items-center mx-2 gap-5 h-full">
        <img src="path/to/weather-icon.png" alt="Weather Icon" className="w-[60px] h-[60px]" />
        <div className="flex flex-col p-1 justify-between content-center h-full">
          <h2 className='text-2xl font-bold'>{location}</h2>
          <p className='text-lg font-med'>{condition}, {temp}° F</p>
          <p className='text-lg font-med'>High {highLow.high}° F, Low {highLow.low}° F</p>
          <p className='text-lg font-med'>{forecast.summary}</p>
        </div>
      </div>
      <div className="flex flex-col p-1 justify-center gap-5 content-center h-full text-white">
        <ul>
          <li className='py-2'>Overview</li>
          <li className='py-2'>7-Day Forecast</li>
          <li className='py-2'>Hourly Forecast</li>
          <li className='py-2'>Typical Conditions</li>
          <li className='py-2'>Weather Advisories</li>
        </ul>
      </div>
    </div>
  );
}

export default WeatherItem;

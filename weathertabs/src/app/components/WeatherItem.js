"use client";

import React from 'react';

function WeatherItem({ location, temp, condition, highLow, forecast }) {
  return (
    <div className="weather-item">
      <div className="weather-main">
        <img src="path/to/weather-icon.png" alt="Weather Icon" className="weather-icon" />
        <div className="weather-info">
          <h2>{location}</h2>
          <p>{condition}, {temp}° F</p>
          <p>High {highLow.high}° F, Low {highLow.low}° F</p>
          <p>{forecast.summary}</p>
        </div>
      </div>
      <div className="forecast-sidebar">
        <h3>Overview</h3>
        <ul>
          <li>7-Day Forecast</li>
          <li>Hourly Forecast</li>
          <li>Typical Conditions</li>
          <li>Weather Advisories</li>
        </ul>
      </div>
    </div>
  );
}

export default WeatherItem;

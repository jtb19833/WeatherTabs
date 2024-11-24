"use client";

import React, { useEffect } from 'react';
import { useState } from 'react';
import WeatherSnippet from './WeatherSnippet';


function WeatherItem(data) {
  data = data.data
  const today = new Date()
  const [LocationData,setLocation] = useState("")
  const [WeatherData,setWeather] = useState({})
  const api = "2lxAbxJh1Nveky6nMnuJUm56dHxY8e62p4fuPLkSJQ8W9n64qhdVJQQJ99AKACYeBjFZMj7nAAAgAZMP22WW"
  useEffect (() => {
    let longitude = data.location.long
    let latitude = data.location.lat
    let units=data.units
    async function getAzureResponse () {
      let link = "https://atlas.microsoft.com/reverseGeocode?api-version=2023-06-01&coordinates="+longitude+","+latitude+"&resultTypes=PopulatedPlace&subscription-key="+api
      let response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const JSONresponse = await response.json()
      const locationData = JSONresponse.features[0]
      const city = locationData.properties.address.locality
      const state = locationData.properties.address.adminDistricts[0].name
      const country = locationData.properties.address.countryRegion.name
      setLocation(city + ", " + state + ", " + country)
      link = "https://atlas.microsoft.com/weather/currentConditions/json?api-version=1.1&query="+latitude+","+longitude+"&unit="+units+"&subscription-key="+api
      response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const currentWeather = await response.json()
      link = "https://atlas.microsoft.com/weather/forecast/hourly/json?api-version=1.1&query="+latitude+","+longitude+"&duration=24&unit="+units+"&subscription-key="+api
      response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const hourlyforecast = await response.json()
      link = "https://atlas.microsoft.com/weather/forecast/daily/json?api-version=1.1&query="+latitude+","+longitude+"&duration=10&unit="+units+"&subscription-key="+api
      response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const dailyforecast = await response.json()
      link = "https://atlas.microsoft.com/weather/severe/alerts/json?api-version=1.1&query="+latitude+","+longitude+"&subscription-key="+api
      response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const weatheradvisories = await response.json()
      link = "https://atlas.microsoft.com/weather/historical/normals/daily/json?api-version=1.1&query="+latitude+","+longitude+"&unit="+units+"&startDate="+(today.getFullYear())+"-"+(today.getMonth())+"-"+(today.getDate())+"&endDate="+(today.getFullYear())+"-"+(today.getMonth())+"-"+(today.getDate())+"&subscription-key="+api
      response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const typicalconditions = await response.json()
      link = "https://atlas.microsoft.com/timezone/byCoordinates/json?api-version=1.0&query="+latitude+","+longitude+"&subscription-key="+api
      response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const timeZone = await response.json()
      
      const weatherBundle = {
        timezone:timeZone.TimeZones[0].Id,
        current:currentWeather.results[0],
        daily: dailyforecast.forecasts,
        hourly:hourlyforecast.forecasts,
        advisories:weatheradvisories.results,
        typical:typicalconditions.results[0]
      }
      setWeather(weatherBundle)
      
    }
    getAzureResponse()
  },[]) 

  
  const [selectedItem,setItem] = useState('Overview')
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 self-center rounded-2xl bg-indigo-300 mt-5 shadow-lg text-white h-[300] w-full max-w-1200 ">
      <div className="flex flex-row items-center mx-2 gap-5 h-full w-2/3">
        <img src={"/icons/"+(WeatherData.current && WeatherData.current.iconCode)+".svg"} fill="red" alt="Weather Icon" className="self-center w-[120px] h-[120px]" />
        <div className="flex flex-col p-1 justify-start gap-2 content-center h-full py-5 w-full pe-5">
          <h2 className='overflow-x-auto text-nowrap pe-5 pb-2 min-w-0 text-2xl font-bold'>{LocationData}</h2>
          <p className='text-xl font-semibold'>{WeatherData.current && WeatherData.current.phrase}, {WeatherData.current && WeatherData.current.temperature.value} °{WeatherData.current && WeatherData.current.temperature.unit}</p>
          {switchItems(selectedItem, WeatherData)}
        </div>
      </div>
      <div className='h-full w-1 bg-white'></div>
      <div className="flex flex-col justify-center gap-5 items-center h-full w-1/5 text-white text-lg font-bold">
        <ul>
          <li onClick={() => setItem("Overview")} className={selectedItem==="Overview"?("underline underline-offset-4"):"" + 'py-2'}>Overview</li>
          <li onClick={() => setItem("Forecast-D")} className={selectedItem==="Forecast-D"?("underline underline-offset-4"):"" + 'py-2'}>10-Day Forecast</li>
          <li onClick={() => setItem("Forecast-H")} className={selectedItem==="Forecast-H"?("underline underline-offset-4"):"" + 'py-2'}>Hourly Forecast</li>
          <li onClick={() => setItem("Conditions")} className={selectedItem==="Conditions"?("underline underline-offset-4"):"" + 'py-2'}>Typical Conditions</li>
          <li onClick={() => setItem("Advisories")} className={selectedItem==="Advisories"?("underline underline-offset-4"):"" + 'py-2'}>Weather Advisories</li>
        </ul>
      </div>
    </div>
  );

  
}

function switchItems(item, WeatherData) {
  console.log(WeatherData)
  const now = new Date()
  const dayLetters = ['S','M','T','W','T','F','S']
  switch(item) {
    case 'Overview':
      return (
        <div>
          
        </div>
      )
    case "Forecast-D":
      return (
        <div className='flex flex-row w-5/6 overflow-auto gap-4'>
          {WeatherData.daily.map((timeslot,index) => (
              <WeatherSnippet key={index} data={{period:(new Date(timeslot.date).toLocaleString('en-US', {weekday:'short',timeZone:WeatherData.timezone})), high:timeslot.temperature.maximum.value, low:timeslot.temperature.minimum.value, precipitation:timeslot.day.precipitationProbability, icon:"/icons/"+timeslot.day.iconCode+".svg"}}/>
          ))}
        </div>
      )
    case "Forecast-H":
      return (
        <div className='flex flex-row w-5/6 pb-2 overflow-auto gap-3'>
          {WeatherData.hourly.map((timeslot,index) => (
              <WeatherSnippet key={index} data={{period:(new Date(timeslot.date).toLocaleString('en-US', {hour:'2-digit', hour12: true, timeZone:WeatherData.timezone})), high:timeslot.temperature.value, low:"None", precipitation:timeslot.precipitationProbability, icon:"/icons/"+timeslot.iconCode+".svg"}}/>
          ))}
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
        {
          (WeatherData.advisories && (WeatherData.advisories.length) === 0) ? 
          (<p>No advisories are currently active for this location.</p>):
          <div>
            {WeatherData.advisories.map((advisory, index) => (
              <p key={index}>{advisory.description.english}: {advisory.alertAreas[0].summary}</p>
            ))}
          </div>
        }
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


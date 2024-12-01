"use client";

import React, { useEffect } from 'react';
import { useState } from 'react';
import WeatherSnippet from './WeatherSnippet';
import next from 'next';


function WeatherItem(data) {
  data = data.data
  const today = new Date()
  const [LocationData,setLocation] = useState("")
  const [WeatherData,setWeather] = useState({})
  const api = "2lxAbxJh1Nveky6nMnuJUm56dHxY8e62p4fuPLkSJQ8W9n64qhdVJQQJ99AKACYeBjFZMj7nAAAgAZMP22WW"
  const [time12,setTimeFormat] = useState(true)
  useEffect (() => {
    console.log("Data:")
    console.log(data)
    let longitude = data.location.long
    let latitude = data.location.lat
    let units=data.preferences.units
    setTimeFormat(data.preferences.timeFormat === '12h')
    async function getAzureResponse () {
      let link = "https://atlas.microsoft.com/reverseGeocode?api-version=2023-06-01&coordinates="+longitude+","+latitude+"&subscription-key="+api
      let response = await fetch(
        link,{method:'GET'}
      )
      console.log(link)
      const JSONresponse = await response.json()
      const locationData = JSONresponse.features[0]
      const city = locationData.properties.address.locality||""
      const state = locationData.properties.address.adminDistricts[0].name
      const country = locationData.properties.address.countryRegion.name
      setLocation(city + (city===""?"":", ") + state + ", " + country)
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
      link = "https://atlas.microsoft.com/weather/historical/normals/daily/json?api-version=1.1&query="+latitude+","+longitude+"&unit="+units+"&startDate="+(today.getFullYear())+"-"+(today.getMonth() < 10?"0":"")+(today.getMonth())+"-"+(today.getDate() < 10?"0":"")+(today.getDate())+"&endDate="+(today.getFullYear())+"-"+(today.getMonth() < 10?"0":"")+(today.getMonth())+"-"+(today.getDate() < 10?"0":"")+(today.getDate())+"&subscription-key="+api
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
        location:city,
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
    <div className="flex flex-row justify-between items-center px-4 py-2 self-center rounded-2xl bg-indigo-300 mt-5 shadow-lg text-white h-[300px] w-full max-w-[1200px] h-[300px]">
      <div className="flex flex-row items-center mx-2 gap-5 h-full w-2/3 max-w-[800px]">
        <img src={"/icons/"+(WeatherData.current && WeatherData.current.iconCode)+".svg"} fill="red" alt="Weather Icon" className="self-center w-[120px] h-[120px]" />
        <div className="flex flex-col p-1 justify-start gap-2 content-center h-full py-5 w-full pe-5">
          <h2 className='overflow-x-auto text-nowrap pe-5 pb-2 min-w-0 w-5/6 text-2xl font-bold'>{LocationData}</h2>
          <p className='text-xl font-semibold'>{WeatherData.current && WeatherData.current.phrase}, {WeatherData.current && WeatherData.current.temperature.value} °{WeatherData.current && WeatherData.current.temperature.unit}</p>
          {switchItems(selectedItem, WeatherData,time12)}
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

function switchItems(item, WeatherData, timeFormat) {
  console.log(timeFormat)
  console.log(WeatherData)
  switch(item) {
    case 'Overview':
      let Overview = "Loading..."
      const next8Hours = WeatherData.hourly && WeatherData.hourly.slice(0,8)
      let previousCondition = WeatherData.current && WeatherData.current
      let stabilityCount = 0;
      console.log(next8Hours)
      next8Hours && next8Hours.every((item) => {
        if (item.iconCode !== previousCondition.iconCode) {
          if(item.hasPrecipitation && previousCondition.hasPrecipitation && item.precipitationType === previousCondition.precipitationType) {
            stabilityCount += 1;
            return true;
          }
          if (item.hasPrecipitation && !previousCondition.hasPrecipitation || item.precipitationType !== previousCondition.precipitationType && item.hasPrecipitation) {
            Overview = item.precipitationType + " expected to start " + (stabilityCount === 0 ? "soon.":"in " + stabilityCount + " hour" + (stabilityCount === 1 ? ".":"s."))
            return false;
          }
          if (!item.hasPrecipitation && previousCondition.hasPrecipitation) {
            Overview = previousCondition.precipitationType + " expected to stop " + (stabilityCount === 0 ? "soon.":"in " + stabilityCount + " hour" + (stabilityCount === 1 ? ".":"s."))
            console.log(item.date)
            return false;

          }
          if(!(item.isDayTime||item.isDaylight) && (previousCondition.isDayTime||previousCondition.isDaylight)) {
            Overview = "Sun sets " + (stabilityCount === 0 ? "soon.":"in " + stabilityCount + " hour" + (stabilityCount === 1 ? ".":"s."))
            return false
          }
          if((item.isDayTime||item.isDaylight) && !(previousCondition.isDayTime||previousCondition.isDaylight)) {
            Overview = "Sun rises " + (stabilityCount === 0 ? "soon.":"in " + stabilityCount + " hour" + (stabilityCount === 1 ? ".":"s."))
            return false
          }
          if (item.cloudCover !== previousCondition.cloudCover) {
            Overview = "Cloud Coverage expected to " + (item.cloudCover < previousCondition.cloudCover ? "decrease":"increase") + " " + (stabilityCount === 0 ? "soon.":"in " + stabilityCount + " hour" + (stabilityCount === 1 ? ".":"s."))
            return false;
          }
          return true;
        } else {
          stabilityCount += 1;
          return true;
        }
      })
      if (stabilityCount===8) {
        Overview = (WeatherData.current && WeatherData.current.phrase) + " conditions expected to continue through the next 8 hours."
      }
      return (
        <div>
          <p>Feels Like {WeatherData.current && WeatherData.current.realFeelTemperature.value}°, Precipitation (Past 12 Hours): {WeatherData.current && WeatherData.current.precipitationSummary.past12Hours.value} {WeatherData.current && WeatherData.current.precipitationSummary.past12Hours.unit}</p>
          <p>Relative Humidity {WeatherData.current && WeatherData.current.relativeHumidity}%, Visibility {WeatherData.current && WeatherData.current.visibility.value } {WeatherData.current && WeatherData.current.visibility.unit}</p>
          <br/>
          <p>{Overview}</p>
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
        <div className='flex flex-row w-5/6 overflow-auto gap-3'>
          {WeatherData.hourly.map((timeslot,index) => (
              <WeatherSnippet key={index} data={{period:(new Date(timeslot.date).toLocaleString('en-US', {hour:'2-digit', hour12: timeFormat, timeZone:WeatherData.timezone})), high:timeslot.temperature.value, low:"None", precipitation:timeslot.precipitationProbability, icon:"/icons/"+timeslot.iconCode+".svg"}}/>
          ))}
        </div>
      )
    case "Conditions":
      return (
        <div>
          <p className='text-lg font-med'>Typical Conditions in {WeatherData.location} at this time of year:</p>
          <p className='text-xs font-extralight'>Conditions taken on 30-year rolling average</p>
          <p className='text-md font-med'>Historical average temperature: {WeatherData.typical && WeatherData.typical.temperature.average.value} °{WeatherData.typical && WeatherData.typical.temperature.average.unit}</p>
          <p className='text-md font-med'>Historical maximum temperature: {WeatherData.typical && WeatherData.typical.temperature.maximum.value} °{WeatherData.typical && WeatherData.typical.temperature.maximum.unit}</p>
          <p className='text-md font-med'>Historical minimum temperature: {WeatherData.typical && WeatherData.typical.temperature.minimum.value} °{WeatherData.typical && WeatherData.typical.temperature.minimum.unit}</p>
          <p className='text-md font-med'>Historical average precipitation: {WeatherData.typical && WeatherData.typical.precipitation.value} {WeatherData.typical && WeatherData.typical.precipitation.unit}</p>

        </div>
      )
    case "Advisories":  
    return (
      <div>
        {
          (WeatherData.advisories && (WeatherData.advisories.length) === 0) ? 
          (<p>No advisories are currently in effect for {WeatherData.location}</p>):
          <div className='w-5/6 h-5/6 overflow-auto'>
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
          <p>Invallid List Item</p>
        </div>
      )

  }
};

export default WeatherItem;


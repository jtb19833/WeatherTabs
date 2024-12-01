"use client";

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import WeatherItem from '../components/WeatherItem';
import axios from 'axios';
import { useParams, redirect } from "next/navigation";

function Home() {

  const [weatherData,setWeatherData] = useState([]);
  const [sorted,sortTabs] = useState([])
  const [tabs,setTabs] = useState({content:[]})
  const { id: token } = useParams();
  console.log(token)
  const [preferences,setPreferences] = useState({units:"imperial", timeFormat:"12h"})

  const getTabs = async () => {
    console.log(token)
    try{
      const tabResponse = await axios.get('http://localhost:3001/api/tabs',{ withCredentials: true })
      setPreferences((await axios.get('http://localhost:3001/api/prefs', { withCredentials: true })).data.prefs)
      console.log(preferences)
      console.log("Successfully retrieved user tabs")
      setTabs({ content: tabResponse.data.tabs });
      if(tabs.content === undefined) {
        setTabs({ content: [] });
      }
      setWeatherData(tabs.content)
      console.log(tabs)
    } catch (error) {
      console.log("Error retrieving tabs ("+error+")")
      setTabs({ content: [] });
      setWeatherData(tabs.content)
      console.log(tabs)
    }
  }

  const handleDelete = async (position) => {
    console.log("Deleting tab with position:", position);
    try {
      const response = await axios.delete('http://localhost:3001/api/delete_tab', {
        data: {
          token: token,
          position: position, // Send position for the tab to be deleted
        },
      });
      console.log('Tab deleted successfully', response.data);
      // Update state after deletion
      setTabs(prevTabs => ({
        content: prevTabs.content.filter(tab => tab.position !== position)
      }));
      window.location.reload();
    } catch (error) {
      console.error('Error deleting tab:', error);
    }
  };

  useEffect(() => {
    getTabs();
  }, [token]); 

  useEffect(() => {
    console.log("Loading tabs")
    console.log(tabs.content)
    setWeatherData(tabs.content);
  }, [tabs.content,tabs]);

  useEffect(() => {
    sortTabs(weatherData.sort((a,b) => a.position - b.position))
  },[weatherData])

  const addCity = () => {
    redirect("/"+token+"/addtab", "replace")
  }

  const [isEdit, toggleEdit] = useState(false)

  const changeeEdit = () => {
    toggleEdit(!isEdit)

  }

  const uploadTabs = async (tabs) => {
    const response = await axios.patch('http://localhost:3001/api/add_tab',{token, tabs}).message
    console.log(response)
    
  }

  const moveTab = async (position, direction) => {
    console.log("MoveTab:")
    let tempTabs = tabs.content.slice()
    console.log(tempTabs)
    console.log("position: " + position)
    let tab1 = tempTabs[position]
    let tab2 = tempTabs[position - direction]
    try {
      if(tab1 === undefined || tab2 === undefined) {
        throw new Error("Tab out of bounds!")
      }
    } catch (error) {
      alert("Invalid movement direction!")
      return 0
    }
    let oldPos = tab1.position
    tempTabs[position].position = tempTabs[position-direction].position
    tempTabs[position-direction].position = oldPos
    console.log(tempTabs)
    setTabs({content:tempTabs})
    console.log("to database")
    await uploadTabs(tabs.content);
    await getTabs();
    window.location.reload()
  }

  return (
    <div className='flex flex-col items-center bg-sky-200 min-h-screen min-w-screen pb-10'>
      <Header isLoggedIn={true} toggleEdit={changeeEdit} />
      <div className="min-h-[50px]"></div>
      <div className="flex flex-col p-8 w-full max-w-[1200px]">
        {console.log("sorted tabs:")}
        {console.log(sorted)}
        {sorted.map((item, index) => (
          <div key={index} className='w-full flex flex-row gap-2'>
            <WeatherItem key={index} data={{ preferences:preferences, location: item }} />
            {console.log("Tab " + index + ": " + item.lat + ", " +item.long)}
            {isEdit?<div className='flex flex-col justify-center gap-5'>
              <button
                className="font-normal w-10 h-10 text-center text-lg bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
                onClick={() => moveTab(item.position, 1)}
              >     
                ⇑
              </button>
              <button
                className="font-bold w-10 h-10 text-center text-lg bg-red-600 text-white py-2 px-4 rounded-lg mt-4"
                onClick={() => handleDelete(item.position)}
              >
                X
              </button>
              <button
                className="font-normal w-10 h-10 text-center text-lg bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
                onClick={() => moveTab(item.position, -1)}
              >
                ⇓
              </button>
            </div>:<div></div>}
          </div>
        ))}
      </div>
      <div className="px-8 w-full max-w-[1200px]">
        <button
          className="font-bold text-7xl bg-inherit border-dashed border-[7px] border-indigo-300 text-white w-full max-w-[1200px] h-[300px] rounded-2xl"
          onClick={addCity}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Home;

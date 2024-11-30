"use client";

import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import axios from "axios";

export default function Home () {
    const { id: token } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here

    const [time24,setTimeFormat] = useState(false)
    const [metric,setMeasurement] = useState(false)
    const deleteAccount= async () => {
        const response = confirm("Really Delete?")
        if(response) {
            try {
            const response = await axios.delete("", {useCredentials:true})
            alert("Account successfully deleted.")
            redirect("/", "replace")
        } catch (exception) {
            alert("Error deleting account (" + exception + ")")
        }
        }

    }

    const cancel = () => {
        redirect('/'+token, "replace")
    }

    const [prefs,setPrefs] = useState({units:"imperial",timeFormat:"12h"})
    const [externalPrefs,setExternalPrefs] = useState({units:"imperial",timeFormat:"12h"})

    useEffect( () => {
        const getPrefs = async () => {
            let prefsResponse = await axios.get('http://localhost:3001/api/prefs', {withCredentials: true})
            setTimeFormat(prefsResponse.data.prefs.timeFormat==="24h")
            setMeasurement(prefsResponse.data.prefs.timeFormat==="metric")
            setExternalPrefs(prefsResponse.data.prefs)
        }
        getPrefs()
        console.log(externalPrefs)
        let units = externalPrefs.units
        let timeFormat = externalPrefs.timeFormat
        if (units === undefined)
            units = "imperial"
            setMeasurement(false)
        if (timeFormat === undefined)
            timeFormat= "12h"
            setTimeFormat(false)
        setPrefs({units:units, timeFormat:timeFormat})
        console.log(prefs)
    },[])

    useEffect(() => {
        setMeasurement(externalPrefs.units==="metric")
        setTimeFormat(externalPrefs.timeFormat==="24h")
    }, [externalPrefs]) 

    const toggleMeasurement = () => {
        setMeasurement(!metric)
    }

    const toggleTime = () => {
        setTimeFormat(!time24)
    }

    useEffect(() => {
        console.log(prefs)
    },[prefs])
    
    useEffect(() => {
        console.log(time24)
        let prefstimeFormat = (time24?"24h":"12h")
        let prefsunits = (metric?"metric":"imperial")
        setPrefs({units:prefsunits, timeFormat:prefstimeFormat})
    },[time24])
    
    useEffect(() => {
        console.log(metric)
        let prefstimeFormat = (time24?"24h":"12h")
        let prefsunits = (metric?"metric":"imperial")
        setPrefs({units:prefsunits, timeFormat:prefstimeFormat})
    },[metric])
    
    const submitPrefs = async () => {
        console.log(prefs)
        const response = axios.patch('http://localhost:3001/api/save_prefs',{token, prefs});
        console.log(response)
        redirect("/"+token,"replace")
    }

    return (
        <div className="flex flex-col items-center bg-sky-200 min-h-screen min-w-screen">  
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <div className="min-h-[50px]"></div>
            <div className="flex flex-col items-center self-center p-10 m-10 w-full max-w-[1200px] bg-indigo-300 rounded-3xl gap-5">
                <p className="text-white font-bold text-2xl">User Preferences</p>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <p className="text-white font-bold text-xl w-1/6 text-end">Units:</p>
                    <div className="flex flex-row w-1/6 justify-center">
                        <label className="inline-flex content-center cursor-pointer">
                            <span className="me-3 text-m font-medium text-gray-900 dark:text-white">Imperial</span>
                            <input type="checkbox" value="" onChange={toggleMeasurement} checked={metric} className="sr-only peer"/>
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-m font-medium text-gray-900 dark:text-white">Metric</span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <p className="text-white font-bold text-xl w-1/6 text-end">Time Format:</p>
                    <div className="flex flex-row w-1/6 justify-center">
                        <label className="inline-flex items-center cursor-pointer">
                            <span className="me-3 text-m font-medium text-gray-900 dark:text-white">12h</span>
                            <input type="checkbox" value="" onChange={toggleTime} checked={time24} className="sr-only peer"/>
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-m font-medium text-gray-900 dark:text-white">24h</span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <button className="text-white font-bold text-white w-1/6 text-center py-1 px-2 bg-blue-600 rounded-xl" onClick={submitPrefs}>Save</button>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <button className="text-white font-bold text-white w-1/6 text-center py-1 px-2 bg-gray-400 rounded-xl" onClick={cancel}>Go Back</button>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <button className="font-bold text-red-400 w-1/6 text-center py-1 px-2 border-solid border-[3px] border-red-400 rounded-xl bg-inherit hover:text-white hover:bg-red-400" onClick={deleteAccount}>DELETE ACCOUNT</button>
                </div>
            </div>
        </div>
    )
}
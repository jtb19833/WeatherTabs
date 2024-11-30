"use client";

import Header from "../../components/Header";
import React, { useState } from "react";
import TabAdder from "../../components/TabAdder";
import { redirect, useParams } from "next/navigation";
import axios from "axios";
import { report } from "process";

export default function Home () {
    const { id: token } = useParams();

    const [reportTitle,setTitle] = useState("")
    const [reportBody,setBody] = useState("")

    async function sendReport() {
        let reportSuccess = true;
        try {
            response = await axios.post("http://localhost:3001/send-report", {reportTitle, reportBody})
            alert("Report sent! Redirecting...")
        } catch (error) {
            reportSuccess = false;
            alert("Error sending report. Please check your connection and try again.")
        }
        if (reportSuccess) {
            redirect('/'+token, "replace")
        }
    }

    const cancel = () => {
        redirect('/'+token, "replace")
    }

    const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
    return (
        <div className="flex flex-col items-center bg-sky-200 min-h-screen min-w-screen">  
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <div className="min-h-[50px]"></div>
            <div className="flex flex-col items-center self-center p-10 m-10 w-full max-w-[1200px] bg-indigo-300 rounded-3xl gap-5">
                <p className="text-white font-bold text-2xl">Report an Issue</p>
                <div className="glex flex-col items-start justfy-start text-white w-full h-full p-6 gap-2">
                    <div className="flex flex-col gap-3">
                        <p className="text-lg font-semibold">Issue Title</p>
                        <input type="text" className="w-1/3"></input>
                    </div>
                    <div className="flex flex-col gap-3 pt-5">
                        <p className="text-lg font-semibold">Issue Content</p>
                        <textarea className="w-2/3 h-3/5"></textarea>
                    </div>
                    <div className="flex flex-row w-full justify-start pt-10 gap-10">
                        <button className="text-white font-bold text-white w-1/6 text-center py-1 px-2 bg-blue-600 rounded-xl" onClick={sendReport}>Submit Issue</button>
                        <button className="text-white font-bold text-white w-1/6 text-center py-1 px-2 bg-gray-400 rounded-xl" onClick={cancel}>Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


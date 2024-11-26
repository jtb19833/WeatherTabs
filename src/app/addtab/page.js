"use client";

import Header from "../components/Header";
import React, { useState } from "react";
import TabAdder from "../components/TabAdder";

export default function Home () {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
    return (
        <div className="flex flex-col items-center bg-sky-200 min-h-screen min-w-screen">  
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <div className="min-h-[50px]"></div>
            <TabAdder/>
        </div>
    )
}


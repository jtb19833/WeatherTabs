"use client";

import Header from "../components/Header";
import React, { useState } from "react";
import TabAdder from "../components/TabAdder";

export default function Home () {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
    return (
        <div className="pageContent">  
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <TabAdder/>
        </div>
    )
}
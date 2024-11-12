"use client";

import Header from "../components/Header";
import React, { useState } from "react";
import Login from "../components/Login";

export default function Home () {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state here
    return (
        <div className="pageContent">  
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Login loginSetter={setIsLoggedIn}/>
        </div>
    )
}
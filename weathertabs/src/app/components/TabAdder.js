'use client'
import { redirect } from "next/dist/server/api-utils"
import { useState } from "react"


export default function TabAdder () {

    const [location,setLocation] = useState('')

    const handlesubmit = () => {
        
    }
    const handleCancel = () => {
        redirect("/userpage","replace")
    }
    return (
        <div className="tabAdd">
            <h2>Add New Tab</h2>
            <form className="tabAddForm" onSubmit={handlesubmit}>
                <div className="SearchBar">
                    <input type="text" onChange={setLocation} value={location} placeholder={"Search Locations..."}></input>
                    <button type="submit" className="searchButtons">Submit</button>
                </div>
                <div className="MapandInfo">
                    <h1>Map Here...</h1>
                    <p>Location info here...</p>
                </div>
                <button className="searchButtons" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}
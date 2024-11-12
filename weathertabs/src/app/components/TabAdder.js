'use client'
import { redirect } from "next/dist/server/api-utils"
import { setGlobal } from "next/dist/trace"
import { useState } from "react"


export default function TabAdder () {

    const [location,setLocation] = useState('')

    const handlesubmit = () => {
        setLocation("")
        console.log(location)
        redirect("/userpage","replace")
    }
    const handleCancel = () => {
        redirect("/userpage","replace")
    }
    return (
        <div className="tabAdd">
            <h2>Add New Tab</h2>
            <form className="tabAddForm" onSubmit={handlesubmit}>
                <div className="searchBar">
                    <input type="text" className= "searchText" onChange={(e) => setLocation(e.target.value)} value={location} placeholder={"Search Locations..."}></input>
                    <button type="submit" className="searchButtons">Submit</button>
                </div>
                <div className="MapandInfo">
                    <label className="MapText">Map Here...</label>
                    <label className="DescriptorText">Location info here...</label>
                </div>
                <button className="searchButtons" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}
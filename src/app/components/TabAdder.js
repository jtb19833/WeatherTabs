'use client'
import { redirect } from "next/navigation";
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
        <div className="flex flex-col items-center self-center p-10 m-10 w-full max-w-[1200px] bg-indigo-300 rounded-3xl gap-5">
            <h2 className="text-3xl font-bold text-white">Add New Tab</h2>
            <form className="flex flex-col bg-inherit items-center justify-space-between self-center w-fill" onSubmit={handlesubmit}>
                <div className="flex flex-row bg-inherit text-white justify-space-between items-center self-center min-w-500 min-h-fit">
                    <input type="text" className= "font-medium text-lg bg-white text-black min-w-[500px] py-2 px-1 rounded-lg" onChange={(e) => setLocation(e.target.value)} value={location} placeholder={"Search Locations..."}></input>
                    <button type="submit" className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg">Submit</button>
                </div>
                <div className="flex flex-row m-20 bg-inherit text-white justify-space-between items-center self-center min-w-fit min-h-fit gap-20">
                    <label className="text-xl font-bold">Map Here...</label>
                    <label className="text-lg font-normal">Location info here...</label>
                </div>
                <button className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg me-5" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}


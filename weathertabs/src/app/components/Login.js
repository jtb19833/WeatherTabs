'use client'
import { redirect } from "next/navigation";
import { useState } from "react";
export default function Login (loginsetter) {
    
    const loginform = () => {
        redirect("/userpage", "replace")
    }
    const cancelform = () => {
        redirect("/", "replace");
    }
    const handlesubmit = (event) => {
        event.preventDefault()
        if (!(username === '' || password === '')) {
            console.log(username)
            console.log(password)
            setUser("")
            setPass("")
            loginform()
        }
    }

    const [username, setUser] = useState("")
    const [password, setPass] = useState("")
    return(
        <div className="mt-10 flex flex-col items-center max-w-[1200px] w-full bg-indigo-300 rounded-3xl p-5 h-fit">
            <h2 className="font-bold text-2xl text-white py-2">Sign In</h2>
            <form className="flex flex-col self-center items-center gap-3" onSubmit={handlesubmit}>
                <input type="text" className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md" onChange={(e) => setUser(e.target.value)} value={username} placeholder={"Username..."}></input>
                <input type="text" className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md" onChange={(e) => setPass(e.target.value)} value={password} placeholder={"Password..."}></input>
                <button type="submit" className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg ">Submit</button>
                <button onClick={cancelform} className="font-bold text-lg bg-gray-600 text-white py-2 px-4 rounded-lg">Cancel</button>
            </form>
        </div>
    )
}
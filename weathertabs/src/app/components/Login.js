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
        <div className="login">
            <h2>Sign In</h2>
            <form className="loginform" onSubmit={handlesubmit}>
                <input type="text" onChange={(e) => setUser(e.target.value)} value={username} placeholder={"Username..."}></input>

                <input type="text" onChange={(e) => setPass(e.target.value)} value={password} placeholder={"Password..."}></input>
                <button type="submit" className="loginButtons">Submit</button>
                <button onClick={cancelform} className="loginButtons">Cancel</button>
            </form>
        </div>
    )
}
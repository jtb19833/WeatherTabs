'use client'
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const router = useRouter();
    const [username, setUser] = useState('');
    const [password, setPass] = useState('');
    
    useEffect(() => {
      const checkAuthStatus = async () => {
          try {
              const response = await axios.get('http://localhost:3001/api/auth/status', { withCredentials: true });
              console.log("Auth status:", response.data); // Debugging log
              if (response.data.isAuthenticated) {
                  router.push('/userpage'); // Redirect to userpage if authenticated
              }
          } catch (error) {
              console.error('Error checking authentication status:', error);
          }
      };
      checkAuthStatus();
  }, [router]);
  
  
  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:3001/login', { username, password }, { withCredentials: true });
        
        console.log("Login response:", response); // Log the full response
        
        // Redirect to userpage on successful login
        if (response.status === 200) {
            router.push('/userpage');
        }
    } catch (error) {
        console.log("Login error response:", error.response); // Debugging log for full error response
        if (error.response) {
            if (error.response.status === 404) {
                window.alert('User or Password Is Incorrect');
            } else if (error.response.status === 401) {
                window.alert('Incorrect password');
            } else {
                window.alert('An error occurred. Please try again.');
            }
        } else {
            window.alert('Server is unreachable. Please check your connection.');
        }
    }
  };
    return(
        <div className="min-h-screen flex items-center justify-center bg-sky-200">

            <div className="mt-10 flex flex-col items-center max-w-[500px] w-full bg-indigo-300 rounded-3xl p-5 h-fit">
                <h2 className="font-bold text-2xl text-white py-2">Login</h2>
                <input
                type="text"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md"
                onChange={(e) => setUser(e.target.value)}
                value={username}
                placeholder={"Username..."}
            />
            <input
                type="password"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setPass(e.target.value)}
                value={password}
                placeholder={"Password..."}
            />
            <div className="flex space-x-4 mt-4">

            <button
                onClick={handleLogin}
                className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
            >
                Login
            </button> 
            <button
                onClick={() => router.push('../signup')}Sign Up
                className="font-bold text-lg bg-green-600 text-white py-2 px-4 rounded-lg mt-4"
                    >
                        Sign Up
                    </button>
                    </div>
                    <button className="pt-4 hover:underline" onClick={() => router.push('../forgot')}>Forgot Password?</button>
            
            </div>
        </div>

    )
}

export default Home;
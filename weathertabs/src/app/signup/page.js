'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Signup = () => {
  const [username, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      window.alert('All fields are required.');
      return;
    }
    if (password.length < 6) {
      window.alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/signup', {
        username,
        email,
        password
      });

      if (response.status === 201) {
        // Redirect to login page after successful registration
        
        router.push('/login');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Display a window popup alert if an error occurs
        window.alert(error.response.data.message);
      } else {
        window.alert('An error occurred. Please try again.');
      }
    }
  };

  return(
    <div className="min-h-screen flex items-center justify-center bg-indigo-500">

            <div className="mt-10 flex flex-col items-center max-w-[500px] w-full bg-indigo-300 rounded-3xl p-5 h-fit">
                <h2 className="font-bold text-2xl text-white py-2">Sign Up</h2>
                <input
                type="text"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md"
                onChange={(e) => setUser(e.target.value)}
                value={username}
                placeholder={"Username..."}
            />
            <input
                type="email"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder={"Email..."}
            />
            <input
                type="text"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setPass(e.target.value)}
                value={password}
                placeholder={"Password..."}
            />
            <div className="flex space-x-4 mt-4">

            <button
                onClick={handleRegister}
                className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
            >
                Sign Up
            </button> </div><button className="pt-2 hover:underline" onClick={() => router.push('../login')}>Have an account?</button>
            <button className="pt-2 hover:underline" onClick={() => router.push('../forgot')}>Forgot Password?</button>
            
            </div>
        </div>
)
}

export default Signup;
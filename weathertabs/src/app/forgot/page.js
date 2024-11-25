'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Forgot = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleForgot = async () => {
    try {
      await axios.post('http://localhost:3001/forgot', { email });
      window.alert('If the email exists, a password reset link has been sent.');
    } catch (error) {
      window.alert('If the email exists, a password reset link has been sent.');
    }
  };
  return(
    <div className="min-h-screen flex items-center justify-center bg-sky-200">

    <div className="mt-10 flex flex-col items-center max-w-[500px] w-full bg-indigo-300 rounded-3xl p-5 h-fit">
                <h2 className="font-bold text-2xl text-white py-2">Forgot Password?</h2>
            <input
                type="email"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-2 px-2 rounded-md"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder={"Email..."}
            />
            <div className="flex space-x-4 mt-4">

            <button
                onClick={handleForgot}
                className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
            >
                Send new password
            </button> 
            </div>
              <button className="pt-4 hover:underline" onClick={() => router.push('../login')}>Cancel</button>            
            </div>
            </div>
)
}

export default Forgot;

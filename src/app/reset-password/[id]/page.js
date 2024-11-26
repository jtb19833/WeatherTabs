'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const ResetPassword = () => {
  const { id: token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    console.log('Token:', token);
  
    if (!token) {
      window.alert('Invalid reset link.');
      return;
    }
  
    if (password.length < 6) {
      window.alert('Password must be at least 6 characters long!');
      return;
    }
  
    if (password !== confirmPassword) {
      window.alert('Passwords do not match!');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/reset-password', {
        token,
        newPassword: password,
      });
  
      if (response.status === 200) {
        window.alert('Password successfully reset. You can now log in.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Reset Password Error:', error.response?.data || error.message);
      window.alert(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };
  return(
    <div className="min-h-screen flex items-center justify-center bg-sky-200">

            <div className="mt-10 flex flex-col items-center max-w-[500px] w-full bg-indigo-300 rounded-3xl p-5 h-fit">
                <h2 className="font-bold text-2xl text-white py-2">New Password</h2>
            <input
                type="password"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder={"New Password..."}
            />
            <input
                type="password"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder={"Password..."}
            />
            <div className="flex space-x-4 mt-4">

            <button
                onClick={handleResetPassword}
                className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
            >
                Sumbit
            </button> </div>
            
            </div>
        </div>
)
}

  
export default ResetPassword;

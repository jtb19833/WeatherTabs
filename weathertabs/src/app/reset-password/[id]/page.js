'use client';

import './page.css';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const ResetPassword = () => {
  const { id: token } = useParams(); // Get the token from the dynamic route parameter
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
    <div className="mt-10 flex flex-col items-center max-w-[1200px] w-full bg-sky-200 rounded-3xl p-5 h-fit">
        <h2 className="font-bold text-2xl text-white py-2">New Password</h2>
          <input type="text" className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md" onChange={(e) => setPassword(e.target.value)} value={password} placeholder={"New Password..."}></input>
          <input type="text" className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder={"Confirm Password..."}></input>
          <button onClick={handleResetPassword} className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg ">Submit</button>
    </div>
)
}

  
export default ResetPassword;

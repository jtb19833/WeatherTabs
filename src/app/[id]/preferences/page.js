"use client";

import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function Home () {
    const { id: token } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state here
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [image, setImage] = useState(null);
    const [displayUsername, setDisplayUsername] = useState('First Last Name');
    const [displayEmail, setDisplayEmail] = useState('asdf@email.com');
    const [displayImage, setDisplayImage] = useState('https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png');

    const router = useRouter();

    const [time24,setTimeFormat] = useState(false)
    const [metric,setMeasurement] = useState(false)
    const deleteAccount= async () => {
        const response = confirm("Really Delete?")
        if(response) {
            try {
            const response = await axios.delete("", {useCredentials:true})
            alert("Account successfully deleted.")
            redirect("/", "replace")
        } catch (exception) {
            alert("Error deleting account (" + exception + ")")
        }
        }

    }

    const cancel = () => {
        redirect('/'+token, "replace")
    }

    const [prefs,setPrefs] = useState({units:"imperial",timeFormat:"12h"})
    const [externalPrefs,setExternalPrefs] = useState({units:"imperial",timeFormat:"12h"})

    useEffect( () => {
        const getPrefs = async () => {
            let prefsResponse = await axios.get('http://localhost:3001/api/prefs', {withCredentials: true})
            setTimeFormat(prefsResponse.data.prefs.timeFormat==="24h")
            setMeasurement(prefsResponse.data.prefs.timeFormat==="metric")
            setExternalPrefs(prefsResponse.data.prefs)
        }
        getPrefs()
        console.log(externalPrefs)
        let units = externalPrefs.units
        let timeFormat = externalPrefs.timeFormat
        if (units === undefined)
            units = "imperial"
            setMeasurement(false)
        if (timeFormat === undefined)
            timeFormat= "12h"
            setTimeFormat(false)
        setPrefs({units:units, timeFormat:timeFormat})
        console.log(prefs)
    },[])

    useEffect(() => {
        setMeasurement(externalPrefs.units==="metric")
        setTimeFormat(externalPrefs.timeFormat==="24h")
    }, [externalPrefs]) 

    const toggleMeasurement = () => {
        setMeasurement(!metric)
    }

    const toggleTime = () => {
        setTimeFormat(!time24)
    }

    useEffect(() => {
        console.log(prefs)
    },[prefs])
    
    useEffect(() => {
        console.log(time24)
        let prefstimeFormat = (time24?"24h":"12h")
        let prefsunits = (metric?"metric":"imperial")
        setPrefs({units:prefsunits, timeFormat:prefstimeFormat})
    },[time24])
    
    useEffect(() => {
        console.log(metric)
        let prefstimeFormat = (time24?"24h":"12h")
        let prefsunits = (metric?"metric":"imperial")
        setPrefs({units:prefsunits, timeFormat:prefstimeFormat})
    },[metric])
    
    const submitPrefs = async () => {
        console.log(prefs)
        const response = axios.patch('http://localhost:3001/api/save_prefs',{token, prefs});
        console.log(response)
        redirect("/"+token,"replace")
    }

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/user', {
                withCredentials: true
            });

            if (response.data) {
                setUserId(response.data.userId);
                setDisplayUsername(response.data.username);
                setDisplayEmail(response.data.email);
                if (response.data.imagePath) {
                    setDisplayImage(`http://localhost:3001/${response.data.imagePath.replace(/\\/g, '/')}`);
                }
            } else {
                console.error("User data is incomplete:", response.data);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleProfileUpdate = async () => {
        // Validate passwords
        if (!oldPassword && newPassword && confirmNewPassword) {
            window.alert('Old Password input cannot be empty.');
            return;
        }
    
        if (oldPassword && !newPassword && confirmNewPassword) {
            window.alert('New Password input cannot be empty.');
            return;
        }
    
        if (oldPassword && newPassword && !confirmNewPassword) {
            window.alert('Confirm Password input cannot be empty.');
            return;
        }

        if (!oldPassword && !newPassword && confirmNewPassword) {
            window.alert('Old Password and New Password cannot be empty');
            return;
        }

        if (oldPassword && !newPassword && !confirmNewPassword) {
            window.alert('New Password and Confirm Password input cannot be empty.');
            return;
        }

        if (!oldPassword && newPassword && !confirmNewPassword) {
            window.alert('Old Password and Corfirm New Password input cannot be empty.');
            return;
        }

        if (!oldPassword && !newPassword && !confirmNewPassword) {

        }
        
        if (oldPassword && newPassword && confirmNewPassword && newPassword.length < 6) {
            window.alert('New password must be at least 6 characters long.');
            return;
        }

    
    
        if (newPassword !== confirmNewPassword) {
            window.alert('New password and confirm password do not match.');
            return;
        }


    
        try {
            // Validate old password
            const validateResponse = await axios.post(
                'http://localhost:3001/api/validate-password',
                { oldPassword },
                { withCredentials: true }
            );
            if (oldPassword) {
                if (!validateResponse.data.isValid) {
                    window.alert('Old password is incorrect.');
                    return;
                }
            }
            
    
            // Proceed with profile update
            const formData = new FormData();
            if (username) formData.append('username', username);
            if (newPassword) formData.append('password', newPassword);
            if (image) formData.append('image', image);
    
            const response = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
    
            console.log('Profile updated:', response.data);
    
            if (response.data.data.imagePath) {
                setDisplayImage(`http://localhost:3001/${response.data.data.imagePath}`);
            }
    
            await fetchUser();
            router.push('../'+token);
        } catch (error) {
            
        
            // Display error message
            if (error.response && error.response.data.message) {
                window.alert(error.response.data.message);
            } else {
                window.alert('An unexpected error occurred.');
            }
        }
        
    };

    return (
        <div className="flex flex-col items-center bg-sky-200 min-h-screen min-w-screen">  
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <div className="min-h-[50px]"></div>
            <div className="flex flex-col items-center self-center p-10 m-10 w-full max-w-[1200px] bg-indigo-300 rounded-3xl gap-5">
                <p className="text-white font-bold text-2xl">User Preferences</p>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <p className="text-white font-bold text-xl w-1/6 text-end">Units:</p>
                    <div className="flex flex-row w-1/6 justify-center">
                        <label className="inline-flex content-center cursor-pointer">
                            <span className="me-3 text-m font-medium text-gray-900 dark:text-white">Imperial</span>
                            <input type="checkbox" value="" onChange={toggleMeasurement} checked={metric} className="sr-only peer"/>
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-m font-medium text-gray-900 dark:text-white">Metric</span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <p className="text-white font-bold text-xl w-1/6 text-end">Time Format:</p>
                    <div className="flex flex-row w-1/6 justify-center">
                        <label className="inline-flex items-center cursor-pointer">
                            <span className="me-3 text-m font-medium text-gray-900 dark:text-white">12h</span>
                            <input type="checkbox" value="" onChange={toggleTime} checked={time24} className="sr-only peer"/>
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-m font-medium text-gray-900 dark:text-white">24h</span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <button className="text-white font-bold text-white w-1/6 text-center py-1 px-2 bg-blue-600 rounded-xl" onClick={submitPrefs}>Save</button>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <button className="text-white font-bold text-white w-1/6 text-center py-1 px-2 bg-gray-400 rounded-xl" onClick={cancel}>Go Back</button>
                </div>
                <div className="flex flex-row w-full items-center justify-start gap-20">
                    <button className="font-bold text-red-400 w-1/6 text-center py-1 px-2 border-solid border-[3px] border-red-400 rounded-xl bg-inherit hover:text-white hover:bg-red-400" onClick={deleteAccount}>DELETE ACCOUNT</button>
                </div>
            </div>
            <div className="mt-10 flex flex-col items-center max-w-[500px] w-full bg-indigo-300 rounded-3xl p-5 h-fit">
                <h2 className="font-bold text-2xl text-white py-2">Settings</h2>
                <input
                type="text"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder={"Change Username..."}
            />
            <input
                type="password"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
                placeholder={"Old Password..."}
            />
            <input
                type="password"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder={"New Password..."}
            />
            <input
                type="password"
                className="font-medium text-lg bg-white text-black min-w-[250px] py-1 px-1 rounded-md mt-4" 
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                value={confirmNewPassword}
                placeholder={"Confirm New Password..."}
            />
            <div
                            className="upload-container"
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) setImage(file);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            style={{
                                border: '2px dashed gray',
                                padding: '20px',
                                textAlign: 'center',
                                marginTop: '30px',
                                width: '400px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                height: '200px',
                            }}
                        >
                            {image ? (
                                <p>Image selected: {image.name}</p>
                            ) : (
                                <>
                                    <p>Drag and drop an image here, or click to upload your profile picture!</p>
                                    <input type="file" onChange={handleImageChange} style={{ marginTop: '10px' }} />
                                </>
                            )}
                        </div>
            <div className="flex space-x-4 mt-4">
            
            <button
                onClick={handleProfileUpdate}
                className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
            >
                Update Profile
            </button> </div>
            </div>
        </div>
    )
}
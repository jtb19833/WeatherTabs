'use client'
import { redirect } from "next/navigation";
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import axios from "axios";

export default function TabAdder (User) {

    const { id: token } = useParams();
    console.log(token)
    const [location,setLocation] = useState('')
    const [AzureLocations,setAzureLocations] = useState([])
    const [coords, setCoords] = useState([33.7501,-84.3885])
    let latitude = 0;
    let longitude = 0;
    
    const [imageLink,setImage] = useState("link/to/map.png")
    const [conditions,setConditions] = useState({})
    const api = "2lxAbxJh1Nveky6nMnuJUm56dHxY8e62p4fuPLkSJQ8W9n64qhdVJQQJ99AKACYeBjFZMj7nAAAgAZMP22WW"
    useEffect(() => {
        console.log(location)
        async function getAzureResponse() {
        let link = "https://atlas.microsoft.com/search/address/json?api-version=1.0&query="+location+"&language=en-US&subscription-key="+api
        let response = await fetch(
            link,{method:'GET'}
        )
        console.log(link)
        const locationList = await response.json()
        
        setAzureLocations(locationList.results)
        console.log(locationList.results)
        }
        if(!(location.trim()==="")){
            getAzureResponse()
        } else {
            setAzureLocations([])
        }
    },[location])

    useEffect(()=> {
        console.log(coords)
        setImage("https://atlas.microsoft.com/map/static/png?api-version=1.0&layer=basic&height=1080&width=1920&style=main&&zoom=9&center="+coords[1]+","+coords[0]+"&subscription-key=2lxAbxJh1Nveky6nMnuJUm56dHxY8e62p4fuPLkSJQ8W9n64qhdVJQQJ99AKACYeBjFZMj7nAAAgAZMP22WW")
        let today = new Date()
        async function getAzureResponse() {
            
            let link = "https://atlas.microsoft.com/reverseGeocode?api-version=2023-06-01&coordinates="+coords[1]+","+coords[0]+"&subscription-key="+api
            let response = await fetch(
                link,{method:'GET'}
            )
            console.log(link)
            const JSONresponse = await response.json()
            const locationData = JSONresponse.features[0]
            const city = locationData.properties.address.locality||""
            const state = locationData.properties.address.adminDistricts[0].name
            const country = locationData.properties.address.countryRegion.name
            const locale = city + (city===""?"":", ") + state + ", " + country
            
            link = "https://atlas.microsoft.com/weather/historical/normals/daily/json?api-version=1.1&query="+coords[0]+","+coords[1]+"&unit="+"imperial"+"&startDate="+(today.getFullYear())+"-"+(today.getMonth())+"-"+(today.getDate())+"&endDate="+(today.getFullYear())+"-"+(today.getMonth())+"-"+(today.getDate())+"&subscription-key="+api
            response = await fetch(
                link,{method:'GET'}
            )
            console.log(link)
            const typicalconditions = await response.json()
            const weatherResponse = {
                conditions:typicalconditions,
                location:locale
            }
            setConditions(weatherResponse)
        }
        getAzureResponse()
    },[coords])

    const handlesubmit = async () => {
        setLocation("")
        let tabs = []
        try {
            console.log(token)
            tabs = await (await axios.get('http://localhost:3001/api/tabs',{ withCredentials: true })).data.tabs
            console.log("got here!!!!")
        } catch (error) {
            tabs = []
        }
        console.log(tabs)
        try {
        tabs.push({lat:coords[0],long:coords[1],position:tabs.length})
        } catch (error) {
            tabs = [{lat:coords[0],long:coords[1],position:tabs.length}]
        }
        console.log(tabs)
        const response = await axios.patch('http://localhost:3001/api/add_tab',{token, tabs}).message
        console.log(response)
        redirect("/userpage/"+token,"replace")
    }
    const handleCancel = () => {
        redirect("/userpage/"+token,"replace")
    }
    return (
        <div className="flex flex-col items-center self-center p-10 m-10 w-full max-w-[1200px] bg-indigo-300 rounded-3xl gap-5">
            <h2 className="text-3xl font-bold text-white">Add New Tab</h2>
            <div className="flex flex-col bg-inherit items-center justify-space-between self-center w-fill" >
                <input type="text" className= "font-medium text-lg bg-white text-black min-w-[500px] py-2 px-1 rounded-lg" onChange={(e) => setLocation(e.target.value)} value={location} placeholder={"Search Locations..."}></input>
                {AzureLocations.length >0 ?
                <div className="flex flex-col bg-white mt-11 w-[500px] max-h-[600px] overflow-y-scroll absolute self-center justify-start items-start text-lg decoration-1 rounded-xl">
                    {
                        AzureLocations.map((item, index) => (
                            <div key={index}>    
                                <button onClick= {() =>{setCoords([item.position.lat,item.position.lon])
                                    setLocation('')}} className="hover:bg-gray-200 px-5 py-2 w-[500px] text-start truncate h-full">{item.address.municipalitySubdivision||item.address.municipality || item.address.countrySecondarySubdivision}{item.address.municipalitySubdivision||item.address.municipality || item.address.countrySecondarySubdivision===''?", ":"" }{item.address.countrySubdivisionName || item.address.countrySubdivision || item.address.municipality}{item.address.countrySubdivisionName || item.address.countrySubdivision || item.address.municipality===' '?", ":"" }{item.address.country}</button>
                            </div>
                        ))
                    }
                </div>
                :
                <div></div>
                }    
                <div className="flex flex-row m-20 bg-inherit text-white justify-space-between items-center self-center min-w-full min-h-full gap-20">
                    <img src={imageLink} className="h-[350px] w-[500px] rounded-2xl" alt="Map"></img>
                    <div className="flex flex-col w-full h-full text-center">
                        <p className="text-xl font-bold">{conditions.location&&conditions.location}</p>
                        <br/>
                        <p>Typical Conditions (Past 30 Years)</p>
                        {console.log(conditions)}
                        <p>Historical High: {conditions.conditions&&conditions.conditions.results[0].temperature.maximum.value} °{conditions.conditions&&conditions.conditions.results[0].temperature.maximum.unit}</p>
                        <p>Historical Average: {conditions.conditions&&conditions.conditions.results[0].temperature.average.value} °{conditions.conditions&&conditions.conditions.results[0].temperature.average.unit}</p>
                        <p>Historical Low: {conditions.conditions&&conditions.conditions.results[0].temperature.minimum.value} °{conditions.conditions&&conditions.conditions.results[0].temperature.minimum.unit}</p>
                        <p>Historical Precipitation: {conditions.conditions&&conditions.conditions.results[0].precipitation.value} {conditions.conditions&&conditions.conditions.results[0].precipitation.unit}</p>
                    </div>
                </div>
                <div className="flex flex-row bg-inherit text-white justify-space-between items-center self-center min-w-500 min-h-fit gap-10">
                    <button type="submit" className="font-bold text-lg bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={handlesubmit}>Add Tab</button>
                    <button className="font-bold text-lg bg-gray-400 text-white py-2 px-4 rounded-lg me-5" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}


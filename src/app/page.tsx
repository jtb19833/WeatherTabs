'use client';
import Button from "./components/Button";
import HamburgerMenu from "./components/HamburgerMenu";
import MenuItem from "./components/MenuItem";
import Nav from "./components/Nav";


export default function Home() {
  let style = "block bg-indigo-400 text-white font-semibold rounded-md hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-300";
  let bStyle = "button" + style + "px-4 py-2";
  
  return(
    <div>
      <Nav/>
      <div className="h-20"></div>
      <p>Home</p>
    </div>
  )
}

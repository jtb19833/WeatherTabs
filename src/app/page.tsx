'use client';
import Button from "./components/Button";
import HamburgerMenu from "./components/HamburgerMenu";
import Nav from "./components/Nav";


export default function Home() {
  let style = "block bg-indigo-400 text-white font-semibold rounded-md hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-300";
  let bStyle = "button" + style + "px-4 py-2";
  let button1 = (<Button buttonStyle = {bStyle} buttonContent = "Button1!!!" onClick = {() => {console.log("Button1!!")}}/>)
  let button2 = (<Button buttonStyle = {bStyle} buttonContent = "Button2!!!" onClick = {() => {console.log("Button2!!")}}/>)

  return(
    <div>
      <Nav/>
      <HamburgerMenu components = {[button1, button2]} menuStyle={"inline-block bg-indigo-400 w-500 h-500 max-w-500"}/>
    </div>
  )
}

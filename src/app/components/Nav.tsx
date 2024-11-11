import { useState } from "react";
import ImageLink from "./ImageLink";
import Image from "next/image";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from "./Button";
import HamburgerMenu from "./HamburgerMenu";
const Nav = () => {
    let menuStyle = "flex block bg-transparent w-full justify-end visible"
    let [menuOpen,toggleMenu] = useState(false);
    const clickHandler = (event:React.TouchEvent) => {
        event.preventDefault()
        console.log("Menu Toggled!")
        menuStyle = "flex block bg-transparent w-full justify-end "
        menuStyle += menuOpen ? "in xvisible" : "visible"
        toggleMenu(!menuOpen)
    }
    let logoProps = {
      source: "/Images/Logo.png",
      linkTo: "/",
      altText: "Logo",
      ht: 64,
      wd: 247
    }

    let bContent =<Image src="/Images/UserIcon.png" alt="User" height={45} width={45}/>
    //bContent = <p className="text-white font-semibold text-xl">TB</p>
    return (
        <div className="absolute w-full">
            <div className="flex block bg-blue-500 h-[75px] w-full items-center justify-between ps-2 pe-4">
                <ImageLink className= "Inline-Block" data={logoProps}/>
                <Button buttonStyle= "block bg-indigo-400 h-[45px] w-[45px] rounded-full pointer-events-auto" onClick={() => clickHandler} buttonContent = {bContent}/>
            </div>
            <div className={menuStyle}>
                <HamburgerMenu components={[<Button buttonStyle= "block bg-indigo-400 h-[45px] w-[45px] rounded-full pointer-events-auto" onClick={clickHandler} buttonContent = {bContent}/>,<Button buttonStyle= "block bg-indigo-400 h-[45px] w-[45px] rounded-full pointer-events-auto" onClick={clickHandler} buttonContent = {bContent}/>,<Button buttonStyle= "block bg-indigo-400 h-[45px] w-[45px] rounded-full pointer-events-auto" onClick={clickHandler} buttonContent = {bContent}/>]} menuStyle={"bg-white"}></HamburgerMenu>    
            </div>
        </div>
    )
}

export default Nav
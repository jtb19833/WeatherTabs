import { useState } from "react";
import ImageLink from "./ImageLink";
import Image from "next/image";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from "./Button";
import HamburgerMenu from "./HamburgerMenu";
const Nav = () => {
    let menuStyle = "flex flex-col block bg-white py-1 px-3 gap-2 rounded-b-xl visible"
    let [menuOpen,toggleMenu] = useState(false);
    const clickHandler = () => {
        console.log("Menu Toggled!")
        menuStyle = "flex flex-col block bg-white "
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
                <Button buttonStyle= "block bg-indigo-400 h-[45px] w-[45px] rounded-full pointer-events-auto" onClick={clickHandler} buttonContent = {bContent}/>
            </div>
            <div className="flex flex-row block bg-transparent w-full justify-end visible">
                <div className={menuStyle}>
                    <p>Menu 1</p>
                    <p>Menu 2</p>
                    <HamburgerMenu components={[<p>Menu 3</p>,<p>Menu 4</p>]} menuStyle={"bg-white"}></HamburgerMenu>    
                </div>
            </div>
        </div>
    )
}

export default Nav
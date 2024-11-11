import ImageButton from "./ImageButton";
import ImageLink from "./ImageLink";
import Image from "next/image";
import Dropdown from 'react-bootstrap/Dropdown';

const Nav = () => {
    
    let logoProps = {
      source: "/Images/Logo.png",
      linkTo: "/",
      altText: "Logo",
      ht: 64,
      wd: 247
    }
    let userProps = {
        source: "/Images/UserIcon.png",
        clickHandler: (console.log("Hello!")),
        altText: "User",
        ht: 45,
        wd: 45  
    }

    return (
        <div className="flex bg-blue-500 h-250 w-full content-center justify-between ">
            <ImageLink className= "Inline-Block" data={logoProps}/>
            <div className = "flex inline content-center max-h-50 w-fit">
                <div className= "inline-block bg-indigo-400 max-h-50 w-50 rounded-full">
                    <Image src="/Images/UserIcon.png" alt= "User" height= {50} width= {50}/>
                </div>
                <ImageButton data={userProps}></ImageButton>
            </div>
        </div>
    )
}

export default Nav
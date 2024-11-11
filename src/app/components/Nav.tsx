import ImageButton from "./ImageButton";
import HamburgerMenu from "./HamburgerMenu";
import ImageLink from "./ImageLink";

const Nav = () => {
    
    let logoProps = {
      source: "/Images/Logo.png",
      linkTo: "/",
      altText: "Logo",
      ht: 128,
      wd: 495
    }
    let userProps = {
        source: "/Images/UserIcon.png",
        clickHandler: (console.log("Hello!")),
        altText: "User",
        ht: 75,
        wd: 75  
    }
    return (
        <div className="bg-blue-500 w-500 content-center justify-between">
            <ImageLink data={logoProps} className = "inline"/>
            <div className=" inline-block bg-indigo-400 h-100 w-100 rounded-full">
                <ImageButton data = {userProps}/>
            </div>
        </div>
    )
}

export default Nav
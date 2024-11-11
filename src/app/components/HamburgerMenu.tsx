'use client';

import MenuItem from "./MenuItem";

export default function HamburgerMenu (props:any) {
    return (
        <div className={props.menuStyle}>
            {props.components.map((listItem: any,index:number) => {
                {console.log(listItem)}
                <div key={index}>
                    <MenuItem component={listItem}/>
                    <p>PLEASE WORK!!!!!!!</p>
                    <hr className="my-1 bg-gray-200 border-0 dark:bg-gray-700"/>
                </div>
            })}
        </div>
    )
}
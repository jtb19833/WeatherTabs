'use client';

import MenuItem from "./MenuItem";

export default function HamburgerMenu (props:any) {
    return (props.components.map((listItem: any) => {
        <div className={props.menuStyle}>
            <MenuItem component={listItem}/>
            <p>PLEASE WORK!!!!!!!</p>
            <hr className="my-1 bg-gray-200 border-0 dark:bg-gray-700"/>
        </div>
    })
    )
}

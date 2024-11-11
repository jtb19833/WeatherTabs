'use client';

const HamburgerMenu = (props:any) => {
    return (
        <div className = {props.menuStyle}>
            {props.components.map((component:any) => {
                <div key={component.className}>
                    {component}
                    <hr/>
                </div>
            })}
        </div>
    )
}

export default HamburgerMenu
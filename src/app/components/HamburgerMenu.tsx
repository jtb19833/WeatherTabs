'use client';

import { Component } from "react";

export default function HamburgerMenu (props:any) {
    return props.components.map((component: any) => (
        {component}
    ))
}

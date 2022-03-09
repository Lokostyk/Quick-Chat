import "./sharedComponents.scss"
import React,{ useState,useEffect } from "react"

//Logo
export const Logo = () => {return <h1 className="logo"><img className="wing" src="/Images/wing.svg" />Quick Chat<img className="wing" src="/Images/wing.svg" /></h1>}

//Alert
export const Alert = ({data}:{data:string}) => {return <p className="simpleAlert">{data}</p>}

//Loader
export const Loader = ({transformValue = 1}:{transformValue?:number}) => <div className="lds-roller" style={{transform:`scale(${transformValue})`}}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

//Fullscreen Loader
export const FullscreenLoader = () => <div className="fullscreenLoader"><Loader transformValue={1.7}/><h2>Please wait...</h2></div>
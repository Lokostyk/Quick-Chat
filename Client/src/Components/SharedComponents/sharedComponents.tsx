import "./sharedComponents.scss"
import React,{ useState,useEffect } from "react"

//Logo
export const Logo = () =>{return <h1 className="logo"><img className="wing" src="/Images/wing.svg" />Quick Chat<img className="wing" src="/Images/wing.svg" /></h1>}

//Alert
export const Alert = ({data}:{data:string}) =>{return <p className="simpleAlert">{data}</p>}

//Loader
export const Loader = (()=><div className="lds-facebook"><div></div><div></div><div></div></div>)
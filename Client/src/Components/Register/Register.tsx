import "./register.scss"
import React, {useCallback ,useState,useEffect, HtmlHTMLAttributes} from "react"
import axios from "axios"
import {URL} from "../../databaseUrl"
import { Logo } from "../SharedComponents/sharedComponents"

type FormData = {
    [key:string]:string
}
export default function Register() {
    const InitialData = {userName:"",userSurname:"",email:"",passwordOne:"",passwordTwo:""}
    const [formData,setFormData] = useState<FormData>(InitialData)
    const [alert,setAlert] = useState("")

    console.log();

    const handleLogin = useCallback((e:React.FormEvent)=>{
        e.preventDefault()
        if(formData.passwordOne === formData.passwordTwo){
            const finalUserData = {userName:formData.userName,userSurname:formData.userSurname,
            email:formData.email,password:formData.passwordOne}

            axios
            .post(`${URL}/handleUser`,finalUserData)
            .then(()=>window.location.pathname = window.location.origin + "/login")
            .catch((err)=>console.log(err))
        }else{
            setAlert("Passwords must be the same!")
        }
    },[formData])
    const handleChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    },[formData])
    return (
        <section className="registerContainer">
            <div className="formContainer">
                <Logo />
                <form onSubmit={(e)=>handleLogin(e)}>
                    <p className="alert">{alert}</p>
                    <div>
                        <input type="text" placeholder="Name" value={formData.userName}
                        onChange={(e)=>handleChange(e)} name="userName" required/>
                        <input type="text" placeholder="Surname" value={formData.userSurname}
                        onChange={(e)=>handleChange(e)} name="userSurname" required/>
                    </div>
                    <input type="email" placeholder="E-mail" value={formData.email}
                    onChange={(e)=>handleChange(e)} name="email" required/>
                    <input type="password" placeholder="Password" value={formData.passwordOne}
                    onChange={(e)=>handleChange(e)} name="passwordOne" minLength={8} maxLength={20} required/>
                    <input type="password" placeholder="Repeat password" value={formData.passwordTwo}
                    onChange={(e)=>handleChange(e)} name="passwordTwo" minLength={8} maxLength={20} required/>
                    <input type="submit" value="Sign in"/>
                </form>
            </div>
        </section>
    )
}

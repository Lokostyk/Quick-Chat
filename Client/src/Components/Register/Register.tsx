import "./register.scss"
import React, {useCallback ,useState,useEffect} from "react"
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


    const handleLogin = useCallback((e:React.FormEvent)=>{
        e.preventDefault()
        if(formData.passwordOne === formData.passwordTwo){
            const finalUserData = {userName:formData.userName,userSurname:formData.userSurname,
            email:formData.email,password:formData.passwordOne}

            axios.post(`${URL}/handleUser`,finalUserData)
            setFormData(InitialData)
        }else{
            setAlert("Passwords must be the same!")
        }
    },[formData])
    return (
        <section className="registerContainer">
            <div className="formContainer">
                <Logo />
                <form onSubmit={(e)=>handleLogin(e)}>
                    <p className="alert">{alert}</p>
                    <div>
                        <input type="text" placeholder="Name" value={formData.userName}
                    onChange={(e)=>setFormData({...formData,userName:e.target.value})} required/>
                        <input type="text" placeholder="Surname" value={formData.userSurname}
                    onChange={(e)=>setFormData({...formData,userSurname:e.target.value})} required/>
                    </div>
                    <input type="email" placeholder="E-mail" value={formData.email}
                    onChange={(e)=>setFormData({...formData,email:e.target.value})} required/>
                    <input type="password" placeholder="Password" value={formData.passwordOne}
                    onChange={(e)=>setFormData({...formData,passwordOne:e.target.value})} minLength={8} maxLength={20} required/>
                    <input type="password" placeholder="Repeat password" value={formData.passwordTwo}
                    onChange={(e)=>setFormData({...formData,passwordTwo:e.target.value})} minLength={8} maxLength={20} required/>
                    <input type="submit" value="Sign in"/>
                </form>
            </div>
        </section>
    )
}

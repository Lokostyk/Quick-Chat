import "./register.scss"
import React, {useCallback ,useState} from "react"
import axios from "axios"
import {URL} from "../../databaseUrl"
import { Logo } from "../SharedComponents/sharedComponents"

type FormData = {
    [key:string]:string
}
export default function Register() {
    const InitialData = {name:"",surname:"",email:"",passwordOne:"",passwordTwo:""}
    const [formData,setFormData] = useState<FormData>(InitialData)
    const [alert,setAlert] = useState("")

    const handleLogin = useCallback((e:React.FormEvent)=>{
        e.preventDefault()
        if(formData.passwordOne === formData.passwordTwo){
            const finalUserData = {name:formData.name,surname:formData.surname,
            email:formData.email,password:formData.passwordOne}

            axios
            .post(`${URL}/handleUser`,finalUserData)
            .then((res)=>{
                if(res.data !== "Success"){
                    setAlert(res.data)
                }else {
                    window.location.pathname = "/login"
                }
            })
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
                    <p className="simpleAlert">{alert}</p>
                    <div>
                        <input type="text" placeholder="Name" value={formData.name}
                        onChange={handleChange} name="name" required/>
                        <input type="text" placeholder="Surname" value={formData.surname}
                        onChange={handleChange} name="surname" required/>
                    </div>
                    <input type="email" placeholder="E-mail" value={formData.email}
                    onChange={handleChange} name="email" required/>
                    <input type="password" placeholder="Password" value={formData.passwordOne}
                    onChange={handleChange} name="passwordOne" minLength={8} maxLength={20} required/>
                    <input type="password" placeholder="Repeat password" value={formData.passwordTwo}
                    onChange={handleChange} name="passwordTwo" minLength={8} maxLength={20} required/>
                    <input type="submit" value="Sign in"/>
                </form>
            </div>
        </section>
    )
}

import "./accountSettings.scss"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../App/hooks"
import {URL} from "../../databaseUrl"

interface formData {
    [key:string]:string
}
export default function AccountSettings({setAccountSettings}:{setAccountSettings:React.Dispatch<React.SetStateAction<boolean>>}) {
    const InitialData = {name:"",surname:"",email:""}
    const state = useAppSelector(state=>state.userSlice)
    const [formData,setFormData] = useState<formData>(InitialData)
    const [password,setPassword] = useState<formData>({passwordOne:"",passwordTwo:""})
    const [alert,setAlert] = useState("")

    useEffect(()=>{
        setFormData({name:state.name,surname:state.surname,email:state.email})
    },[])
    const submitDataChange = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(state.name === formData.name && state.surname === formData.surname && state.email === formData.email) return
        console.log("first");
        axios.patch(`${URL}/handleUser/updateUserData`,{...formData,_id:state._id})
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    return (
        <section className="accountSettingsContainer">
            <div className="accountSettings">
                <button className="closeSettings" onClick={()=>setAccountSettings(false)}><img src="/Images/delete.svg"/></button>
                <h1>Account Settings</h1>
                <p className="simpleAlert">{alert}</p>
                <form onSubmit={submitDataChange}>
                    <div>
                        <input type="text" placeholder="Name" value={formData.name}
                        onChange={handleChange} name="name" required/>
                        <input type="text" placeholder="Surname" value={formData.surname}
                        onChange={handleChange} name="surname" required/>
                    </div>
                    <input type="email" placeholder="E-mail" value={formData.email}
                    onChange={handleChange} name="email" required/>
                    <input type="submit" value="Save"/>
                </form>
                <form>
                    <input type="password" placeholder="Old Password" value={password.passwordOne}
                    onChange={handleChange} name="passwordOne" minLength={8} maxLength={20} required/>
                    <input type="password" placeholder="New Password" value={password.passwordTwo}
                    onChange={handleChange} name="passwordTwo" minLength={8} maxLength={20} required/>
                    <input type="submit" value="Change Password"/>
                </form>
            </div>
        </section>
    )
}

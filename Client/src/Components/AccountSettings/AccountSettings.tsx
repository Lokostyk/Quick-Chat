import "./accountSettings.scss"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAppSelector,useAppDispatch } from "../../App/hooks"
import {changeUserData} from "../../App/Reducers/userData"
import {URL} from "../../databaseUrl"

interface formData {
    [key:string]:string
}
export default function AccountSettings({setAccountSettings}:{setAccountSettings:React.Dispatch<React.SetStateAction<boolean>>}) {
    const InitialData = {name:"",surname:"",email:""}
    const state = useAppSelector(state=>state.userSlice)
    const dispatch = useAppDispatch()
    const [formData,setFormData] = useState<formData>(InitialData)
    const [password,setPassword] = useState<formData>({passwordOne:"",passwordTwo:""})
    const [alert,setAlert] = useState("")

    useEffect(()=>{
        setFormData({name:state.name,surname:state.surname,email:state.email})
    },[])
    const submitDataChange = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(state.name === formData.name && state.surname === formData.surname && state.email === formData.email) return
        axios.patch(`${URL}/handleUser/updateUserData`,{...formData,_id:state._id})
        dispatch(changeUserData({...state,...formData}))
    }
    const submitPasswordChange = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(password.passwordOne === state.password){
            axios.patch(`${URL}/handleUser/updateUserData`,{password:password.passwordOne,_id:state._id})
            dispatch(changeUserData({...state,password:password.passwordOne}))
            setPassword({passwordOne:"",passwordTwo:""})
        }else {
            setAlert("Wrong old password!")
        }
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPassword({...password,[e.target.name]:e.target.value})
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
                <form onSubmit={submitPasswordChange}>
                    <input type="password" placeholder="Old Password" value={password.passwordOne}
                    onChange={handlePasswordChange} name="passwordOne" minLength={8} maxLength={20} required/>
                    <input type="password" placeholder="New Password" value={password.passwordTwo}
                    onChange={handlePasswordChange} name="passwordTwo" minLength={8} maxLength={20} required/>
                    <input type="submit" value="Change Password"/>
                </form>
            </div>
        </section>
    )
}

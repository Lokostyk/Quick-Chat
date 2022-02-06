import "./accountSettings.scss"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAppSelector,useAppDispatch } from "../../App/hooks"
import {changeUserData} from "../../App/Reducers/userData"
import {URL} from "../../databaseUrl"

interface formData {
    name:string,
    surname:string,
    email:string,
    passwordEmail:string,
    passwordOld:string,
    passwordNew: string
}
export default function AccountSettings({setAccountSettings}:{setAccountSettings:React.Dispatch<React.SetStateAction<boolean>>}) {
    const state = useAppSelector(state=>state.userSlice)
    const dispatch = useAppDispatch()
    const [formData,setFormData] = useState<formData>({name:"",surname:"",email:"",passwordEmail:"",passwordOld:"",passwordNew:""})
    const [alert,setAlert] = useState("")

    useEffect(()=>{
        setFormData({...formData,name:state.name,surname:state.surname,email:state.email})
    },[])
    const submitNameSurnameChange = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(state.name === formData.name && state.surname === formData.surname && state.email === formData.email) return
        axios.patch(`${URL}/handleUser/updateUserData`,{...formData,_id:state._id})
        dispatch(changeUserData({...state,name:formData.name,surname:formData.surname}))
    }
    const submitEmailChange = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(formData.email === state.email) return
        if(formData.passwordEmail === state.password){
            axios.post(`${URL}/handleUser`,{_id:state._id,email:formData.email,changeEmail:true})
            .then(res=>{
                if(res.data === "Success"){
                    dispatch(changeUserData({...state,email:formData.email}))
                    setFormData({...formData,passwordEmail:""})
                }else {
                    setAlert(res.data)
                }
            })
        }else {
            setAlert("Wrong password!")
        }
    }
    const submitPasswordChange = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(formData.passwordOld === state.password){
            axios.patch(`${URL}/handleUser/updateUserData`,{password:formData.passwordNew,_id:state._id})
            dispatch(changeUserData({...state,password:formData.passwordNew}))
            setFormData({...formData,passwordOld:"",passwordNew:""})
        }else {
            setAlert("Wrong old password!")
        }
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    return (
        <section className="absoluteContainer">
            <div className="accountSettings">
                <button className="closeBtn" onClick={()=>setAccountSettings(false)}><img src="/Images/delete.svg"/></button>
                <h1>Account Settings</h1>
                <hr />
                <p className="simpleAlert">{alert}</p>
                <h2>Name & Surname</h2>
                <form onSubmit={submitNameSurnameChange}>
                    <div>
                        <input type="text" placeholder="Name" value={formData.name}
                        onChange={handleChange} name="name" required/>
                        <input type="text" placeholder="Surname" value={formData.surname}
                        onChange={handleChange} name="surname" required/>
                    </div>
                    <input type="submit" value="Save"/>
                </form>
                <h2>Email</h2>
                <form onSubmit={submitEmailChange}>
                    <input type="email" placeholder="E-mail" value={formData.email}
                    onChange={handleChange} name="email" required/>
                    <input type="password" placeholder="Password" value={formData.passwordEmail}
                    onChange={handleChange} name="passwordEmail" minLength={8} maxLength={20} required/>
                    <input type="submit" value="Change Email" />
                </form>
                <h2>Password</h2>
                <form onSubmit={submitPasswordChange}>
                    <input type="password" placeholder="Old Password" value={formData.passwordOld}
                    onChange={handleChange} name="passwordOld" minLength={8} maxLength={20} required/>
                    <input type="password" placeholder="New Password" value={formData.passwordNew}
                    onChange={handleChange} name="passwordNew" minLength={8} maxLength={20} required/>
                    <input type="submit" value="Change Password"/>
                </form>
            </div>
        </section>
    )
}

import "./login.scss"
import {Link, useNavigate} from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import {URL} from "../../databaseUrl"
import {changeUserData} from "../../App/Reducers/userData"
import {useAppDispatch,useAppSelector} from "../../App/hooks"
import axios from "axios"

import { Logo,Alert } from "../SharedComponents/sharedComponents"

export default function Login() {
    const dispatch = useAppDispatch()
    const state = useAppSelector(state=>state.userSlice)
    const navigate = useNavigate()

    const [userData,setUserData] = useState({email:"",password:""})
    const [alert,setAlert] = useState("")
    
    useEffect(()=>{
        if(state.name !== ""){
            navigate("/logged")
        }
    },[state])
    const hanldeLogIn = useCallback((e)=>{
        e.preventDefault()
        axios.post(`${URL}/handleUser/login`,userData)
        .then(async (res)=>{
            if(res.data){
                dispatch(changeUserData(res.data))
            }else {
                setAlert("Wrong email or password!")
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[userData])
    const handleChange = useCallback((e)=>{
        setUserData({...userData,[e.target.name]:e.target.value})
    },[userData])
    return (
        <section className="loginContainer">
            <div className="formContainer">
                <Logo />
                <Alert data={alert}/>
                <form onSubmit={(e)=>hanldeLogIn(e)}>
                    <input type="email" placeholder="E-mail" value={userData.email}
                    onChange={handleChange} name="email" required/>
                    <input type="password" placeholder="Password" value={userData.password}
                    onChange={handleChange} name="password" required/>
                    <input type="submit" value="Log In"/>
                </form>
                <p>Don't have an account? <Link to="/register"><b>Sign up</b></Link></p>
            </div>
        </section>
    )
}

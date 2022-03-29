import "./login.scss"
import {Link, useNavigate} from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import {URL} from "../../databaseUrl"
import {changeUserData} from "../../App/Reducers/userData"
import {useAppDispatch,useAppSelector} from "../../App/hooks"
import axios from "axios"
import { nanoid } from "nanoid"

import { Logo,Alert, FullscreenLoader } from "../SharedComponents/sharedComponents"

export default function Login() {
    const dispatch = useAppDispatch()
    const state = useAppSelector(state=>state.userSlice)
    const navigate = useNavigate()
    const [userData,setUserData] = useState({email:"",password:""})
    const [alert,setAlert] = useState("")
    const [load,setLoad] = useState(false)
    
    useEffect(()=>{
        if(state.name !== ""){
            navigate("/logged")
        }
    },[state])
    const handleLogIn = useCallback((e)=>{
        e.preventDefault()
        const authToken = nanoid(30)
        setLoad(true)
        axios.post(`${URL}/handleUser/login`,{...userData,authToken})
        .then(async (res)=>{
            setLoad(false)
            if(res.data){
                dispatch(changeUserData(res.data))
                window.localStorage.setItem("authToken",authToken)
            }else {
                setAlert("Wrong email or password!")
            }
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
                <div style={{textAlign:"center"}}>
                    <i>Test email: admin@gmail.com</i><br/>
                    <i>Test password: admin12345</i>
                </div>
                <form onSubmit={(e)=>handleLogIn(e)}>
                    <input type="email" placeholder="E-mail" value={userData.email}
                    onChange={handleChange} name="email" required/>
                    <input type="password" placeholder="Password" value={userData.password}
                    onChange={handleChange} name="password" required/>
                    <input type="submit" value="Log In"/>
                </form>
                <p>Don't have an account? <Link to="/register" data-testid="registerBtn"><b>Sign up</b></Link></p>
            </div>
            {load?<FullscreenLoader />:""}
        </section>
    )
}

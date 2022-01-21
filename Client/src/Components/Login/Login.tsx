import "./login.scss"
import {Link} from "react-router-dom"
import { Logo } from "../SharedComponents/sharedComponents"
import { useCallback, useState } from "react"
import {URL} from "../../databaseUrl"
import axios from "axios"

export default function Login() {
    const [userData,setUserData] = useState({email:"",password:""})

    const hanldeLogIn = useCallback((e)=>{
        e.preventDefault()
        axios.post(`${URL}/handleUser/login`,userData)
        .then(res=>{
            console.log(res)
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
                <form onSubmit={(e)=>hanldeLogIn(e)}>
                    <input type="email" placeholder="E-mail" value={userData.email}
                    onChange={(e)=>handleChange(e)} name="email" required/>
                    <input type="password" placeholder="Password" value={userData.password}
                    onChange={(e)=>handleChange(e)} name="password" required/>
                    <input type="submit" value="Log In"/>
                </form>
                <p>Don't have an account? <Link to="/register"><b>Sign up</b></Link></p>
            </div>
        </section>
    )
}

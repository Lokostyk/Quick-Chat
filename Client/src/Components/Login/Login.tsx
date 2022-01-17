import "./login.scss"
import {Link} from "react-router-dom"
import { Logo } from "../SharedComponents/sharedComponents"

export default function Login() {
    return (
        <section className="loginContainer">
            <div className="formContainer">
                <Logo />
                <form>
                    <input type="email" placeholder="E-mail" required/>
                    <input type="password" placeholder="Password" required/>
                    <input type="submit" value="Login"/>
                </form>
                <p>Don't have an account? <Link to="register"><b>Sign up</b></Link></p>
            </div>
        </section>
    )
}

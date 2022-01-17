import "./register.scss"
import { Logo } from "../SharedComponents/sharedComponents"

export default function Register() {
    return (
        <section className="registerContainer">
            <div className="formContainer">
                <Logo />
                <form>
                    <div>
                        <input type="text" placeholder="Name" />
                        <input type="text" placeholder="Surname"/>
                    </div>
                    <input type="email"/>
                    <input type="password"/>
                    <input type="password"/>
                </form>
            </div>
        </section>
    )
}

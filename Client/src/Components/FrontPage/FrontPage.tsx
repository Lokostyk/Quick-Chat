import "./frontPage.scss"
import {Link} from "react-router-dom"
import {Logo} from "../SharedComponents/sharedComponents"

function FrontPage() {
    return (
    <section className="mainContainer">
      <div className="subContainer">
       <Logo />
        <div className="btnContainer">
          <Link to="/login" className="loginBtns">Login</Link>
          <Link to="/register" className="loginBtns">Register</Link>
        </div>
      </div>
      <img className="backgroundImage" src="/Images/social.svg" />
    </section>
    )
}

export default FrontPage

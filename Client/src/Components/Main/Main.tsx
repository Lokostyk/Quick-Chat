import "./main.scss"

function Main() {
    return (
    <section className="mainContainer">
      <div className="subContainer">
        <h1><img className="wing" src="/Images/wing.svg" />Quick Chat<img className="wing" src="/Images/wing.svg" /></h1>
        <div className="btnContainer">
          <button className="loginBtns">Login</button>
          <button className="loginBtns">Register</button>
        </div>
      </div>
      <img className="backgroundImage" src="/Images/social.svg" />
    </section>
    )
}

export default Main

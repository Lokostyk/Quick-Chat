import "./accountSettings.scss"

export default function AccountSettings() {
  return (
      <section className="accountSettingsContainer">
          <div className="accountSettings">
                <h1>Account Settings</h1>
                <form onSubmit={(e)=>e.preventDefault()}>
                    <input className=""></input>
                </form>
          </div>
      </section>
  )
}

import "./leftBar.scss"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../App/hooks"
import AccountSettings from "../AccountSettings/AccountSettings"
import Search from "../Search/Search"
import CreateGroup from '../CreateGroup/CreateGroup'

import { fetchedUser,fetchedGroups } from "../MainHub/MainHub"

export default function LeftBar({singleConversations,groupConversations,setChosenChat}:{singleConversations:fetchedUser[],groupConversations:fetchedGroups[],setChosenChat:React.Dispatch<React.SetStateAction<{userOneId: string;userTwoId: string;}>>}) {
  const state = useAppSelector(state=>state.userSlice)
  const [settingsContainer,setSettingsContainer] = useState<HTMLDivElement | null>(null)
  const [accountSettings,setAccountSettings] = useState(false)
  const [search,setSearch] = useState(false)
  const [createGroup,setCreateGroup] = useState(false)

  const windowClick = () => {
      settingsContainer?.classList.remove("openSettings")
      window.removeEventListener("click",windowClick)
  }
  const openAccountSettings = () => {
    setAccountSettings(true)
    window.removeEventListener("click",windowClick)
    settingsContainer?.classList.remove("openSettings")
  }
  const openSettings = () => {
    if(settingsContainer?.classList.contains("openSettings")){
      settingsContainer?.classList.remove("openSettings")
    }else {
      window.addEventListener("click",windowClick)
      settingsContainer?.classList.add("openSettings")
    }
  }
  const openChat = (userOneId:string,userTwoId:string="") => {
    setChosenChat({userOneId,userTwoId})
  }
  const handleThemeChange = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    const rootStyle = document.documentElement.style 
    const allThemeButtons = document.querySelectorAll(".themeBtn")

    allThemeButtons.forEach(btn=>{
      btn.classList.remove("active")
    })
    e.currentTarget.classList.add("active")
    switch (e.currentTarget.dataset.id) {
      case "1":
        rootStyle.setProperty("--main-color","#daeef7")
        rootStyle.setProperty("--second-color","#3088a4")
        rootStyle.setProperty("--third-color","#835cc1")
        break;
      case "2":
        rootStyle.setProperty("--main-color","#3088a4")
        rootStyle.setProperty("--second-color","#835cc1")
        rootStyle.setProperty("--third-color","#daeef7")
        break;
      case "3":
        rootStyle.setProperty("--main-color","#835cc1")
        rootStyle.setProperty("--second-color","#3088a4")
        rootStyle.setProperty("--third-color","#daeef7")
        break;
    }
  }
  return (
    <div className="leftBarContainer">
        <div className="searchBox">
          <input className="searchPreview" placeholder="Add single/group chat..." onFocus={()=>setSearch(true)}/>
        </div>
        {search?<Search setSearch={setSearch}/>:""}
        <div className="chatList">
          <h2>Single Chats</h2>
          {singleConversations.map((item:fetchedUser)=>{
            return (<button key={item._id} className="chatElement" onClick={()=>openChat(item._id,state._id)}>
              <img src={`${item.imgSmall===""?"./Images/default.jpg":item.imgSmall}`} />
              <p>{item.name} {item.surname}</p>
            </button>)
          })}
        </div>
        <div className="chatList">
            <h2>Group Chats
              <button onClick={()=>setCreateGroup(true)}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="Group 1">
                    <path className="rec" id="Rectangle 2" d="M10 5C10 3.34315 11.3431 2 13 2V2C14.6569 2 16 3.34315 16 5V21C16 22.6569 14.6569 24 13 24V24C11.3431 24 10 22.6569 10 21V5Z" fill="#C4C4C4"/>
                    <rect className="rec" id="Rectangle 3" x="2" y="16" width="6" height="22" rx="3" transform="rotate(-90 2 16)" fill="#C4C4C4"/>
                  </g>
                  </svg>
              </button>
            </h2>
            {groupConversations.map(item=>{
              return (<button key={item._id} className="chatElement" onClick={()=>openChat(item._id)}>
                <p>{item.groupName}</p>
              </button>)
            })}
        </div>
        {createGroup?<CreateGroup setCreateGroup={setCreateGroup} />:""}
        <div className="bottomInfo">
          <img src={state.imgSmall === ""?"/Images/default.jpg":state.imgSmall}/>
          <h2>{`${state.name} ${state.surname}`}</h2>
          <div className="settingsContainer" onClick={(e)=>e.stopPropagation()}>
              <div className="settings" ref={(e)=>setSettingsContainer(e)}>
                <button className="settingsBtn" onClick={openAccountSettings}>Account Settings</button>
                <div className="themeConatiner">
                  <h2>Theme settings</h2>
                    <div style={{display:"inline-block"}}>
                      <button className="themeBtn active" onClick={handleThemeChange} data-id="1"></button>
                      <button className="themeBtn" onClick={handleThemeChange} data-id="2"></button>
                      <button className="themeBtn" onClick={handleThemeChange} data-id="3"></button>
                    </div>
                </div>
                <button className="logOutBtn">Log Out</button>
              </div>
            <button className="settingsIcon" onClick={()=>openSettings()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
            </button>
          </div>
        </div>
        {accountSettings?<AccountSettings setAccountSettings={setAccountSettings}/>:""}
    </div>
  )
}

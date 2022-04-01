import axios from "axios"
import { useState } from "react"

import { fetchedChatData,fetchedUser } from "../../MainHub/MainHub"
import { useAppSelector } from "../../../App/hooks"
import { URL } from "../../../databaseUrl"

export default function ChatSettings({otherUsersData,chatData}:{otherUsersData:fetchedUser[],chatData:fetchedChatData}) {
  const state = useAppSelector(state=>state.userSlice)
  const [userId,setUserId] = useState("")

  const addUser = (e:React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault()
    axios.post(`${URL}/handleChat/addUser`,{userId,chatId:chatData._id})
    setUserId("")  
  }
  //UserTwo is needed when converastion is a single chat
  const kickUser = (userId:string,chatId:string,userTwoId?:string) => {
      axios.post(`${URL}/handleChat/kickUser`,{userId,chatId,userTwoId})
      window.location.reload()
  }
  return (
    <div className="chatSettingsContainer" id="chatSettingsContainer" onClick={e=>e.stopPropagation()}>
      <h2 className="title">
        Conversation members
        <hr />
      </h2>
      <div className="users">
        {otherUsersData.map((user)=>{
            if(!user.joinedChats?.includes(chatData._id) && chatData.groupName) return
            return (<div className="userConatiner" key={user._id} data-testid="userContainer">
                <img className="userImg" src={user.imgSmall === ""?'./Images/default.jpg':user.imgSmall}/>
                <h2>{user.name + " " + user.surname}</h2>
                {state._id === otherUsersData[0]._id && chatData.groupName?<button onClick={()=>kickUser(user._id,chatData._id)} data-testid="deleteBtn"><img src="./Images/delete.svg"/></button>:""}
                </div>)
        })}
      </div>
      {chatData.isPrivate?
      <>
        <h2 className="title">
          Add
          <hr />
        </h2>
        <form onSubmit={addUser}>
          <input type="text" value={userId} onChange={e=>setUserId(e.target.value)} placeholder="Add user by Id"/>
          <input type="submit" className="greenBtn" value="ADD"/>
        </form>
      </>:""}
      <button className="leaveBtn" onClick={()=>chatData.groupName?kickUser(state._id,chatData._id):kickUser(state._id,chatData._id,otherUsersData[0]._id)}>Leave Conversation</button>
    </div>)
}

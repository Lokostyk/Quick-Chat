import axios from "axios"
import { useAppSelector } from "../../../App/hooks"
import { URL } from "../../../databaseUrl"
import { fetchedChatData,fetchedUser,MessagesType } from "../../MainHub/MainHub"

export default function ChatSettings({otherUsersData,chatData}:{otherUsersData:fetchedUser[],chatData:fetchedChatData}) {
  const state = useAppSelector(state=>state.userSlice)

  const kickUser = (userId:string,chatId:string) => {
      axios.post(`${URL}/handleChat/deleteUser`,{userId,chatId})
  }
  return (<div className="chatSettingsContainer" id="chatSettingsContainer" onClick={e=>e.stopPropagation()}>
      <h2 className="title">
        Conversation members
        <hr />
      </h2>
      <div className="users">
        {otherUsersData.map((user)=>{
            return (<div className="userConatiner">
                <img className="userImg" src={user.imgSmall === ""?'./Images/default.jpg':user.imgSmall}/>
                <h2>{user.name + " " + user.surname}</h2>
                {state._id === otherUsersData[0]._id && chatData.groupName?<button onClick={()=>kickUser(user._id,chatData._id)}><img src="./Images/delete.svg"/></button>:""}
                </div>)
        })}
      </div>
      <button className="leaveBtn" onClick={()=>kickUser(state._id,chatData._id)}>Leave Conversation</button>
    </div>)
}

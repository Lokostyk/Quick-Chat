import "./ChatWindow.scss"
import { URL } from "../../databaseUrl"
import { fetchedChatData,fetchedUser } from "../MainHub/MainHub"
import { useEffect,useState } from "react"
import { useAppSelector } from "../../App/hooks"
import axios from "axios"

export default function ChatWindow({chatData}:{chatData:fetchedChatData}) {
  const state = useAppSelector(state=>state.userSlice)
  const [otherUserData,setOtherUserData] = useState<fetchedUser>({_id:"",name:"",surname:"",imgSmall:""})
  useEffect(()=>{
    if(!chatData.groupName){
      const otherUserId = chatData.users.filter(item=>item !== state._id)
      axios.post(`${URL}/handleUser/getUserById`,{id:otherUserId})
      .then(res=>{
        setOtherUserData(res.data)
      })
      .catch(err=>console.log(err))
    }
  },[chatData])
  return (
  <section>
      <div className="topBar">
        {chatData.groupName?"":<img src={otherUserData.imgSmall === ""?"./Images/default.jpg":otherUserData.imgSmall}/>}
        <p>{chatData.groupName?chatData.groupName:otherUserData.name + " " + otherUserData.surname}</p>

      </div>
  </section>)
}

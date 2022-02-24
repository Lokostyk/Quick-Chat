import "./mainHub.scss"
import { useState,useEffect } from "react"
import {useAppSelector} from "../../App/hooks"
import {io} from "socket.io-client"
import {URL} from "../../databaseUrl"
import axios from "axios"
import LeftBar from "../LeftBar/LeftBar"
import ChatWindow from "../ChatWindow/ChatWindow"

export interface fetchedUser {
  _id:string,
  name:string,
  surname:string,
  imgSmall:string
}
export interface Messages {
  userId:string,
  message:string,
  messageId:string
}
export interface fetchedChatData {
  _id:string,
  groupName?: string,
  users: string[],
  messages: Messages[]
}
const Socket = io(`${URL}`)
function MainHub() {
  const state = useAppSelector(state=>state.userSlice)
  const [singleConversations,setSingleConversations] = useState<fetchedUser[]>([])
  const [groupConversations,setGroupConversations] = useState<fetchedChatData[]>([])
  const [chosenChat,setChosenChat] = useState({userOneId:"",userTwoId:""})
  const [chosenChatData,setChosenChatData] = useState<fetchedChatData>({} as fetchedChatData)

  // Checking if user is logged in
  if(!state.name){
    window.location.pathname = "/"
  }
  useEffect(()=>{
    axios.post(`${URL}/handleUser/getUsers`,{joinedChats:state.joinedChats})
    .then(res=>{
      setSingleConversations(res.data)
    })
    axios.post(`${URL}/handleChat/getGroups`,{joinedGroups:state.joinedChats})
    .then(res=>{
      setGroupConversations(res.data)
    })
  },[])
  useEffect(()=>{
    if(chosenChat.userOneId === "") return
    axios.post(`${URL}/handleChat/getChat`,chosenChat)
    .then(res=>{
      setChosenChatData(res.data)
    })
  },[chosenChat])
  return (
    <section className="mainHubContainer">
      <LeftBar setChosenChat={setChosenChat} singleConversations={singleConversations} groupConversations={groupConversations}/>
      {chosenChatData._id?<ChatWindow chatData={chosenChatData} socket={Socket}/>:""}
    </section>
  );
}

export default MainHub;

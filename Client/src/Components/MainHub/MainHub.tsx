import "./mainHub.scss"
import { useState,useEffect } from "react"
import {useAppSelector} from "../../App/hooks"
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
export interface fetchedGroups {
  _id:string,
  groupName:string,
  users: string[]
}
function MainHub() {
  const state = useAppSelector(state=>state.userSlice)
  const [singleConversations,setSingleConversations] = useState<fetchedUser[]>([])
  const [groupConversations,setGroupConversations] = useState<fetchedGroups[]>([])
  const [chosenChat,setChosenChat] = useState({userOneId:"",userTwoId:""})
  const [chosenChatData,setChosenChatData] = useState()
  console.log(chosenChatData)
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
      <ChatWindow />
    </section>
  );
}

export default MainHub;

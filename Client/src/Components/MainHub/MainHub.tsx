import "./mainHub.scss"
import { useState,useEffect } from "react"
import Pusher from "pusher-js"
import axios from "axios"

import {useAppDispatch, useAppSelector} from "../../App/hooks"
import { changeUserData } from "../../App/Reducers/userData"
import { FullscreenLoader } from "../SharedComponents/sharedComponents"
import {URL} from "../../databaseUrl"
import LeftBar from "../LeftBar/LeftBar"
import ChatWindow from "../ChatWindow/ChatWindow"
import DefaultChatWindow from "../DefaultChatWindow/DefaultChatWindow"

export interface fetchedUser {
  _id:string,
  name:string,
  surname:string,
  imgSmall:string,
  joinedChats?: string[]
}
export interface MessagesType {
  userId:string,
  message:string,
  messageId:string
}
export interface fetchedChatData {
  _id:string,
  groupName?: string,
  users: string[],
  messages: MessagesType[],
  isPrivate: boolean
}

const Socket = new Pusher(process.env.REACT_APP_PUSHER_KEY as string,{cluster:"eu"})
function MainHub() {
  const authToken = localStorage.getItem("authToken")
  const state = useAppSelector(state=>state.userSlice)
  const dispatch = useAppDispatch()
  const [singleConversations,setSingleConversations] = useState<fetchedUser[]>([])
  const [groupConversations,setGroupConversations] = useState<fetchedChatData[]>([])
  const [chosenChat,setChosenChat] = useState({userOneId:"",userTwoId:""})
  const [chosenChatData,setChosenChatData] = useState<fetchedChatData>({} as fetchedChatData)
  const [loader,setLoader] = useState(true)
  const [conversationLoader,setConversationLoader] = useState(false)

  //Log in user with token
  useEffect(()=>{
    if(authToken){
      axios.post(`${URL}/handleUser/tokenAuthentication`,{authToken})
      .then(res=>{
        if(res.data){
          dispatch(changeUserData(res.data))
        }else {
          window.localStorage.clear()
          window.location.pathname = "/"
        }
      })
    }
  },[])
  // Check if user is logged in
  if(!state.name && !authToken){
    window.location.pathname = "/"
  }
  useEffect(()=>{
    axios.post(`${URL}/handleUser/getUsers`,{joinedChats:state.joinedChats})
    .then(res=>{
      if(res.data.length === 0) return
      setSingleConversations(res.data)
    })
    axios.post(`${URL}/handleChat/getGroups`,{joinedGroups:state.joinedChats})
    .then(res=>{
      if(res.data.length === 0) return
      setGroupConversations(res.data)
    })
    setLoader(false)
  },[state])
  useEffect(()=>{
    if(chosenChat.userOneId === "") return
    setConversationLoader(true)
    axios.post(`${URL}/handleChat/getChat`,chosenChat)
    .then(res=>{
      setChosenChatData(res.data)
      setConversationLoader(false)
    })
  },[chosenChat])
  const openLeftBar = () => {
    const leftBarContainer = document.querySelector(".leftBarContainer")
    leftBarContainer?.classList.add("active")
    setTimeout(()=>leftBarContainer?.classList.add("overflow"),600)
  }
  return (
    <section className="mainHubContainer">
      <button className="mobileBtnOpen" onClick={openLeftBar}><img src="./Images/openLeftBar.svg" /></button>
      <LeftBar setChosenChat={setChosenChat} singleConversations={singleConversations} groupConversations={groupConversations}/>
      {chosenChatData._id?
        conversationLoader?<DefaultChatWindow loader={conversationLoader}/>:<ChatWindow chatData={chosenChatData} socket={Socket}/>
        :conversationLoader?<DefaultChatWindow loader={conversationLoader}/>:<DefaultChatWindow />}
      {loader || !state.name?<FullscreenLoader />:""}
    </section>
  );
}

export default MainHub;

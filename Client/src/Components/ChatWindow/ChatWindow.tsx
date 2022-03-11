import "./ChatWindow.scss"

import { useCallback, useEffect,useRef,useState } from "react"
import { nanoid } from "nanoid"
import Pusher from "pusher-js/types/src/core/pusher"
import axios from "axios"

import { fetchedChatData,fetchedUser,MessagesType } from "../MainHub/MainHub"
import { useAppSelector } from "../../App/hooks"
import { Loader } from "../SharedComponents/sharedComponents"
import { URL } from "../../databaseUrl"
import Messages from "./subcomponents/Messages"
import ChatSettings from "./subcomponents/ChatSettings"

export default function ChatWindow({chatData,socket}:{chatData:fetchedChatData,socket:Pusher}) {
  const state = useAppSelector(state=>state.userSlice)
  const observer = useRef<IntersectionObserver>()
  const [otherUsersData,setOtherUsersData] = useState<fetchedUser[]>([{_id:"",name:"",surname:"",imgSmall:""}])
  const [messages,setMessages] = useState<MessagesType[]>([])
  const [load,setLoad] = useState(false)
  const [currentMessage,setCurrentMessage] = useState("")

  useEffect(()=>{
    const mesContainer = document.querySelector(".messagesContainer")

    axios.post(`${URL}/handleChat/getMoreMessages`,{id:chatData._id,howMany:0})
    .then(res=>{
      setMessages(res.data.messages.reverse())
      mesContainer?.scroll({top:mesContainer.scrollHeight})
    })
    
    if(!chatData.groupName || chatData.users.length === 2){
      const otherUserId = chatData.users.filter(id=>id !== state._id)
      axios.post(`${URL}/handleUser/getUserById`,{id:otherUserId})
      .then(res=>{
        setOtherUsersData([res.data])
      })
    }else {
      axios.post(`${URL}/handleUser/getUsersByIds`,chatData.users)
      .then(res=>{
        setOtherUsersData(res.data)
      })
    }
    //Online chat functionality
    socket.subscribe(chatData._id)
    const channel = socket.channel(chatData._id)
    channel.bind("message",(res:MessagesType)=>{
      console.log(res)
      setMessages((prevState)=>[...prevState,res])
      scrollToBottom()
    })
    return socket.unsubscribe(chatData._id)
  },[chatData])
  //Teaxtarea submit on enter && another line on shift + enter
  useEffect(()=>{
    const teaxtarea = document.querySelector(".teaxtarea")
    const submitBtn = document.getElementById("sendBtn")

    if(teaxtarea === null || submitBtn === null) return
    let lastPressedKey:string;
    teaxtarea.addEventListener("keydown",(e:any)=>{
      if(e.key === "Enter" && lastPressedKey !== "Shift"){
        e.preventDefault()
        submitBtn.click()
      }
      lastPressedKey = e.key
    })
  },[])

  const sendMessage = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const messageId = nanoid()
    const message = {message:currentMessage,userId:state._id,messageId}
    axios.post(`${URL}/handleChat/sendMessage`,{message,chatId:chatData._id})
    setMessages([...messages,message])
    setCurrentMessage("")
    scrollToBottom()
  }
  const loadMoreMessages = useCallback((node:HTMLDivElement) => {
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        setLoad(true)
        axios.post(`${URL}/handleChat/getMoreMessages`,{id:chatData._id,howMany:messages.length})
        .then(res=>{
          if(res.data.messages.length === 0){
            setLoad(false)
            observer.current?.disconnect()
            return
          }
          const reversedArray = res.data.messages.reverse()
          setLoad(false)
          setMessages((prevState)=>[...reversedArray,...prevState])
        })
      }
    })
    if(node) observer.current.observe(node)
  },[messages,observer])
  const handleComment = (node:React.ChangeEvent<HTMLTextAreaElement>) => {
        node.target.style.height = "1.95rem"
        setCurrentMessage(node.target.value)
        if(node.target.scrollHeight > 30){
            node.target.style.height = node.target.scrollHeight + 'px'
        }
        if(node.target.scrollHeight >= 167){
          node.target.style.overflowY = "visible"
        }else {
          node.target.style.overflowY = "hidden"
        }
    }
  const openSettings = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    const chatSettingsContainer = document.getElementById("chatSettingsContainer")
    const messagesContainer = document.querySelector(".messagesContainer")

    if(!chatSettingsContainer || !messagesContainer) return
    if(parseInt(chatSettingsContainer.style.height) !== 0 && parseInt(chatSettingsContainer.style.height)){
      chatSettingsContainer.style.height = `0px`
    }else {
      chatSettingsContainer.style.height = `${messagesContainer.clientHeight-0.5}px`
      window.addEventListener("click",()=>{
              chatSettingsContainer.style.height = `0px`

      })
    }
  }
  const scrollToBottom = () => {
    setTimeout(()=>{
      const containerToScroll = document.querySelector(".messagesContainer")
      if(!containerToScroll) return
      if(containerToScroll?.scrollHeight - containerToScroll?.clientHeight < containerToScroll?.scrollTop + containerToScroll?.clientHeight * 1.5){
        containerToScroll?.scroll({top:containerToScroll.scrollHeight,behavior:"smooth"})
      }
    },10)
  }
  return (
  <section className="chatSection">
      <div className="topBar">
        {chatData.groupName?"":<img src={otherUsersData[0].imgSmall === ""?"./Images/default.jpg":otherUsersData[0].imgSmall}/>}
        <p>{chatData.groupName?chatData.groupName:otherUsersData[0].name + " " + otherUsersData[0].surname}</p>
        <button className="settingsBtn" onClick={(e)=>openSettings(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
        </button>
      </div>
      <div className="messagesContainer">
        {load?<Loader />:""}
        <ChatSettings otherUsersData={otherUsersData} chatData={chatData}/>
        <Messages messages={messages} chatData={chatData} otherUsersData={otherUsersData} loadMoreMessages={loadMoreMessages}/>
      </div>
      <div className="bottomBar">
        <form onSubmit={(e)=>sendMessage(e)}>
          <textarea className="teaxtarea" rows={1} placeholder="Send a message..." minLength={1} required
          value={currentMessage} onChange={(e)=>handleComment(e)}
          onFocus={()=>document.querySelector(".messagesContainer")?.scroll({top:document.querySelector(".messagesContainer")?.scrollHeight})}/>
          <button className="sendBtn" id="sendBtn">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              width="31.806px" height="31.806px" viewBox="0 0 31.806 31.806">
            <g>
              <g>
                <path d="M1.286,12.465c-0.685,0.263-1.171,0.879-1.268,1.606c-0.096,0.728,0.213,1.449,0.806,1.88l6.492,4.724L30.374,2.534
                  L9.985,22.621l8.875,6.458c0.564,0.41,1.293,0.533,1.964,0.33c0.67-0.204,1.204-0.713,1.444-1.368l9.494-25.986
                  c0.096-0.264,0.028-0.559-0.172-0.756c-0.199-0.197-0.494-0.259-0.758-0.158L1.286,12.465z"/>
                <path d="M5.774,22.246l0.055,0.301l1.26,6.889c0.094,0.512,0.436,0.941,0.912,1.148c0.476,0.206,1.025,0.162,1.461-0.119
                  c1.755-1.132,4.047-2.634,3.985-2.722L5.774,22.246z"/>
              </g>
            </g>
            </svg>
          </button>
        </form>
      </div>
  </section>)
}

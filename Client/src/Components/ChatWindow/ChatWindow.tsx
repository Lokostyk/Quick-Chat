import "./ChatWindow.scss"
import { URL } from "../../databaseUrl"
import { fetchedChatData,fetchedUser,MessagesType } from "../MainHub/MainHub"
import { useCallback, useEffect,useRef,useState } from "react"
import { useAppSelector } from "../../App/hooks"
import axios from "axios"
import { Socket } from "socket.io-client"
import { nanoid } from "nanoid"
import Messages from "./subcomponents/Messages"

export default function ChatWindow({chatData,socket}:{chatData:fetchedChatData,socket:Socket}) {
  const state = useAppSelector(state=>state.userSlice)
  const observer = useRef<IntersectionObserver>()
  const [otherUsersData,setOtherUsersData] = useState<fetchedUser[]>([{_id:"",name:"",surname:"",imgSmall:""}])
  const [messages,setMessages] = useState<MessagesType[]>([])
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
      .catch(err=>console.log(err))
    }else {
      axios.post(`${URL}/handleUser/getUsersByIds`,chatData.users)
      .then(res=>{
        setOtherUsersData(res.data)
      })
    }
    socket.emit("join-room",{roomId:chatData._id})
    socket.on("message",(res)=>{
      setMessages((prevState)=>[...prevState,res])
      scrollToBottom()
    })
  },[chatData])
  const sendMessage = (e:React.FormEvent<HTMLFormElement>) => {
    const messageId = nanoid()
    e.preventDefault()
    const message = {message:currentMessage,userId:state._id,messageId}
    socket.emit("message",{...message,chatId:chatData._id})
    setMessages([...messages,message])
    setCurrentMessage("")
    scrollToBottom()
  }
  const loadMoreMessages = useCallback((node:HTMLDivElement) => {
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        axios.post(`${URL}/handleChat/getMoreMessages`,{id:chatData._id,howMany:messages.length})
        .then(res=>{
          if(res.data.messages.length === 0){
            observer.current?.disconnect()
            return
          }
          const reversedArray = res.data.messages.reverse()
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
      </div>
      <div className="messagesContainer">
        <Messages messages={messages} chatData={chatData} otherUsersData={otherUsersData} loadMoreMessages={loadMoreMessages}/>
      </div>
      <div className="bottomBar">
        <form onSubmit={(e)=>sendMessage(e)}>
          <textarea rows={1} placeholder="Send a message..." minLength={1} required
          value={currentMessage} onChange={(e)=>handleComment(e)}
          onFocus={()=>document.querySelector(".messagesContainer")?.scroll({top:document.querySelector(".messagesContainer")?.scrollHeight})}/>
          <button className="sendBtn">
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

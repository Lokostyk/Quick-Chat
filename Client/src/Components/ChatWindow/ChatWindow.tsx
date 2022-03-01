import "./ChatWindow.scss"
import { URL } from "../../databaseUrl"
import { fetchedChatData,fetchedUser,Messages } from "../MainHub/MainHub"
import { useCallback, useEffect,useRef,useState } from "react"
import { useAppSelector } from "../../App/hooks"
import axios from "axios"
import { Socket } from "socket.io-client"
import { nanoid } from "nanoid"

export default function ChatWindow({chatData,socket}:{chatData:fetchedChatData,socket:Socket}) {
  const state = useAppSelector(state=>state.userSlice)
  const observer = useRef<IntersectionObserver>()
  const [otherUsersData,setOtherUsersData] = useState<fetchedUser[]>([{_id:"",name:"",surname:"",imgSmall:""}])
  const [messages,setMessages] = useState<Messages[]>([])
  const [currentMessage,setCurrentMessage] = useState("")

  useEffect(()=>{
    const mesContainer = document.querySelector(".messagesContainer")

    axios.post(`${URL}/handleChat/getMoreMessages`,{id:chatData._id,howMany:0})
    .then(res=>{
      setMessages(res.data.messages)
      setTimeout(()=>{
        mesContainer?.scroll({top:mesContainer.scrollHeight})
      },10)
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
          console.log(res.data)
          if(res.data.messages.length === 0){
            observer.current?.disconnect()
            return
          }
          setMessages((prevState)=>[...res.data.messages,...prevState])
          scrollToBottom()
        })
      }
    })
    if(node) observer.current.observe(node)

  },[messages,observer])
  const displayImage = (messageData:Messages,otherUserMessageData:fetchedUser|undefined):string|undefined => {
    const defaultImagePath = "./Images/default.jpg"
    if(messageData.userId === state._id){
      return state.imgSmall === ""?defaultImagePath:state.imgSmall
    }
    if(chatData.groupName){
      return otherUserMessageData?.imgSmall === ""?defaultImagePath:otherUserMessageData?.imgSmall
    }else {
      return otherUsersData[0].imgSmall === ""?defaultImagePath:otherUsersData[0].imgSmall
    }
  }
  const displayName = (messageData:Messages,otherUserMessageData:fetchedUser|undefined):string => {
    if(messageData.userId === state._id){
      return state.name + " " + state.surname
    }
    if(chatData.groupName){
      return otherUserMessageData?.name + " " + otherUserMessageData?.surname
    }else {
      return otherUsersData[0].name + " " + otherUsersData[0].surname
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
        {messages.map((item,index)=>{
          const otherUserMessageData = otherUsersData.find((i)=>i._id === item.userId)
          return (
            <div ref={index===messages.length-1?loadMoreMessages:()=>{}}
            key={item.messageId} className={`message ${item.userId === state._id?"right":""}`}>
              <div>
                <div className="imgCover">
                  <img src={displayImage(item,otherUserMessageData)}/>
                </div>
                <h4>
                  {displayName(item,otherUserMessageData)}
                </h4>
              </div>
              <p>{item.message}</p>
            </div>
          )
        })}
      </div>
      <div className="bottomBar">
        <form onSubmit={(e)=>sendMessage(e)}>
          <input size={20} placeholder="Send a message..."
          value={currentMessage} onChange={(e)=>setCurrentMessage(e.target.value)}
          onFocus={()=>document.querySelector(".messagesContainer")?.scroll({top:document.querySelector(".messagesContainer")?.scrollHeight})}/>
        </form>
      </div>
  </section>)
}

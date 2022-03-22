import { fetchedChatData,fetchedUser,MessagesType } from "../../MainHub/MainHub"
import { useAppSelector } from "../../../App/hooks"

export default function Messages({messages,chatData,otherUsersData,loadMoreMessages}:{messages:MessagesType[],chatData:fetchedChatData,otherUsersData:fetchedUser[],loadMoreMessages:(node:HTMLDivElement)=>void}) {
  const state = useAppSelector(state=>state.userSlice)

  const displayImage = (messageData:MessagesType,otherUserMessageData:fetchedUser|undefined):string|undefined => {
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
  const displayName = (messageData:MessagesType,otherUserMessageData:fetchedUser|undefined):string => {
    if(messageData.userId === state._id){
      return state.name + " " + state.surname
    }
    if(chatData.groupName){
      return otherUserMessageData?.name + " " + otherUserMessageData?.surname
    }else {
      return otherUsersData[0].name + " " + otherUsersData[0].surname
    }
  }
  return (
    <>
      {messages.map((item,index)=>{
        const otherUserMessageData = otherUsersData.find((i)=>i._id === item.userId)
        return (
          <div ref={index===0?loadMoreMessages:()=>{}}
          key={item.messageId} className={`message ${item.userId === state._id?"right":""}`} data-testid={`message-${item.messageId}`}>
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
    </>
  )
}

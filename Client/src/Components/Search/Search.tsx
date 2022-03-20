import "./search.scss"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { URL } from "../../databaseUrl"
import { useAppDispatch, useAppSelector } from "../../App/hooks"
import {changeUserData} from "../../App/Reducers/userData"
import FirstPlanWindow from "../HigherOrderComponents/firstPlanWindow"
import { Loader } from "../SharedComponents/sharedComponents"

interface User {
  _id:string,
  name:string,
  surname:string,
  imgSmall:string
}
interface Group {
  _id:string,
  groupName:string,
  users: string[]
}
export default function Search({setSearch}:{setSearch:React.Dispatch<React.SetStateAction<boolean>>}) {
  const state = useAppSelector(state=>state.userSlice)
  const dispatch = useAppDispatch()
  let inputRef = useRef<HTMLInputElement>(null)
  const [users,setUsers] = useState<{initial:User[],afterSearch:User[]}>({initial:[],afterSearch:[]})
  const [groups,setGroups] = useState<{initial:Group[],afterSearch:Group[]}>({initial:[],afterSearch:[]})
  const [searchInput,setSearchInput] = useState("")
  const [load,setLoad] = useState<{single:boolean,group:boolean}>({single:false,group:false})

  useEffect(()=>{
    inputRef.current?.focus()
    setLoad({group:true,single:true})
    axios.post(`${URL}/handleUser/getUsers`)
    .then(res=>{
      const usersData = res.data.filter((item:User)=>item._id !== state._id && !state.joinedChats.includes(item._id))
      setUsers({initial:usersData,afterSearch:usersData})
      setLoad(prevState=>{return {...prevState,single:false}})
    })
    axios.post(`${URL}/handleChat/getGroups`)
    .then(res=>{
      const groupData = res.data.filter((item:Group)=>!state.joinedChats.includes(item._id))
      setGroups({initial:groupData,afterSearch:groupData})
      setLoad(prevState=>{return {...prevState,group:false}})
    })
  },[])
  const joinSingleConverastion = (otherUserId:string) => {
    axios.post(`${URL}/handleChat/createSingle`,{userOneId:state._id,userTwoId:otherUserId})
    const refreshedUsersList = users.afterSearch.filter(item=>item._id !== otherUserId)
    setUsers({...users,afterSearch:refreshedUsersList})
    dispatch(changeUserData({...state,joinedChats:[...state.joinedChats,otherUserId]}))
  }
  const joinGroupConversation = (groupId:string) => {
    axios.post(`${URL}/handleChat/joinGroup`,{groupId,userId:state._id})
    const refreshedUsersList = groups.afterSearch.filter(item=>item._id !== groupId)
    setGroups({...groups,afterSearch:refreshedUsersList})
    dispatch(changeUserData({...state,joinedChats:[...state.joinedChats,groupId]}))
  }
  const handleSerachChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
        if(e.target.value !== ""){
            const searchedUsers:User[] = []
            const searchedGroups:Group[] = []
            const re = new RegExp(e.target.value,"i")
            users.initial.forEach((user)=>{
                if(re.test(user.name + " " + user.surname) || re.test(user._id)){
                    searchedUsers.push(user)
                }
            })
            groups.initial.forEach((group)=>{
              if(re.test(group.groupName) || re.test(group._id)){
                searchedGroups.push(group)
              }
            })
            setUsers({...users,afterSearch:searchedUsers})
            setGroups({...groups,afterSearch:searchedGroups})
        }else {
            setUsers({...users,afterSearch:users.initial})
            setGroups({...groups,afterSearch:groups.initial})
        }
  }
  return (
        <FirstPlanWindow setShowWindow={setSearch}>
            <h1 data-testid="searchTitle">Search for your friends and groups!</h1>
            <input className="search" ref={inputRef} placeholder="Search by id or name..."
            value={searchInput} onChange={handleSerachChange}/>
            <h2>Single Chats</h2>
            <div className="chatContainer" style={load?{overflowY:"hidden"}:{overflowY:"auto"}}>
              {load.group?
                <Loader />:
                <>
                  {users.afterSearch.map(item=>{
                    return (
                      <div key={item._id} className="singleChat" data-testid="singleChat">
                        <img src={item.imgSmall === ""?"/Images/default.jpg":item.imgSmall}/>
                        <p>{item.name} {item.surname}</p>
                        <button onClick={()=>joinSingleConverastion(item._id)} className="greenBtn">ADD</button>
                      </div>
                      )
                  })}
                  {users.afterSearch.length === 0?<h3>We ranned out of users :(</h3>:""}
                </>}
            </div>
            <h2>Group Chats</h2>
            <div className="chatContainer" style={load?{overflowY:"hidden"}:{overflowY:"auto"}}>
              {load.group?
                <Loader />:
                <>
                  {groups.afterSearch.map(item=>{
                    return (<div className="groupChat" key={item._id} data-testid="groupChat">
                      <p>{item.groupName}</p>
                      <button onClick={()=>joinGroupConversation(item._id)}>ADD</button>
                    </div>)
                  })}
                  {groups.afterSearch.length === 0?<h3>We ranned out of groups :(</h3>:""}
                </>
              }
            </div>
  </FirstPlanWindow>)
}

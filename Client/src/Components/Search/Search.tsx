import "./search.scss"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { URL } from "../../databaseUrl"
import { useAppDispatch, useAppSelector } from "../../App/hooks"
import {changeUserData} from "../../App/Reducers/userData"

interface User {
  _id:string,
  name:string,
  surname:string,
  imgSmall:string
}
export default function Search({setSearch}:{setSearch:React.Dispatch<React.SetStateAction<boolean>>}) {
  const state = useAppSelector(state=>state.userSlice)
  const dispatch = useAppDispatch()
  let inputRef = useRef<HTMLInputElement>(null)
  const [users,setUsers] = useState<User[]>([])
  const [searchInput,setSearchInput] = useState("") 

  useEffect(()=>{
    inputRef.current?.focus()
    axios.post(`${URL}/handleUser/getUsers`)
    .then(res=>{
      const usersData = res.data.filter((item:User)=>item._id !== state._id && !state.joinedChats.includes(item._id))
      setUsers(usersData)
    })
    .catch(err=>console.log(err))
  },[])
  const joinSingleConverastion = (otherUserId:string) => {
    axios.post(`${URL}/handleChat/createSingle`,{userOneId:state._id,userTwoId:otherUserId})
    const refreshedUsersList = users.filter(item=>item._id !== otherUserId)
    setUsers(refreshedUsersList)
    dispatch(changeUserData({...state,joinedChats:[...state.joinedChats,otherUserId]}))
  }
  const handleSerachChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }
  return (
        <section className="absoluteContainer">
            <div className="searchContainer">
                <button className="closeBtn" onClick={()=>setSearch(false)}><img src="/Images/delete.svg"/></button>
                <h1>Search for your friends and groups!</h1>
                <input className="search" ref={inputRef} placeholder="Search by id or name..."
                value={searchInput} onChange={handleSerachChange}/>
                <h2>Single Chats</h2>
                <div className="chatContainer">
                  {users.map(item=>{
                    return (
                      <div key={item._id}>
                        <img src={item.imgSmall === ""?"/Images/default.jpg":item.imgSmall}/>
                        <p>{item.name} {item.surname}</p>
                        <button onClick={()=>joinSingleConverastion(item._id)}>ADD</button>
                      </div>
                      )
                  })}
                </div>
                <h2>Group Chats</h2>
                <div className="chatContainer">
                  <div></div>
                </div>
            </div>
  </section>)
}

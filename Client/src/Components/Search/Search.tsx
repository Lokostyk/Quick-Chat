import "./search.scss"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { URL } from "../../databaseUrl"

interface Users {
  _id:string,
  name:string,
  surname:string,
  imgSmall:string
}
export default function Search({setSearch,currentUserId}:{setSearch:React.Dispatch<React.SetStateAction<boolean>>,currentUserId:string}) {
  let inputRef = useRef<HTMLInputElement>(null)
  const [users,setUsers] = useState<Users[]>([])
  const [searchInput,setSearchInput] = useState("")  

  useEffect(()=>{
    inputRef.current?.focus()
    axios.post(`${URL}/handleUser/getUsers`)
    .then(res=>{
      const usersData = res.data.filter((item:Users)=>item._id !== currentUserId)
      setUsers(usersData)
    })
    .catch(err=>console.log(err))
  },[])
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
                        <button>ADD</button>
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

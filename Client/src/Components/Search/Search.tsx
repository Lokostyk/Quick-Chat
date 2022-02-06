import "./search.scss"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Search({setSearch}:{setSearch:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [users,setUsers] = useState()  
  useEffect(()=>{
    
  })
  return (
        <section className="absoluteContainer">
            <div className="searchContainer">
                <button className="closeBtn" onClick={()=>setSearch(false)}><img src="/Images/delete.svg"/></button>
                <h1>Search for your friends and groups!</h1>
                <input />
            </div>
  </section>)
}

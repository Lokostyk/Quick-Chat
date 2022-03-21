import "./createGroup.scss"
import FirstPlanWindow from "../HigherOrderComponents/firstPlanWindow"
import { useState } from "react"
import { useAppSelector } from "../../App/hooks"
import axios from "axios"
import {URL} from "../../databaseUrl"

interface groupData {
    userOneId:string,
    groupName:string,
    isPrivate: boolean
}
export default function CreateGroup({setCreateGroup}:{setCreateGroup:React.Dispatch<React.SetStateAction<boolean>>}) {
  const state = useAppSelector(state=>state.userSlice) 
  const [groupData,setGroupData] = useState<groupData>({userOneId:state._id,groupName:"",isPrivate:false})

  const createGroup = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    axios.post(`${URL}/handleChat/createGroup`,groupData)
    setGroupData({...groupData,groupName:"",isPrivate:false})
  }
  return (
    <FirstPlanWindow setShowWindow={setCreateGroup}>
        <h1 data-testid="createGroupTitle">Create Group</h1>
        <hr />
        <form onSubmit={(e)=>createGroup(e)}>
            <h2>Group Name</h2>
            <input value={groupData.groupName} data-testid="groupNameInput"
            onChange={(e)=>setGroupData({...groupData,groupName:e.target.value})} max={25} required/>
            <h2>Private</h2>
            <input type="checkbox" checked={groupData.isPrivate} 
            onChange={()=>setGroupData({...groupData,isPrivate:!groupData.isPrivate})}/>
            <input type="submit" value="Create"/>
        </form>
    </FirstPlanWindow>
  )
}

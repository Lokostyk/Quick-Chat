import { Loader } from '../SharedComponents/sharedComponents'
import './defaultChatWindow.scss'

export default function DefaultChatWindow({loader = false}:{loader?:boolean}) {
  return (<div className='DefaultChatContainer'>
      <div className='topBar'></div>
      <div className='middleContent'>
        {loader?
          <Loader />:
          <>
            <img src='./Images/conversation.svg'/>
            <h2>1. Add friend/-s (top left corner)</h2>
            <h2>2. Open chat (Single/Group Chat section)</h2>
            <h2 style={{marginTop:".4rem"}}>Chat freely wherever and whenever YOU like !!</h2>
          </>}
        </div>
      <div className='bottomBar'></div>
  </div>)
}

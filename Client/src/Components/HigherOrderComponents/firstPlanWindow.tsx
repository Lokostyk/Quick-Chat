import "./hoc.style.scss"
import React from 'react'

export default function FirstPlanWindow({children,setShowWindow}:{children:React.ReactNode,setShowWindow:React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <section className="absoluteContainer">
        <div className="componentsContainer">
                <button className="closeBtn" onClick={()=>setShowWindow(false)} data-testid="closeWindow"><img src="/Images/delete.svg"/></button>
            {children}
        </div>
    </section>    
  )
}

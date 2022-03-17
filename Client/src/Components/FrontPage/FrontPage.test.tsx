import { fireEvent, render,screen} from "@testing-library/react"
import {BrowserRouter} from "react-router-dom"

import FrontPage from "./FrontPage"

const MockFrontPage = () => {
    return (
    <BrowserRouter>
        <FrontPage />
    </BrowserRouter>)
}
describe("FrontPage component tests",()=>{
    it("After clicking 'Login' page changes",async ()=>{
        render(<MockFrontPage />)
        const LoginBtn = screen.getByRole('link', {name: /login/i})

        fireEvent(LoginBtn,new MouseEvent("click",{bubbles: true,cancelable: true,}))
        expect(window.location.pathname).toBe("/login")
    })
    it("After clicking 'Register' page changes",async ()=>{
        render(<MockFrontPage />)
        const LoginBtn = screen.getByRole('link', {name: /register/i})
        
        fireEvent(LoginBtn,new MouseEvent("click",{bubbles: true,cancelable: true,}))
        expect(window.location.pathname).toBe("/register")
    })
})
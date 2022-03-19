import { fireEvent, render,screen, waitFor} from "@testing-library/react"
import axios from "axios"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import {store} from "../../App/store"

import Login from "./Login"

jest.mock("axios")

const MockEnv = ({children}:{children:JSX.Element}) => <BrowserRouter><Provider store={store}>{children}</Provider></BrowserRouter>
const checkInput = (placeholder:string) => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement

    fireEvent.change(input,{target:{value:"test"}})

    expect(input.value).toBe("test")
}
describe("Login component tests",()=>{
    it("Test if all inputs render text",()=>{
        render(<MockEnv><Login /></MockEnv>)
        checkInput("E-mail")
        checkInput("Password")
    })
    it("'Sign in' button has proper href",()=>{
        render(<MockEnv><Login /></MockEnv>)
        const button = screen.getByTestId("registerBtn")
        
        expect(button.getAttribute("href")).toBe("/register")
    })
    
    it("Test wrong user login passed",async ()=>{
        (axios.post as jest.Mock).mockResolvedValue({data:''})
        render(<MockEnv><Login /></MockEnv>)
        const loginInput = screen.getByPlaceholderText(/e-mail/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const loginBtn = screen.getByRole('button', {  name: /log in/i})

        fireEvent.change(loginInput,{target:{value:"test@gmail.pl"}})
        fireEvent.change(passwordInput,{target:{value:"wrong"}})
        fireEvent.click(loginBtn)

        const alert = await screen.findByText(/wrong email or password!/i)
        expect(alert).toBeTruthy()
    })
    it("Test correct user login",async ()=>{
        (axios.post as jest.Mock).mockResolvedValue({data:'works'})
        render(<MockEnv><Login /></MockEnv>)
        const loginInput = screen.getByPlaceholderText(/e-mail/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const loginBtn = screen.getByRole('button', {  name: /log in/i})

        fireEvent.change(loginInput,{target:{value:"test@gmail.pl"}})
        fireEvent.change(passwordInput,{target:{value:"working"}})
        fireEvent.click(loginBtn)

        await waitFor(()=>{
            expect(window.localStorage.getItem("authToken")).toBeTruthy()
        })
    })
})
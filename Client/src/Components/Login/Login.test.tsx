import { fireEvent, render,screen} from "@testing-library/react"
import axios from "axios"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import {store} from "../../App/store"

import Login from "./Login"

jest.mock('axios')

const fetchUserLogin = {

}
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
})
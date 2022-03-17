import { fireEvent, render,screen} from "@testing-library/react"

import Register from "./Register"

describe("Register component tests",()=>{
    it("Check if all input fileds and register button are rendered",()=>{
        render(<Register />)
        const allInput = screen.getAllByLabelText("register-input")
        const signInBtn = screen.getByRole('button', {name: /sign in/i})
        
        expect(allInput.length).toBe(5)
        expect(signInBtn).toBeTruthy()
    })
    it("After clicking 'Log in' page changes",()=>{
        render(<Register/>)
        const LoginLink = screen.getByText(/log in/i)

        fireEvent.click(LoginLink)
        
        // expect(window.location).toBe("/login")
    })
})
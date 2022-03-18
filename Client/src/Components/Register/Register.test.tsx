import { fireEvent, render,screen} from "@testing-library/react"

import Register from "./Register"

const inputTextTest = (placeholder:string) => {
    const inputElement = screen.getByPlaceholderText(placeholder) as HTMLInputElement
    fireEvent.volumeChange(inputElement,{target:{value:"test"}})
    expect(inputElement.value).toBe("test")
}
describe("Register component tests",()=>{
    it("Test if text passed to input field is displayed",()=>{
        render(<Register/>)
        inputTextTest("Password")
        inputTextTest("Surname")
        inputTextTest("E-mail")
        inputTextTest("Password")
        inputTextTest("Repeat password")
    })
    it("Check if input button is rendered",()=>{
        render(<Register />)
        const signInBtn = screen.getByRole('button', {name: /sign in/i})
        
        expect(signInBtn).toBeTruthy()
    })
    it("'Log in' button has proper href",()=>{
        render(<Register/>)
        const LoginLink = screen.getByTestId("loginBtn")
        
        expect(LoginLink.getAttribute("href")).toBe('/login')
    })
})
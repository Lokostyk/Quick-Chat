import { fireEvent, render,screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "../../App/store";

import AccountSettings from "./AccountSettings";

//Mocking useAppSelector (redux state) & axios
const mockUserData = {
    _id:"2",
    name:"Ron",
    surname:"Jonson",
    email:"Jonson@test.pl",
    imgSmall:"testSmall.png",
    imgBig:"testBig.png",
    joinedChats: []
}
jest.mock("../../App/hooks",()=> ({
    ...jest.requireActual("../../App/hooks"),
    useAppDispatch: ()=>{},
    useAppSelector: () => mockUserData
}))
jest.mock('axios')

describe("AccountSettings component tests",()=>{
    beforeEach(()=>{
        render(<Provider store={store}><AccountSettings setAccountSettings={{} as React.Dispatch<React.SetStateAction<boolean>>}/></Provider>)
    })
    it("Test if image is rendered",()=>{
        const image = screen.getByAltText(/profile picture/i)

        expect(image.getAttribute("src")).toBe("testBig.png")
    })
    it("Check name and surname inputs render",()=>{
        const inputName:HTMLInputElement = screen.getByTestId("inputName")
        const inputSurname:HTMLInputElement = screen.getByTestId("inputSurname")

        expect(inputName.value).toBe("Ron")
        expect(inputSurname.value).toBe("Jonson")
    })
    it("Check e-mail and password inputs render",()=>{
        const inputEmail:HTMLInputElement = screen.getByTestId("inputEmail")
        const inputPasswordEmail:HTMLInputElement = screen.getByPlaceholderText("Password")

        expect(inputEmail.value).toBe("Jonson@test.pl")
        expect(inputPasswordEmail.value).toBe("")
    })
    it("Check password inputs render",()=>{
        const inputPasswordOne:HTMLInputElement = screen.getByPlaceholderText(/old password/i)
        const inputPasswordTwo:HTMLInputElement = screen.getByPlaceholderText(/new password/i)

        expect(inputPasswordOne.value).toBe("")
        expect(inputPasswordTwo.value).toBe("")
    })
    it("Check all buttons render",()=>{
        const saveBtn = screen.getByRole('button', {  name: /save/i})
        const changeEmailBtn = screen.getByRole('button', {  name: /change email/i})
        const changePasswordBtn = screen.getByRole('button', {  name: /change password/i})

        expect(saveBtn).toBeVisible()
        expect(changeEmailBtn).toBeVisible()
        expect(changePasswordBtn).toBeVisible()
    })
    it("Check if id is displayed correctly",()=>{
        const id = screen.getByTestId("userId")

        expect(id).toHaveTextContent("2")
    })
})
import { fireEvent, render,screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "../../App/store";

import CreateGroup from "./CreateGroup";

jest.mock('axios')
jest.mock("../../App/hooks",()=>({
    useAppSelector: ()=>({_id:"test"})
}))

describe("CreateGroup component tests",()=>{
    beforeEach(()=>{
        render(<Provider store={store}><CreateGroup setCreateGroup={{} as React.Dispatch<React.SetStateAction<boolean>>}/></Provider>)
    })
    it("Test ceating group functionality",()=>{
        const txtInput = screen.getByTestId("groupNameInput")
        const checkbox:HTMLInputElement = screen.getByRole('checkbox')
        const createBtn = screen.getByRole('button', {  name: /create/i})

        fireEvent.change(txtInput,{target:{value:"Test"}})
        fireEvent.click(checkbox)
        expect(checkbox.checked).toBe(true)
        fireEvent.click(createBtn)

        expect(txtInput).toHaveTextContent("")
        expect(checkbox.checked).toBe(false)
    })
})
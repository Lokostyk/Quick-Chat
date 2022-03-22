import { screen,render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"

import ChatSettings from "./ChatSettings";

//Mocking useAppSelector (redux state) & axios
const mockUserData = {
    _id:"3",
    name:"Bob",
    surname:"Smith",
    email:"",
    password: "",
    imgSmall:"testSmall.png",
    imgBig:"",
    joinedChats: ['1']
}
jest.mock("../../../App/hooks",()=> ({
    ...jest.requireActual("../../../App/hooks"),
    useAppDispatch: ()=>{},
    useAppSelector: () => mockUserData
}))
jest.mock("axios")

const mockPublicChatData = {
  _id:"1",
  groupName: "Best Coders",
  users: ["3","4"],
  messages: [],
  isPrivate: false
}
const mockPrivateChatData = {
  _id:"1",
  groupName: "Best Coders",
  users: ["3","4"],
  messages: [],
  isPrivate: true
}
const mockOtherUsersData = [
{
  _id:"3",
  name:"Bob",
  surname:"Smith",
  imgSmall:"testSmall.png",
  joinedChats: ["1"]
},
{
  _id:"4",
  name:"Saint",
  surname:"Motel",
  imgSmall:"testSmall.png",
  joinedChats: ["1"]
}
]
describe("ChatSettings component tests",()=>{
    it("Check if all group members render",()=>{
        render(<ChatSettings chatData={mockPublicChatData} otherUsersData={mockOtherUsersData}/>)
        const users = screen.getAllByTestId("userContainer")

        expect(users.length).toBe(2)
    })
    it("Check if user with privilegas can delete other users",()=>{
        render(<ChatSettings chatData={mockPublicChatData} otherUsersData={mockOtherUsersData}/>)
        const deleteBtn = screen.getAllByTestId("deleteBtn")

        deleteBtn.forEach(btn=>{
            expect(btn).toBeInTheDocument()
        })
    })
    it("Check if user wihtout an admin privilegas can delete other users",()=>{
        mockOtherUsersData[0]._id = "5"
        render(<ChatSettings chatData={mockPublicChatData} otherUsersData={mockOtherUsersData}/>)
        
        expect(()=>screen.getByTestId("deleteBtn")).toThrow()
    })
    it("Check if add section renders when group is private",()=>{
        render(<ChatSettings chatData={mockPrivateChatData} otherUsersData={mockOtherUsersData}/>)
        const addBtn = screen.getByRole('button', {  name: /add/i})
        const input = screen.getByPlaceholderText(/add user by id/i)

        expect(addBtn).toBeInTheDocument()
        expect(input).toBeInTheDocument()
    })
    it("Check if after clicking 'ADD' button in private section input clears",()=>{
        render(<ChatSettings chatData={mockPrivateChatData} otherUsersData={mockOtherUsersData}/>)
        const addBtn = screen.getByRole('button', {  name: /add/i})
        const input:HTMLInputElement = screen.getByPlaceholderText(/add user by id/i)

        fireEvent.change(input,{target:{value:"long id"}})
        expect(input.value).toBe("long id")
        fireEvent.click(addBtn)

        expect(input.value).toBe("")
    })
    it("Check if 'Leave Conversation' button renders",()=>{
        render(<ChatSettings chatData={mockPublicChatData} otherUsersData={mockOtherUsersData}/>)
        const leaveBtn = screen.getByText(/leave conversation/i)

        expect(leaveBtn).toBeInTheDocument()
    })
})
import { screen,render } from "@testing-library/react";
import { fetchedChatData } from "../../MainHub/MainHub";
import "@testing-library/jest-dom"

import Messages from "./Messages";

//Mocking useAppSelector (redux state)
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

const mockMessages = [
{
  userId:"3",
  message:"Hello from Bob",
  messageId:"w21da"
},
{
  userId:"4",
  message:"Hi",
  messageId:"42a1"
},
{
  userId:"3",
  message:"How are you?",
  messageId:"wda212"
}
]
const mockOtherUsersData = [
{
    _id:"4",
    name:"Saint",
    surname:"Motel",
    imgSmall:"testSmall.png",
    joinedChats: ["1"]
},
{
    _id:"3",
    name:"Bob",
    surname:"Smith",
    imgSmall:"testSmall.png",
    joinedChats: ["1"]
},
]
describe("Messages component tests",()=>{
    beforeEach(()=>{
        render(<Messages messages={mockMessages} otherUsersData={mockOtherUsersData} chatData={{} as fetchedChatData} loadMoreMessages={{} as (node:HTMLDivElement)=>void}/>)
    })
    it("Test if messages render",()=>{
        const messages = screen.getAllByTestId(/message/i)

        expect(messages.length).toBe(3)
    })
    it("Messages have correct values",()=>{
        const messageOne = screen.getByTestId("message-w21da")
        const messageTwo = screen.getByTestId("message-42a1")

        //Test name
        expect(messageOne).toHaveTextContent("Bob Smith")
        //Test message text
        expect(messageOne).toHaveTextContent("Hello from Bob")
        expect(messageTwo).toHaveTextContent("Saint Motel")
        expect(messageTwo).toHaveTextContent("Hi")
    })
})
import { fireEvent, render,screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Pusher from "pusher-js/types/src/core/pusher"
import "@testing-library/jest-dom"

import ChatWindow from "./ChatWindow";

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
jest.mock("../../App/hooks",()=> ({
    ...jest.requireActual("../../App/hooks"),
    useAppDispatch: ()=>{},
    useAppSelector: () => mockUserData
}))
jest.mock('axios')

const mockChatData = {
  _id:"1",
  groupName: "Code Masters",
  users: ["5","3","6"],
  messages: [],
  isPrivate: false
}
const mockOtherUsersData = [
{
    _id:"5",
    name:"Caravan",
    surname:"Palace",
    imgSmall:"testSmall.png"
},
{
    _id:"6",
    name:"Fox",
    surname:"Stevenson",
    imgSmall:"testSmall.png"
},
]
describe("ChatWindow component tests",()=>{
    beforeEach(async ()=>{
        //Mocking axios calls
        (axios.post as jest.Mock).mockResolvedValueOnce({data:{messages:[]}});
        (axios.post as jest.Mock).mockResolvedValueOnce({data:mockOtherUsersData});
        //Mocking scroll
        window.HTMLDivElement.prototype.scroll = ()=>{}
        //Rendering
        render(<ChatWindow socket={{ subscribe: (channel_name: string) => ({ bind: () => { } }), unsubscribe: (channel_name: string) => { } } as unknown as Pusher} chatData={mockChatData}/>)
        //Waiting for component to render after all axios calls
        await waitFor(()=>{
            expect(screen.getByTestId("chatName")).toHaveTextContent("Code Masters")
        })
    })
    it("Chek if group name renders",async ()=>{
        const chatName = await screen.findByTestId("chatName")

        await waitFor(()=>{
            expect(chatName).toHaveTextContent("Code Masters")
        })
    })
    it("Check message sending funcionality",async ()=>{
        const input:HTMLInputElement = screen.getByPlaceholderText(/send a message.../i)
        const sendBtn = screen.getByTestId("sendBtn")

        expect(input.value).toBe("")
        fireEvent.change(input,{target:{value:"Hello"}})
        expect(input.value).toBe("Hello")
        fireEvent.click(sendBtn)
        expect(input.style.height).toBe("1.95rem")
        expect(input.value).toBe("")
    })
})
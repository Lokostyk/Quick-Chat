import { screen,render, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom"

import MainHub from "./MainHub";

//Mocking useAppSelector (redux state) & axios
const mockUserData = {
    _id:"3",
    name:"Bob",
    surname:"Smith",
    email:"",
    password: "",
    imgSmall:"testSmall.png",
    imgBig:"",
    joinedChats: ['1','2','4','5']
}
jest.mock("../../App/hooks",()=> ({
    ...jest.requireActual("../../App/hooks"),
    useAppDispatch: ()=>{},
    useAppSelector: () => mockUserData
}))
jest.mock('axios')
jest.mock('pusher-js')

const mockSingleConversations = [
{
  _id:"1",
  name:"Juan",
  surname:"Score",
  imgSmall:"testSmall.png",
  joinedChats:["3"] 
},
{
  _id:"2",
  name:"Elise",
  surname:"Preach",
  imgSmall:"testSmall.png",
  joinedChats:["3"] 
}
]
const mockGroupCoversations = [
{
  _id:"4",
  groupName: "Two Door Cinema Club",
  users: ["3","2"],
  messages: [],
  isPrivate: false
},
{
  _id:"5",
  groupName: "The Offspring",
  users: ["3","2"],
  messages: [],
  isPrivate: true
}
]
const fetchedChatData = {
  _id:"10",
  users: ['3','1'],
  messages: [],
  isPrivate: false
}
describe("MainHub component tests",()=>{
    beforeEach(async ()=>{
        (axios.post as jest.Mock).mockResolvedValueOnce({data:mockSingleConversations});
        (axios.post as jest.Mock).mockResolvedValueOnce({data:mockSingleConversations});
        (axios.post as jest.Mock).mockResolvedValueOnce({data:fetchedChatData});
        (axios.post as jest.Mock).mockResolvedValueOnce({data:{messages:[]}});
        (axios.post as jest.Mock).mockResolvedValueOnce({data:mockSingleConversations[0]});
        //Mocking scroll
        window.HTMLDivElement.prototype.scroll = ()=>{}

        render(<MainHub/>)
        //Await all async calls
        await waitFor(()=>{
            expect(screen.getByText("Juan Score")).toBeInTheDocument()
        })
    })
    it("Test chat change",async ()=>{
        const allSingle = screen.getAllByTestId("singleTiles")
        const allGroup = screen.getAllByTestId("groupTiles")

        expect(allSingle.length).toBe(2)
        expect(allGroup.length).toBe(2)
        expect(allSingle[0]).toHaveTextContent("Juan Score")
        fireEvent.click(allSingle[0])
        const chatName = await screen.findByTestId("chatName")

        expect(chatName).toHaveTextContent("Juan Score")
    })
})
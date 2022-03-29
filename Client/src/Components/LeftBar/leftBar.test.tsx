import { fireEvent, render,screen, waitFor} from "@testing-library/react"
import { store } from "../../App/store"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import axios from "axios"
import "@testing-library/jest-dom"

import LeftBar from "./LeftBar"
import { MessagesType } from "../MainHub/MainHub"

//Mocking useAppSelector (redux state) & axios
const mockUserData = {
    _id:"2",
    name:"Ron",
    surname:"Jonson",
    email:"",
    password: "",
    imgSmall:"fakeImg.png",
    imgBig:"",
    joinedChats: []
}
jest.mock("../../App/hooks",()=> ({
    ...jest.requireActual("../../App/hooks"),
    useAppDispatch: ()=>{},
    useAppSelector: () => mockUserData
}))
jest.mock("axios")

const mockFetchedSingleConversations = [
{
  _id:"1",
  name: "Tom",
  surname: "Smith",
  imgSmall: "img",
},
{
  _id:"2",
  name: "Bob",
  surname: "Star",
  imgSmall: "img",
},
]
const mockFetchedGroupConversations = [
{
  _id:"3",
  groupName: "Tom's Group",
  users: ["users Ids"],
  messages: [{} as MessagesType],
  isPrivate: false
},
{
  _id:"4",
  groupName: "Bob's Group",
  users: ["users Ids"],
  messages: [{} as MessagesType],
  isPrivate: true
},
]
describe("LeftBar component tests",()=>{
    beforeAll(()=>{
        //Mocking window.location.reload()
        Object.defineProperty(window, 'location', {
        configurable: false,
        value: { reload: ()=>{
            location.pathname = "http://localhost:3000"
        }},
    });

    })
    beforeEach(()=>{
        (axios.post as jest.Mock).mockResolvedValue({data:[]})
        render(
        <BrowserRouter>
            <Provider store={store}>
                <LeftBar 
                    singleConversations={mockFetchedSingleConversations} 
                    groupConversations={mockFetchedGroupConversations}
                    setChosenChat={{} as React.Dispatch<React.SetStateAction<{userOneId: string;userTwoId: string;}>>}/>
            </Provider>
        </BrowserRouter>)
    })
    it("Testing openning and closing search window after focusing search input",async ()=>{
        const input = screen.getByPlaceholderText(/add single\/group chat\.\.\./i)

        fireEvent.focus(input)
        const searchTitle = screen.getByTestId('searchTitle')
        await waitFor(()=>{
            expect(searchTitle).toBeVisible()
        })
        const closeWindowBtn = screen.getByTestId("closeWindow")
        fireEvent.click(closeWindowBtn)

        expect(searchTitle).not.toBeVisible()
    })
    it("Testing openning and closing create group window after clicking plus button",()=>{
        const addGroupBtn = screen.getByTestId("addGroupBtn")
        
        fireEvent.click(addGroupBtn)
        const createGroupTitle = screen.getByTestId("createGroupTitle")
        expect(createGroupTitle).toBeVisible()
        const closeWindowBtn = screen.getByTestId("closeWindow")
        fireEvent.click(closeWindowBtn)

        expect(createGroupTitle).not.toBeVisible()
    })
    it("Check if single and group chats tiles are rendered",()=>{
        const singleChatTiles = screen.getByText(/Tom Smith/i)
        const groupChatTiles = screen.getByText(/Tom's Group/i)

        expect(singleChatTiles).toBeTruthy()
        expect(groupChatTiles).toBeTruthy()
    })
    it("Test if multiple groups and single chats tiles are rendered",()=>{
        const allSingleChatTiles = screen.getAllByTestId("singleTiles")
        const allGroupChatTiles = screen.getAllByTestId("groupTiles")

        expect(allSingleChatTiles.length).toBe(2)
        expect(allGroupChatTiles.length).toBe(2)
    })
    it("Check if users name and image are rendered",()=>{
        const userFullName = screen.getByText(/Ron Jonson/i)
        const userPhotoPreview = screen.getByTestId("userImagePreview")
        
        expect(userFullName).toBeTruthy()
        expect(userPhotoPreview.getAttribute("src")).toBe("fakeImg.png")
    })

    describe("Testing Lefbar settings",()=>{
        it("Check oppening and closing of settings window",()=>{
            const settingsBtn = screen.getByTestId("settingsButton")

            fireEvent.click(settingsBtn)
            const settingsWindow = screen.getByTestId("settingsWindow")

            expect(settingsWindow).toBeVisible()
        })
        it("Testing openning and closing accout settings window",()=>{
            const accoutSettingsBtn = screen.getByRole('button', {  name: /account settings/i})

            fireEvent.click(accoutSettingsBtn)
            const accoutSettingHeading = screen.getByRole('heading', {  name: /account settings/i})
            expect(accoutSettingHeading).toBeVisible()
            const closeAccoutSettingsBtn = screen.getByTestId("closeWindow") 
            fireEvent.click(closeAccoutSettingsBtn)

            expect(accoutSettingHeading).not.toBeVisible()
        })
        it("Link changes,local storage is cleard after clicking 'Log out' button",()=>{
            window.location.pathname = "http://localhost:3000/logged"
            window.localStorage.setItem("authToken","secret")
            const logOutBtn = screen.getByRole('button', {  name: /log out/i})

            fireEvent.click(logOutBtn)

            expect(window.location.pathname).toBe("http://localhost:3000")
            expect(window.localStorage.length).toBe(0)
        })
    })
})
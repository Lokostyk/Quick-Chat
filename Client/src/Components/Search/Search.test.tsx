import { fireEvent, render,screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import axios from "axios";
import { Provider } from "react-redux";

import Search from "./Search";
import { store } from "../../App/store";

//Mocking useAppSelector (redux state) & axios
const mockUserData = {
    _id:"2",
    name:"Ron",
    surname:"Jonson",
    email:"",
    password: "",
    imgSmall:"fakeImg.png",
    imgBig:"",
    joinedChats: ["6","10"]
}
jest.mock("../../App/hooks",()=> ({
    ...jest.requireActual("../../App/hooks"),
    useAppDispatch: ()=>()=>{},
    useAppSelector: () => mockUserData
}))
jest.mock("axios")

const fetchedUsers = [
{
  _id:"3",
  name:"Mark",
  surname:"Clark",
  imgSmall:"test"
},
{
  _id:"5",
  name:"Bob",
  surname:"Wash",
  imgSmall:"test"
},
{
  _id:"6",
  name:"Html",
  surname:"Css",
  imgSmall:"test"
},
]
const fetchedGroups = [
{
  _id:"10",
  groupName:"Best Programmers",
  users: []
},
{
  _id:"12",
  groupName:"Best Divers",
  users: []
},
{
  _id:"13",
  groupName:"Football Squad",
  users: []
}
]
describe("Search component tests",()=>{
    beforeEach(async ()=>{
        (axios.post as jest.Mock).mockResolvedValueOnce({data:fetchedUsers});
        (axios.post as jest.Mock).mockResolvedValueOnce({data:fetchedGroups});
        render(<Provider store={store}><Search setSearch={{} as React.Dispatch<React.SetStateAction<boolean>>}/></Provider>)
        //Check if fetchin is done
        await waitFor(()=>{
            expect(screen.getByText(/Best Divers/i)).toBeInTheDocument()
        })
    })
    it("Test if specific user is render with image preview",()=>{
        const userFullName = screen.getByText(/Mark Clark/i)
        const imgPreview = userFullName.previousElementSibling

        expect(userFullName).toBeInTheDocument()
        expect(imgPreview?.getAttribute("src")).toBe("test")
    })
    it("Check if users and groups are fetched and rendered",()=>{
        const allUserChats = screen.getAllByTestId("singleChat")
        const allGroupChats = screen.getAllByTestId("groupChat")

        expect(allUserChats.length).toBe(2)
        expect(allGroupChats.length).toBe(2)
    })
    it("Check search bar",async()=>{
        const searchBar = screen.getByPlaceholderText(/search by id or name.../i)

        fireEvent.change(searchBar,{target:{value:"Mark"}})
        const userOne = await screen.findAllByTestId("singleChat")

        expect(userOne.length).toBe(1)
        expect(userOne[0]).toHaveTextContent("Mark Clark")
    })
    it("Test users and groups adding option",()=>{
        const allAddBtns = screen.getAllByText("ADD")

        allAddBtns.forEach((btn)=>{
            fireEvent.click(btn)
        })
        const lackOfChats = screen.getAllByText(/We ranned out of/i) 
        
        expect(lackOfChats.length).toBe(2)
    })
})
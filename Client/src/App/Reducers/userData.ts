import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface UserData {
    _id:string
    name:string,
    surname:string,
    email:string,
    password: string,
}

const initialState:UserData = {
    _id:"",
    name:"",
    surname:"",
    email:"",
    password: "",
}

const userSlice = createSlice({
    name:"userData",
    initialState,
    reducers: {
        changeUserData:(state,action: PayloadAction<UserData>)=>{
            return action.payload
        }
    }
})

export const {changeUserData} = userSlice.actions

export default userSlice.reducer
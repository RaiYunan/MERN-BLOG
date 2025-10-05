import { createSlice } from "@reduxjs/toolkit";

const initialState={
    category:{

    }
}

export const catgeorySlice=createSlice({
    name:"category",
    initialState,
    reducers:{
        setCatgeory:(state,action)=>{
            const payload=action.payload
            state.category=payload
        },
        removeCategory:(state,action)=>{
            state.category={}
        }
    }
})

export const {setCatgeory,removeCategory}=catgeorySlice.actions

export default catgeorySlice.reducer
import {createSlice} from "@reduxjs/toolkit"


const categorySlice = createSlice({
    name:"category",
    initialState:{
        categories: [],
        totalCategories: 0,
    },
    reducers:{
        setCategories: (state, action) =>{
            state.categories = action.payload;
        },
        setTotalCategories: (state, action) =>{
            state.totalCategories = action.payload;
        }
    }
})

export const {setCategories, setTotalCategories} = categorySlice.actions
export default categorySlice.reducer
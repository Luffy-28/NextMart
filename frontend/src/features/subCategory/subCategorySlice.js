import { createSlice  } from "@reduxjs/toolkit";

const subCategory = createSlice({
    name:"subCategory",
    initialState:{
        subCategories:[],
        totalSubCategories:0,
    },
    reducers:{
        setSubCategories:(state, action) =>{
            state.subCategories = action.payload;
        },
        setTotalSubCategories:(state, action) =>{
            state.totalSubCategories = action.payload;
        }
    }
})

export const {setSubCategories, setTotalSubCategories} = subCategory.actions;
export default subCategory.reducer;
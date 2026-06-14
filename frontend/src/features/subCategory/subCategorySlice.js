import { createSlice  } from "@reduxjs/toolkit";

const subCategory = createSlice({
    name:"subCategory",
    initialState:{
        subCategories:[],
        totalSubCategories:0,
        loading: false,
    },
    reducers:{
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSubCategories:(state, action) =>{
            state.subCategories = action.payload;
        },
        setTotalSubCategories:(state, action) =>{
            state.totalSubCategories = action.payload;
        }
    }
})

export const {setSubCategories, setTotalSubCategories, setLoading} = subCategory.actions;
export default subCategory.reducer;
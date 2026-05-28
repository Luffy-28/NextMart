import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState:{
        products:[],
        categories:[],
        subCategories:[],
        minPrice: 0,
        maxPrice: 0,
        rating:0,
        search:null,
        pagination:{
            currentPage:1,
            totalPages:1,
            totalItems:0,
            limit:10
        }  
    },
    reducers:{
        setProducts:(state,action) =>{
            state.products = action.payload;
        },
        setPagination:(state,action) =>{
            state.pagination.currentPage = action.payload.currentPage;
            state.pagination.totalPages = action.payload.totalPages;
            state.pagination.totalItems = action.payload.totalItems;
            state.pagination.limit = action.payload.limit;
        },
        setSearch:(state,action) =>{
            state.search = action.payload;
        },
        setCategory:(state,action) =>{
            state.category = action.payload;
        },
        setSubCategory:(state,action) =>{
            state.subCategories = action.payload;
        },
        setMinPrice:(state,action) =>{
            state.minPrice = action.payload;
        },
        setMaxPrice:(state,action) =>{
            state.maxPrice = action.payload;
        },
        setRating:(state,action) =>{
            state.rating = action.payload;
        }
    }
})

export const {setProducts,setPagination,setSearch,setCategory,setSubCategory,setMinPrice,setMaxPrice,setRating} = productSlice.actions;
export default productSlice.reducer;

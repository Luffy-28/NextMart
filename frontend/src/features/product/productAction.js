import { fetchAllProductsApi, getFeaturedProductsApi, getProductByIdApi, getProductsByTagsApi } from "./productApis"
import { setCategory, setMaxPrice, setMinPrice, setPagination, setProducts, setRating, setSearch, setSubCategory } from "./productSlice"



//fetch all products api
export const fetchAllProducts = (page, limit, sort, category, subCategory, minPrice, maxPrice, rating, search) => async(dispatch) =>{
    const data = await fetchAllProductsApi(page, limit, sort, category, subCategory, minPrice, maxPrice, rating, search)
    if(data.status =="success"){
        dispatch(setProducts(data.products))
        dispatch(setPagination(data.pagination))
        dispatch(setMinPrice(data.minPrice))
        dispatch(setMaxPrice(data.maxPrice))
        dispatch(setRating(data.rating))
        dispatch(setCategory(data.category))
        dispatch(setSubCategory(data.subCategory))
        dispatch(setSearch(data.search))
        return data;
    }
}


//get products by tags api
export const getProductsByTags = (tags, page, limit) => async(dispatch)=>{
    const data = await getProductsByTagsApi(tags, page, limit)
    if(data.status == "success"){
        dispatch(setProducts(data.data))
        dispatch(setPagination(data.pagination))
        return data;
    }
}

// get product by ids

export const getProductById = (id) => async(dispatch) =>{
    const data = await getProductByIdApi(id);
    if(data.status =="success"){
       return data; 
    }
}

// get Featured Products
export const getFeatuedProducts =(page, limit) => async(dispatch) =>{
    const data = await getFeaturedProductsApi(page,limit);
    if(data.status == "success"){
        dispatch(setProducts(data.products))
        dispatch(setPagination(data.pagination))
        return data;
    }
}
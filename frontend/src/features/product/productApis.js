
import apiProcessor from "../../helpers/axiosHelper.js";

export const fetchAllProductsApi = async (page=1, limit=10, search ='', category = '', subCategory = '', minPrice = 0, maxPrice = 0, rating = 0) => {
   return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/products?page=${page}&limit=${limit}&search=${search}&category=${category}&subCategory=${subCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&rating=${rating}`,
    method: "GET",
   })
}

export const getProductByIdApi =async (id) =>{
    return apiProcessor({
        url:`{import.meta.env.VITE_ROOT_URL}/api/v1/products/${id}`,
        method: "GET",
    })
}

export const getFeaturedProductsApi = async(page =1, limit=10) =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/products/featured?page=${page}&limit=${limit}`,
        method: "GET",
    })
}

export const getProductsByTagsApi = async(tags, page=1, limit =10) =>{
   return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/products/tags?tags=${tags}&page=${page}&limit=${limit}`,
        method: "GET",
    }) 
}
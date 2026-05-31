import { apiProcessor } from "../../helpers/axiosHelper"



//get cart api
export const fetchCartApi =async() => {
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/carts`,
        method: "GET",
        isPrivate: true,
    })
}

//addto cart api
export const addTOCartApi = async(data) =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/carts/add`,
        method: "POST",
        data: data,
        isPrivate: true,
    })
}


//clear cart api
export const clearCartApi =async() =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/carts/clear`,
        method: "DELETE",
        isPrivate: true,
    })
}



//updatecartapi
export const updateCartApi = async(data) =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/carts/update`,
        method: "PATCH",
        data: data,
        isPrivate: true,
    })
}



//delete item from cart api
export const removeFromCartApi = async(productId) =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/carts/remove/${productId}`,
        method: "DELETE",
        isPrivate: true,
    })
}
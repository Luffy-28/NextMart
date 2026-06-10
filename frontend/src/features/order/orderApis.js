import { isPending } from "@reduxjs/toolkit"
import { apiProcessor } from "../../helpers/axiosHelper"



export const getOrdersApi = async() =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/orders`,
        method: "GET",
        isPrivate: "true"
    })
}
//createOrderApi
export const createOrderApi = async (orderPayload) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/orders/create`,
    method: "POST",
    data: orderPayload,
    isPrivate: true,
  });
}

export const getOrderByIdApi = async(orderId) =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/orders/${orderId}`,
        method: "GET",
        isPrivate: "true"
    })
}

export const cancelOrderApi = async(orderId) =>{
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/orders/cancel/${orderId}`,
        method: "PATCH",
        isPrivate: "true"
    })
}
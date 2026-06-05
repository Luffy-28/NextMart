import { apiProcessor } from "../../helpers/axiosHelper";

//get address

export const getAddressesApi = async() => {
    return apiProcessor({
        url:`${import.meta.env.VITE_ROOT_URL}/api/v1/users/address`,
        method: "GET",
        isPrivate:true,
    })
}

//addaddress
export const addAddressApi = async (address) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/users/addAddress`,
    method: "POST",
    data: { address },
    isPrivate: true,
  });
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



//create payment intent
export const createPaymentIntentApi =async (orderId) =>{
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/payments/create-payment-intent`,
    method: "POST",
    data: { orderId },
    isPrivate: true,
  });
}

// confirm payment status on backend
export const confirmPaymentApi = async (paymentIntentId) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/payments/confirm-payment`,
    method: "POST",
    data: { paymentIntentId },
    isPrivate: true,
  });
};
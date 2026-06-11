import { apiProcessor } from "../../helpers/axiosHelper";

//getallAddress
export const getAllAddressApis = async () => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/users/address`,
    method: "GET",
    isPrivate: true,
  });
};

//createAddress
export const createAddressApis = async (addressPayload) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/users/addAddress`,
    method: "POST",
    isPrivate: true,
    data: addressPayload,
  });
};

//updateAddress
export const updateAddressApis = async (addressId, addressPayload) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/users/address/${addressId}`,
    method: "PATCH",
    isPrivate: true,
    data: addressPayload,
  });
};

//deleteAddress
export const deleteAddressApis = async (addressId) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/users/address/${addressId}`,
    method: "DELETE",
    isPrivate: true,
  });
};

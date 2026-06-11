import {
  createAddressApis,
  deleteAddressApis,
  getAllAddressApis,
  updateAddressApis,
} from "./addressApis";
import { setLoading, setAddress } from "./addressSlice";

// get Address action
export const getAddress = () => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await getAllAddressApis();
  if (data.status === "success") {
    dispatch(setLoading(false));
    dispatch(setAddress(data.data));
    return data;
  }
  dispatch(setLoading(false));
};

//Add address action
export const addAddress = (addressData) => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await createAddressApis(addressData);
  if (data.status === "success") {
    dispatch(setLoading(false));
    dispatch(getAddress());
    return data;
  }
};

//updateAddress action
export const updateAddress = (id, data) => async (dispatch) => {
  dispatch(setLoading(true));
  const response = await updateAddressApis(id, data);
  if (response.status === "success") {
    dispatch(setLoading(false));
    dispatch(getAddress());
    return response;
  }
  dispatch(setLoading(false));
};

//Delete Address Action
export const deleteAddress = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await deleteAddressApis(id);
  if (data.status === "success") {
    dispatch(setLoading(false));
    dispatch(getAddress());
    return data;
  }
  dispatch(setLoading(false));
};

import {
  cancelOrderApi,
  createOrderApi,
  getOrderByIdApi,
  getOrdersApi,
} from "./orderApis";
import {
  setError,
  setloading,
  setOrders,
  setOrderStatus,
  setPaymentStatus,
  setPendingOrderId,
  setPlacedOrder,
} from "./orderSlice";

export const getOrder = () => async (dispatch) => {
  const data = await getOrdersApi();
  if (data.status === "success") {
    dispatch(setOrders(data.data));
    return data;
  }
};

// ── Create order
export const createOrder = (payload) => async (dispatch) => {
  dispatch(setloading(true));
  const data = await createOrderApi(payload);
  dispatch(setloading(false));
  if (data.status === "success") {
    dispatch(setOrderStatus(data.orderStatus));
    dispatch(setPaymentStatus(data.paymentStatus));
    dispatch(setPendingOrderId(data.data._id));
    dispatch(setPlacedOrder(data.data));
    dispatch(getOrder());
    return data;
  }
  dispatch(setError(data.message || "Failed to create order"));
  return data;
};

export const getOrderById = (id) => async (dispatch) => {
  const data = await getOrderByIdApi(id);
  if (data.status === "success") {
    dispatch(setOrders(data.data));
    return data;
  }
};

export const cancelOrder = (id) => async (dispatch) => {
  const data = await cancelOrderApi(id);
  if (data.status === "success") {
    dispatch(getOrder());
    return data;
  }
};

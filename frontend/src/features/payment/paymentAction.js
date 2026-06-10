import {
  setAddresses,
  addAddress,
  setSelectedAddressId,
  setPaymentIntent,
  setPaymentStatus,
  setLoading,
  setError,
  resetPayment,
} from "./paymentSlice.js";
import {
  getAddressesApi,
  addAddressApi,
  createPaymentIntentApi,
  confirmPaymentApi,
} from "./paymentApi.js";

// ── Fetch all saved addresses
export const fetchAddresses = () => async (dispatch) => {
  const data = await getAddressesApi();
  if (data.status === "success") {
    dispatch(setAddresses(data.data));
    // Auto-select default address, or the first one
    const def = data.data.find((a) => a.isDefault) || data.data[0];
    if (def) dispatch(setSelectedAddressId(def._id));
    return data;
  }
};

// ── Save a new address
export const saveAddress = (address) => async (dispatch) => {
  const data = await addAddressApi(address);
  if (data.status === "success") {
    dispatch(addAddress(data.data));
    dispatch(setSelectedAddressId(data.data._id));
    return data;
  }
  return data; // caller handles error toast
};

// ── Create payment intent
export const createPaymentIntent = (orderId) => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await createPaymentIntentApi(orderId);
  dispatch(setLoading(false));
  if (data.status === "success") {
    dispatch(
      setPaymentIntent({
        clientSecret: data.data.clientSecret,
        paymentIntentId: data.data.paymentIntent,
      }),
    );
    return data;
  }
  dispatch(setError(data.message || "Failed to create payment intent"));
  return data;
};

// ── Mark payment as succeeded / failed ───────────────────────────────────────
export const markPaymentSucceeded = (paymentIntentId) => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await confirmPaymentApi(paymentIntentId);
  dispatch(setLoading(false));
  if (data.status === "success") {
    dispatch(setPaymentStatus("succeeded"));
    return data;
  }
  dispatch(setError(data.message || "Failed to confirm payment on backend"));
  return data;
};

export const markPaymentFailed = (msg) => (dispatch) => {
  dispatch(setPaymentStatus("failed"));
  dispatch(setError(msg || "Payment failed"));
};

// ── Reset entire payment state (call after checkout completes) ───────────────
export const clearPaymentState = () => (dispatch) => {
  dispatch(resetPayment());
};

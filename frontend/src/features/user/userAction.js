import {
  loginDataApi,
  userDetailsApi,
  verifyOtpApi,
  resendOtpAPI,
  registerUserApi,
} from "./userApis.js";
import { setUser, setLoading, setError } from "./userSlice.js";

export const loginUser = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await loginDataApi(formData);
    if (data.status === "success") {
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      } else {
        alert("no access token found");
        dispatch(setLoading(false));
        return false;
      }
      const userResponse = await userDetailsApi();
      if (userResponse.status === "success") {
        dispatch(setUser(userResponse.user));
        return true;
      } else {
        dispatch(
          setError(userResponse.message || "Failed to fetch user details"),
        );
        return false;
      }
    } else {
      dispatch(setError(data.message || "Login failed"));
      return false;
    }
  } catch (error) {
    dispatch(setError(error.message || "An error occurred"));
    return false;
  }
};

export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await registerUserApi(formData);
    if (data.status === "success") {
      dispatch(setUser(data.user));
    } else {
      dispatch(setError(data.message || "Registration failed"));
    }
    return data;
  } catch (error) {
    dispatch(setError(error.message || "An error occurred"));
    return { status: "error", message: error.message };
  }
};

export const verifyOtp = (otpData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await verifyOtpApi(otpData);
    if (data.status === "success") {
      dispatch(setUser(data.user));
    } else {
      dispatch(setError(data.message || "OTP verification failed"));
    }
    return data;
  } catch (error) {
    dispatch(setError(error.message || "An error occurred"));
    return { status: "error", message: error.message };
  }
};

export const resendOtp = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await resendOtpAPI(email);
    if (data.status === "success") {
      alert("OTP resent successfully");
      dispatch(setLoading(false));
    } else {
      dispatch(setError(data.message || "Failed to resend OTP"));
    }
    return data;
  } catch (error) {
    dispatch(setError(error.message || "An error occurred"));
    return { status: "error", message: error.message };
  }
};

export const autoLogin = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const userResponse = await userDetailsApi();
      if (userResponse.status === "success") {
        dispatch(setUser(userResponse.user));
      } else {
        dispatch(
          setError(userResponse.message || "Failed to fetch user details"),
        );
      }
    } else {
      dispatch(setLoading(false));
    }
  } catch (error) {
    console.log(error);
  }
};

export const verifyGoogleLoginAction = (googleData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await googleLoginApi(googleData);
    if (response.status === "success") {
      dispatch(setUser(response.data)); 
    } else {
      dispatch(setError(response.message || "Google login failed"));
    }
    return response;
  } catch (error) {
    dispatch(setError(error.message || "An error occurred"));
    return { status: "error", message: error.message };
  }
};

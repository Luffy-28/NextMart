import {
  loginDataApi,
  userDetailsApi,
  verifyOtpApi,
  resendOtpAPI,
  registerUserApi,
  updateProfileApi,
  changePasswordApi,
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
  } finally {
    dispatch(setLoading(false));
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
  } finally {
    dispatch(setLoading(false));
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
  } finally {
    dispatch(setLoading(false));
  }
};

export const resendOtp = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await resendOtpAPI(email);
    if (data.status === "success") {
      alert("OTP resent successfully");
    } else {
      dispatch(setError(data.message || "Failed to resend OTP"));
    }
    return data;
  } catch (error) {
    dispatch(setError(error.message || "An error occurred"));
    return { status: "error", message: error.message };
  } finally {
    dispatch(setLoading(false));
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
    }
  } finally {
    dispatch(setLoading(false));
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

export const updateProfile = (profileData) => async(dispatch) =>{
  try{
    dispatch(setLoading(true));
    const response = await updateProfileApi(profileData);
    if(response.status === "success"){
      dispatch(setUser(response.data));
    }else{
      dispatch(setError(response.message || "Profile update failed"));
    }
    return response;
  }catch(error){
    dispatch(setError(error.message || "An error occurred"));
    return { status: "error", message: error.message };
  }
}
export const changePassword = (pData) => async(dispatch) =>{
   try{
    dispatch(setLoading(true));
    const response = await changePasswordApi(pData);
    if(response.status === "success"){
      alert("Password changed successfully");
      dispatch(setLoading(false));
    }else{
      dispatch(setError(response.message || "Password change failed"));
    }
    return response;
  }catch(error){
    dispatch(setError(error.message || "An error occurred"));
    return { status: "error", message: error.message };
  }
}

import { apiProcessor } from "../../helpers/axiosHelper.js";

export const registerUserApi = async (signUpData) => {
  return await apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/register",
    method: "POST",
    data: signUpData,
  });
};

export const loginDataApi = async (loginUserData) => {
  return await apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/login",
    method: "POST",
    data: loginUserData,
  });
};

export const verifyOtpApi = async (otpData) => {
  return await apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/verify",
    method: "POST",
    data: otpData,
  });
};

export const resendOtpAPI = async (email) => {
  return await apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/resendOtp",
    method: "POST",
    data: { email },
  });
};

export const userDetailsApi = async () => {
  return await apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/users",
    method: "GET",
    isPrivate: true,
  });
};

export const googleLoginApi = async(googleData) =>{
  return await apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/googleVerification",
    method:"POST",
    data:googleData
  })
}

import { redisClient } from "./redisClient.js";
import { config } from "../config/config.js";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const storeOtp = async(email, otp, expirySecond = 300) =>{
    const key = `otp:${email}`
    try {
    // Store OTP with expiry
    await redisClient.setEx(key, expirySecond, otp);
    
    // Also store attempt count
    const attemptKey = `otp_attempts:${email}`;
    await redisClient.setEx(attemptKey, expirySecond, '0');
    
    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  }
}

export const verifyOTP = async (email, otp) => {
  const key = `otp:${email}`;
  const attemptKey = `otp_attempts:${email}`;
  
  try {
    // Get stored OTP
    const storedOTP = await redisClient.get(key);
    
    if (!storedOTP) {
      throw new Error('OTP expired or not found');
    }
    
    // Get attempt count
    let attempts = parseInt(await redisClient.get(attemptKey) || '0');
    
    // Check max attempts (prevent brute force)
    if (attempts >= 5) {
      await deleteOTP(email);
      throw new Error('Maximum verification attempts exceeded');
    }
    
    // Increment attempts
    attempts++;
    await redisClient.set(attemptKey, attempts.toString());
    
    // Verify OTP
    if (storedOTP === otp) {
      // Delete OTP after successful verification
      await deleteOTP(email);
      return true;
    }
    
    return false;
  } catch (error) {
    throw error;
  }
};

export const deleteOTP = async (email) => {
  const key = `otp:${email}`;
  const attemptKey = `otp_attempts:${email}`;
  
  try {
    await redisClient.del(key);
    await redisClient.del(attemptKey);
  } catch (error) {
    console.error('Error deleting OTP:', error);
  }
};
export const otpExists = async (email) => {
  const key = `otp:${email}`;
  
  try {
    const ttl = await redisClient.ttl(key);
    return ttl > 0;
  } catch (error) {
    return false;
  }
};

export const getOTPTTL = async (email) => {
  const key = `otp:${email}`;
  
  try {
    const ttl = await redisClient.ttl(key);
    return ttl > 0 ? ttl : 0;
  } catch (error) {
    return 0;
  }
};
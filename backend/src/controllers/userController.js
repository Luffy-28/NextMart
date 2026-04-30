import { config } from "../config/config.js";
import { sendOTPEmail, sendWelcomeEmail } from "../helpers/emailHelpers.js";
import { compareData, hashPassword } from "../helpers/encryptHelpers.js";
import {
  generateOTP,
  getOTPTTL,
  otpExists,
  storeOtp,
  verifyOTP,
} from "../helpers/otphelper.js";
import { signToken } from "../helpers/tokenHelper.js";
import { User } from "../models/userModel.js";

//Register User
export const registerUser = async (req, res) => {
  try {
    let { newUser } = req.body;
    newUser.password = hashPassword(newUser.password);
    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).send({
          status: "error",
          message: "User already exists with this email",
        });
      } else {
        await User.findByIdAndDelete(existingUser._id);
      }
    }
    const userData = await User.insertOne(newUser);
    if (!userData) {
      return res.status(400).send({
        status: "error",
        message: "Error creating User",
      });
    } else {
      const otp = generateOTP();
      await storeOtp(newUser.email, otp, config.otp.expiry);
      await sendOTPEmail(newUser.email, otp, newUser.name);
      return res.status(201).send({
        status: "success",
        message:
          "Signup successful! Please check your email for the verification code",
        data: {
          email: newUser.email,
          name: newUser.name,
          otpExpiry: config.otp.expiry,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error creating User",
    });
  }
};
// Verify the otp
export const verificationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }
    if (existingUser.isVerified) {
      return res.send({
        status: "error",
        message: "User is already verified",
      });
    }
    const otpMatched = await verifyOTP(email, otp);
    if (!otpMatched) {
      return res.status(400).send({
        status: "error",
        message: "Invalid OTP",
      });
    }
    existingUser.isVerified = true;
    await existingUser.save();

    await sendWelcomeEmail(email, existingUser.name);
    const token = signToken({ email: existingUser.email });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully! Welcome aboard!",
      data: {
        token,
        user: existingUser,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error validating otp",
    });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({
        status: "error",
        message: "user not found",
      });
    }
    if (existingUser.isVerified) {
      return res.status(400).send({
        status: "error",
        message: "User is already verified",
      });
    }
    const exist = await otpExists(email);
    if (exist) {
      const ttl = await getOTPTTL(email);
      return res.status(400).send({
        status: "error",
        message: `OTP already sent.please check you email.try again after ${Math.floor(ttl / 60)} minutes`,
      });
    }
    // Generate new OTP
    const otp = generateOTP();

    await storeOtp(email, otp, config.otp.expiry);

    await sendOTPEmail(email, otp, existingUser.name);

    return res.status(200).send({
      status: "success",
      message: "OTP has been resent to your email",
      data: {
        email,
        otpExpiry: config.otp.expiry,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error resending otp",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ status: "error", message: "..." });
    }
    const userData = await User.findOne({ email });
    if (userData) {
      if (userData.isVerified) {
        const isMatched = compareData(password, userData.password);
        if (isMatched) {
          const payload = { email: userData.email };
          const accessToken = signToken(payload);
          const { password, ...safeUser } = userData.toObject();
          return res.status(200).send({
            status: "success",
            message: "User logged in successfully",
            data: safeUser,
            accessToken,
          });
        } else {
          return res.status(400).send({
            status: "error",
            message: "Invalid email or password",
          });
        }
      } else {
        return res.status(400).send({
          status: "error",
          message: "please verify your account before logging in",
        });
      }
    } else {
      return res.status(400).send({
        status: "error",
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error logging in User",
    });
  }
};
export const getUserDetail = async (req, res) => {
  try {
    return res.status(200).send({
      status: "success",
      message: "User details fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error fetching user details",
    });
  }
};

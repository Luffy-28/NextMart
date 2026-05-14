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
import { OAuth2Client } from "google-auth-library";
import {
  signRefreshToken,
  signToken,
  verifyRefreshToken,
} from "../helpers/tokenHelper.js";
import { User } from "../models/userModel.js";
import { Address } from "../models/addressModel.js";

const client = new OAuth2Client(config.google.clientId);
//Register User
export const registerUser = async (req, res) => {
  try {
    let newUser = req.body;
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
// REFRESH TOKEN
export const generateAccessTokens = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization;

    const data = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ email: data.email });
    if (user) {
      const payload = { email: user.email };
      const accessToken = signToken(payload);
      return res.send({
        status: "success",
        message: "Access Token generated successfully",
        accessToken,
      });
    } else {
      return res.send({
        status: "error",
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error generting access token",
    });
  }
};

//Login USER
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
          const refreshToken = signRefreshToken(payload);
          const { password, ...safeUser } = userData.toObject();
          return res.status(200).send({
            status: "success",
            message: "User logged in successfully",
            data: safeUser,
            accessToken,
            refreshToken,
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

//GET USER DETAILS
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
export const verifyGoogleLogin = async (req, res) => {
  try {
    const token = req.body.token || req.body.idToken;
    //    // 1. Ask Google's library to
    // cryptographically verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId,
    });
    // 2. extract the verified payload
    const payload = ticket.getPayload();
    const googleId = payload["sub"];
    const email = payload["email"];
    const name = payload["name"];
    const image = payload["picture"];

    //3. find the user and create a user in the mongodb using google account

    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.insertOne({
        name,
        email,
        googleId,
        image,
        isVerified: true,
      });
    }
    const accessToken = signToken({ email: user.email });
    const refreshToken = signRefreshToken({ email: user.email });
    const { password, ...safeUser } = user.toObject();

    return res.status(200).send({
      status: "success",
      message: "google login successful",
      accessToken,
      refreshToken,
      data: safeUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error verifying google login",
      error: error.message,
    });
  }
};

// Update address in user profile
export const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;
    if (!address) {
      return res.status(400).send({
        status: "error",
        message: "Address is required",
      });
    }
    if (address.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }
    const userAddress = await Address.insertOne({
      user: userId,
      ...address,
      isDefault: address.isDefault ?? false,
    });
    if (!userAddress) {
      return res.status(500).send({
        status: "error",
        message: "Error saving address",
      });
    }
    return res.status(201).send({
      status: "success",
      message: "Address saved successfully",
      data: userAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error saving address",
    });
  }
};

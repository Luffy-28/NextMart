import express from "express";
import {
  generateAccessToken,
  loginUser,
  registerUser,
  resendOtp,
  verificationOTP,
} from "../controllers/userController.js";
import {
  loginUserValidator,
  registerUserValidator,
} from "../middlewares/requestValidators.js";

const router = express.Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.post("/verify", verificationOTP);
router.post("/resendOtp", resendOtp);
router.get("/refresh", generateAccessToken);

export default router;

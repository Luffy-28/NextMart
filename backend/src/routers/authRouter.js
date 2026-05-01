import express from "express";
import { loginUser, registerUser, resendOtp, verificationOTP } from "../controllers/userController.js";
import { loginUserValidator, registerUserValidator } from "../middlewares/requestValidators.js";

const router = express.Router();

router.post("/register", registerUserValidator ,registerUser);
router.post("/login",loginUserValidator, loginUser);
router.post("/verify", verificationOTP)
router.post("/resendOtp", resendOtp);

export default router;

import express from "express";
import { loginUser, registerUser, resendOtp, verificationOTP } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verificationOTP)
router.post("/resendOtp", resendOtp);

export default router;

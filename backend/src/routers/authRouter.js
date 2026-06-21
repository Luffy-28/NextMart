import express from "express";
import passport from "passport";
import {
  generateAccessTokens,
  loginUser,
  registerUser,
  requestResetPassword,
  resendOtp,
  resetPassword,
  verificationOTP,
  verifyGoogleLogin,
} from "../controllers/authController.js";
import {
  loginUserValidator,
  registerUserValidator,
} from "../middlewares/requestValidators.js";
import {
  signRefreshToken,
  generateAccessToken,
} from "../helpers/tokenHelper.js";

const router = express.Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.post("/verify", verificationOTP);
router.post("/resendOtp", resendOtp);
router.get("/refresh", generateAccessTokens);
router.post("/forgot-password", requestResetPassword);
router.post("/reset-password", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

router.post("/googleVerification", verifyGoogleLogin);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "https://next-mart-delta.vercel.app/login?error=true",
  }),
  (req, res) => {
    const accessToken = generateAccessToken({
      email: req.user.email,
      id: req.user._id,
    });
    const refreshToken = signRefreshToken({
      email: req.user.email,
      id: req.user._id,
    });
    res.redirect(
      `https://next-mart-delta.vercel.app/login?token=${accessToken}&ref=${refreshToken}`,
    );
  },
);

export default router;

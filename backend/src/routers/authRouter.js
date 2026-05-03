import express from "express";
import passport from "passport";
import {
  generateAccessTokens,
  loginUser,
  registerUser,
  resendOtp,
  verificationOTP,
  verifyGoogleLogin,
} from "../controllers/userController.js";
import {
  loginUserValidator,
  registerUserValidator,
} from "../middlewares/requestValidators.js";
import { signRefreshToken, generateAccessToken } from "../helpers/tokenHelper.js";

const router = express.Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.post("/verify", verificationOTP);
router.post("/resendOtp", resendOtp);
router.get("/refresh", generateAccessTokens);

//triger google login from this
router.get("/google", passport.authenticate("google",{
  scope:["profile", "email"]
}));

router.post("/googleVerification", verifyGoogleLogin)


// trigger callback route
router.get("/google/callback", passport.authenticate("google",{
  failureRedirect:"http://localhost:5173/login?error=true"
}), (req,res) =>{
  const accessToken= generateAccessToken({ email: req.user.email, id: req.user._id });
  const refreshToken = signRefreshToken({ email: req.user.email, id: req.user._id });
  res.redirect(`http://localhost:5173/login?token=${accessToken}&ref=${refreshToken}`)
})

export default router;

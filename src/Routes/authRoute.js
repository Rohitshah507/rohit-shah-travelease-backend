import {
  signUp,
  verifyEmail,
  verifyGuide,
  login,
  logOut,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../Controller/authController.js";

import express from "express";
import auth from "../Middleware/auth.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/verify-guide", verifyGuide);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/logout", auth, logOut);

export default router;

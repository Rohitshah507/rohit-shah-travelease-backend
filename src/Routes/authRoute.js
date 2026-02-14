import {
  signUp,
  verifyEmail,
  login,
  sendOTP,
  verifyOTP,
  resetPassword,
  resendOTP,
} from "../Controller/authController.js";

import express from "express";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/register",
  upload.fields([{ name: "guideDocument", maxCount: 1 }]),
  signUp,
);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOTP);

export default router;

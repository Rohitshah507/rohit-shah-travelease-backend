import { createToken } from "../utils/token.js";

import {
  createUser,
  sendOTPService,
  loginService,
  resetPasswordService,
  resendOTPService,
} from "../Service/authService.js";
import User from "../Model/User.js";

const signUp = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData.username || !userData.email || !userData.password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (userData.role === "GUIDE" && !req.guideDocument) {
      return res.status(400).json({
        message: "Citizenship document is required for guide registration",
      });
    }

    await createUser(userData);

    return res.status(201).json({
      success: true,
      message: "Check your email for verification code",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.verificationCodeExpiryTime < Date.now()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    if (user.verificationCode.toString() !== verificationCode.toString()) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiryTime = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const verifyGuide = async (req, res) => {
  const { guideId } = req.params;

  const guide = await User.findById(guideId);

  if (!guide) {
    return res.status(404).json({ message: "Guide not found" });
  }

  if (guide.role !== "GUIDE") {
    return res.status(400).json({ message: "User is not a guide" });
  }

  guide.isVerified = true;
  await guide.save();

  res.status(200).json({
    message: "Guide verified successfully",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email to login",
      });
    }

    if (user.role === "GUIDE" && user.guideStatus !== "approved") {
      return res.status(403).json({
        message: "Your guide account is waiting for admin approval",
      });
    }

    const loginController = await loginService({ email, password });

    const token = createToken({ loginController });

    await res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    user.token = token;
    user.isLoggedIn = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ message: "Email is required" });
    }

    await sendOTPService(email);

    return res.status(201).json({
      success: true,
      message: "Reset Code is sent to your email",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordCode?.toString() !== otp.toString() ||
      user.resetCodeExpiry < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or Code is Expire",
      });
    }

    user.resetPasswordCode = null;
    user.resetCodeExpiry = null;
    user.isOTPVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = resetPasswordService({ email, newPassword });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({ message: "Email is not Correct" });
    }

    await resendOTPService(email);

    res.status(200).json({
      success:true,
      message:"Otp resent successfully"
    })
  } catch (error) {
    res.status(401).json({
      success:false,
      message:"Internal Server Error"
    })
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("authToken");

    return res
      .status(200)
      .json({ message: "Logout Successfully", isLoggedIn: false });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export {
  signUp,
  verifyEmail,
  verifyGuide,
  login,
  sendOTP,
  verifyOTP,
  resetPassword,
  logOut,
  resendOTP,
};

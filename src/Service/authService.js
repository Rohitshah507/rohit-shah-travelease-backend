import bcrypt from "bcryptjs";

import {
  generateVerificationCode,
  sendVerificationCode,
  generateResetCode,
  sendResetCode,
} from "../utils/generateCode.js";

import User from "../Model/User.js";

const createUser = async (data) => {
  try {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const verificationCode = generateVerificationCode();
    const verificationCodeExpiryTime = Date.now() + 10 * 60 * 1000;

    const createdUser = await User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role || "TOURIST",
      verificationCode,
      verificationCodeExpiryTime,
    });

    await sendVerificationCode(createdUser.email, verificationCode);

    const userData = {
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
      token: createdUser.token,
    };

    return {
      success: true,
      data: userData,
    };
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const loginService = async (data) => {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  return user;
};

const sendOTPService = async (email) => {
  try {
    const result = await User.findOne({ email });
    if (!result) {
      return res.status(400).json({ message: "User not found" });
    }

    const forgetCode = generateResetCode();
    const resetCodeExpiryTime = Date.now() + 10 * 60 * 1000;

    result.resetPasswordCode = forgetCode;
    result.resetCodeExpiry = resetCodeExpiryTime;
    result.isOTPVerified = false;
    await result.save();

    await sendResetCode(result.email, forgetCode);

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const resetPasswordService = async (data) => {
  try {
    const user = await User.findOne({ email: data.email });

    if (!user || !user.isOTPVerified) {
      return {
        success: false,
        message: "Otp needs to verify",
      };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    user.password = hashedPassword;
    user.isOTPVerified = false;
    await user.save();

    return {
      success: true,
      message: "Password reset Successfully"
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export { createUser, loginService, sendOTPService, resetPasswordService };

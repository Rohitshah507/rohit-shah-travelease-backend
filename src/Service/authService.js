import bcrypt from "bcryptjs";

import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/generateCode.js";

import User from "../Model/User.js";

const createUser = async (data) => {
  try {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return {
        success: false,
        message: "User is already exist",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const verificationCode = generateVerificationCode();
    const verificationCodeExpiryTime = Date.now() + 10 * 60 * 1000;

    const createdUser = await User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role || "USER",
      isLoggedIn: true,
      verificationCode,
      verificationCodeExpiryTime,
    });

    await sendVerificationCode(createdUser.email, verificationCode);

    await verifyOTP(createdUser.email, verificationCode);

    const userData = {
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
      isLoggedIn: true,
      token: createdUser.token,
    };

    return {
      success: true,
      message: "User is Created check your email for verification code",
      data: userData,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const loginService = async (data) => {
  const login = await User.findOne({ email: data.email });

  if (!login) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(data.password, login.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return login;
};

export { createUser, loginService };

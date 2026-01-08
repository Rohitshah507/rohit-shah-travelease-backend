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
      throw new Error("User with this email already exists");
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
      message: "User is Created check your email for verification code",
      data: userData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginService = async (data) => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

export { createUser, loginService };

import bcrypt from "bcryptjs";

import {
  generateVerificationCode,
  sendVerificationCode,
  generateResetCode,
  sendResetCode,
} from "../utils/generateCode.js";

import User from "../Model/User.js";

const createUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw { statusCode: 400, message: "User with this email already exists" };
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const verificationCode = generateVerificationCode();
  const verificationCodeExpiryTime = Date.now() + 5 * 60 * 1000;

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

  return userData;
};

const loginService = async (data) => {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw { message: "User not found" };
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw { message: "Invalid credentials" };
  }

  return user;
};

const sendOTPService = async (email) => {
  const result = await User.findOne({ email });
  if (!result) {
    throw { statusCode: 400, message: "User not found" };
  }

  const forgetCode = generateResetCode();
  const resetCodeExpiryTime = Date.now() + 10 * 60 * 1000;

  result.resetPasswordCode = forgetCode;
  result.resetCodeExpiry = resetCodeExpiryTime;
  result.isOTPVerified = false;
  await result.save();

  await sendResetCode(result.email, forgetCode);

  return {
    message: "Otp sent successfully",
  };
};

const resetPasswordService = async (data) => {
  const user = await User.findOne({ email: data.email });

  if (!user || !user.isOTPVerified) {
    throw {
      statusCode: 400,
      message: "Otp needs to verify",
    };
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  user.password = hashedPassword;
  user.isOTPVerified = false;
  await user.save();

  return {
    success: true,
    message: "Password reset Successfully",
  };
};

const resendOTPService = async (data) => {
  const user = await User.findOne({email: data});

  if (!user) {
    throw { statusCode: 402, message: "Email is not correct" };
  }

  if (user.isVerified) {
    throw { statusCode: 400, message: "User is already verified" };
  }

  const verificationCode = generateVerificationCode();
  const verificationCodeExpiryTime = Date.now() + 5 * 60 * 1000;

  user.verificationCode = verificationCode;
  user.verificationCodeExpiryTime = verificationCodeExpiryTime;
  await user.save();

  await sendVerificationCode(user.email, user.verificationCode);

  return user;
};

export {
  createUser,
  loginService,
  sendOTPService,
  resetPasswordService,
  resendOTPService,
};

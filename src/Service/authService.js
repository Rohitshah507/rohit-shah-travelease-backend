import bcrypt from "bcryptjs";

import User from "../Model/User.js";

const createUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    return {
      success: false,
      message: "User is already exist",
    };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const createdUser = await User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
  });

  const userData = {
    _id: createdUser._id,
    username: createdUser.username,
    email: createdUser.email,
    token: createdUser.token,
  };

  return userData;
};

const loginService = async (data) => {
  const login = await User.findOne({ email: data.email });

  const isMatch = await bcrypt.compare(data.password, login.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return login;
};

export { createUser, loginService};

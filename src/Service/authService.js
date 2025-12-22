import bcrypt from "bcryptjs";

import User from "../Model/User.js";

const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  });

  const userData = {
    _id: createdUser._id,
    username: createdUser.username,
    email: createdUser.email,
    role: createdUser.role,
  };

  return userData;
};

export default createUser;

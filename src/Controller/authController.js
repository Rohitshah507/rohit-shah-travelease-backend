

import User from "../Model/User.js";
import createUserService from "../Service/authService.js";
import verifyEmail from "../utils/verifyEmail.js";

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already exist",
      });
    }

    const data = await createUserService({
      username,
      email,
      password: hashedPassword,
    });

    verifyEmail(data.token, data.email);
    
    res.status(201).json({
      message: "User created successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default { createUser };

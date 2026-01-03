import { createToken } from "../utils/token.js";

import { createUser, loginService } from "../Service/authService.js";

const signUp = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData.username || !userData.email || !userData.password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const data = await createUser(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const findingEmail = User.findOne(email);

    if (!findingEmail) {
      res.status(404).json({ message: "User is not found" });
    }
    if ((findingEmail.isVerified = true)) {
      res.status(404).json({ message: "User is already verified" });
    }
    if (findingEmail.verificationCodeExpiryTime < new Date()) {
      res.status(404).json({ Message: "Code is Expired" });
    }
    if (findingEmail.verificationCode != verificationCode) {
      res.status(404).json({ Message: "Invalid Verification Code" });
    }

    findingEmail.isVerified = true;
    findingEmail.verificationCode = null;
    findingEmail.verificationCodeExpiryTime = null;
    await findingEmail.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const login = async (req, res) => {
  const input = req.body;

  try {
    if (!input.email || !input.password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const loginController = await loginService(input);

    if (!loginController) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export { signUp, verifyEmail, login };

import { createToken, verifyToken } from "../utils/token.js";

import { createUser, loginService } from "../Service/authService.js";
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
    const findingEmail = await User.findOne({ email });

    if (!findingEmail) {
      return res.status(404).json({ message: "User is not found" });
    }
    if (findingEmail.isVerified === true) {
      return res.status(404).json({ message: "User is already verified" });
    }
    if (findingEmail.verificationCodeExpiryTime < Date.now()) {
      return res.status(404).json({ Message: "Code is Expired" });
    }
    if (findingEmail.verificationCode != verificationCode) {
      return res.status(404).json({ Message: "Invalid Verification Code" });
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
    const loginController = await loginService({ email, password });

    const token = createToken({ loginController });

    await res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    verifyToken(token);
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


const logOut = (req, res) => {
  try {
     res.clearCookie("token");
     return res.status(200).json({message: "Logout Successfully"})
  } catch (error) {
    res.statusCode(500).json(`${error}`)
  }
}

export { signUp, verifyEmail, login, logOut };

import { createToken } from "../utils/token.js";

import { createUser, loginService } from "../Service/authService.js";
import verifyEmail from "../utils/verifyEmail.js";

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

    const token = createToken(data);

    verifyEmail(token, data.email);
    data.token = token;

    res.status(201).json({
      message: "User created successfully",
      token: token,
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const input = req.body;

  try {
    if(!input){
      res.status(400).send("Required files are required")
    }

    const loginController = await loginService(input);

    const token = createToken(loginController);

    res.status(200).json({
      message:"Login Successful",
      token:token,
    })
    
  } catch (error) {
    
  }
}

export { signUp, login };

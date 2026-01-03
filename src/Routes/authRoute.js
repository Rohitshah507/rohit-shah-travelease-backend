import {signUp, verifyEmail, login} from "../Controller/authController.js";
import express from "express";

const router = express.Router();

router.post('/register', signUp);   
router.post('/verify-email', verifyEmail);
router.post('/login', login);  

export default router;
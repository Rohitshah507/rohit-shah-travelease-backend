import {signUp, verifyEmail, verifyGuide, login, logOut} from "../Controller/authController.js";
import express from "express";

const router = express.Router();

router.post('/register', signUp);   
router.post('/verify-guide', verifyGuide);
router.post('/verify-email', verifyEmail);
router.post('/login', login);  
router.get('/logout', logOut);

export default router;
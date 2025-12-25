import {signUp} from "../Controller/authController.js";
import express from "express";

const router = express.Router();

router.post('/register', signUp);   

export default router;
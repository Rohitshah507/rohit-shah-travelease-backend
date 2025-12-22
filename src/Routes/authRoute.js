import authController from "../Controller/authController.js";
import express from "express";

const router = express.Router();

router.post('/register', authController.createUser);   

export default router;
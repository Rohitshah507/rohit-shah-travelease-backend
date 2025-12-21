import createUser from "../Controller/authController.js";
import express from "express";

const router = express.Router();

router.post('/register', createUser);   
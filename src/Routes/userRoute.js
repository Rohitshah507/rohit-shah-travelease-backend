import { userController } from "../Controller/userController.js";

import express from "express";
import auth from "../Middleware/auth.js";

const router = express.Router();


router.get("/user", auth, userController);

export default router;

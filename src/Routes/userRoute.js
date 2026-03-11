import express from "express";
import auth from "../Middleware/auth.js";

import { userController, updateUserController } from "../Controller/userController.js";

const router = express.Router();

router.get("/user", auth, userController);
router.put("/user/update/:id", auth, updateUserController);

export default router;
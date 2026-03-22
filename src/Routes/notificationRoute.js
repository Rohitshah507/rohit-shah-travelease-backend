import express from "express";
import notificationController from "../Controller/notificationController.js";
import auth from "../Middleware/auth.js";

const router = express.Router();

router.get("/", auth, notificationController.getNotifications);
router.patch("/:id/read", auth, notificationController.markAsRead);

export default router;
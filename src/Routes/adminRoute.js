import express from "express";
import auth from "../Middleware/auth.js";
import adminController from "../Controller/adminController.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

router.put(
  "/approve-guide/:id",
  auth,
  roleBasedAuth("ADMIN"),
  adminController.approveGuide,
);

router.get(
  "/admin",
  auth,
  roleBasedAuth("ADMIN"),
  adminController.getAllBookings,
);



export default router;

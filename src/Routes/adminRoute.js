import express from "express";
import auth from "../Middleware/auth.js";
import adminController from "../Controller/adminController.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

router.get(
  "/pending-guides",
  auth,
  roleBasedAuth("ADMIN"),
  adminController.getPendingGuides,
);

router.get(
  "/all-guides",
  auth,
  roleBasedAuth("ADMIN"),
  adminController.getAllGuides,
);

router.put(
  "/approve-guide/:id",
  auth,
  roleBasedAuth("ADMIN"),
  adminController.approveGuide,
);

router.put(
  "/reject-guide/:id",
  auth,
  roleBasedAuth("ADMIN"),
  adminController.rejectGuide,
);

router.get(
  "/admin",
  auth,
  roleBasedAuth("ADMIN"),
  adminController.getAllBookings,
);

export default router;

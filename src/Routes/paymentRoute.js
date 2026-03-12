import express from "express";
import auth from "../Middleware/auth.js";
import paymentController from "../Controller/paymentController.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

//api/payment/:id/khalti/initiate

router.post("/:id/khalti/initiate", auth,  roleBasedAuth("TOURIST"), paymentController.initiateKhalti);

router.post("/:id/khalti/confirm", auth, roleBasedAuth("ADMIN"), paymentController.ConfirmPayment);

router.get("/payments", auth, paymentController.getPayment);

router.get(
  "/guide-payments",
  auth,
  roleBasedAuth("GUIDE"),
  paymentController.getGuidePayments,
);

router.get(
  "/all-payments",
  auth,
  roleBasedAuth("ADMIN"),
  paymentController.getAllPayments,
);

export default router;

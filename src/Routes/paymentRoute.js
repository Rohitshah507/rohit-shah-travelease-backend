import express from "express";
import auth from "../Middleware/auth.js";
import paymentController from "../Controller/paymentController.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

router.post("/esewa/initiate", auth, roleBasedAuth("TOURIST"), paymentController.createPayment);

router.get("/esewa/success", paymentController.esewaSuccess);

router.get("/esewa/failure", paymentController.esewaFailure);

router.get("/payments", auth, paymentController.getPayment);

router.get("/all-payments", auth, roleBasedAuth("ADMIN"), paymentController.getAllPayments);

export default router;

import express from "express";
import auth from "../Middleware/auth.js";
import bookingController from "../Controller/bookingController.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

router.post(
  "/",
  auth,
  roleBasedAuth("TOURIST"),
  bookingController.createBooking,
);

router.get(
  "/tourist",
  auth,
  roleBasedAuth("TOURIST"),
  bookingController.getMyBookings,
);

router.get(
  "/guide",
  auth,
  roleBasedAuth("GUIDE"),
  bookingController.getGuideBookings,
);

router.get(
  "/admin",
  auth,
  roleBasedAuth("ADMIN"),
  bookingController.getAllBookings,
);

router.put(
  "/:id/confirm",
  roleBasedAuth("GUIDE"),
  bookingController.confirmationBooking,
);

// router.put(
//   "/:id/cancel",
//   roleBasedAuth("GUIDE"),
//   bookingController.cancelBooking,
// );

export default router;

import express from "express";
import auth from "../Middleware/auth.js";
import adminController from "../Controller/adminController.js"
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

router.put("/approve-guide/:id", auth, roleBasedAuth("ADMIN"), adminController.approveGuide);

// router.get(
//   "/tourist",
//   auth,
//   roleBasedAuth("TOURIST"),
//   bookingController.getMyBookings,
// );

// router.get(
//   "/guide",
//   auth,
//   roleBasedAuth("GUIDE"),
//   bookingController.getGuideBookings,
// );

// router.get(
//   "/admin",
//   auth,
//   roleBasedAuth("ADMIN"),
//   bookingController.getAllBookings,
// );

// router.put(
//   "/confirm/:id",
//   auth,
//   roleBasedAuth("GUIDE"),
//   bookingController.confirmationBooking,
// );

// router.put(
//   "/cancel/:id",
//   auth,
//   roleBasedAuth("GUIDE"),
//   bookingController.cancelBooking,
// );

export default router;

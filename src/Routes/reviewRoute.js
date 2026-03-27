// routes/reviewRoutes.js
import express from "express";
import auth from "../Middleware/auth.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";
import reviewController from "../Controller/reviewController.js";

const router = express.Router();

// Create review (only tourist)
router.post("/", auth, roleBasedAuth("TOURIST"), reviewController.createReview);

// Get reviews for a package
router.get("/package/:id", reviewController.getPackageReviews);

router.get("/all", reviewController.getAllReviews);

// Get guide rating
router.get("/guide/:guideId", reviewController.getGuideRating);

export default router;

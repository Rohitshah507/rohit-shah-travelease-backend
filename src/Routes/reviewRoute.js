// routes/reviewRoutes.js
import express from "express";
import auth from "../Middleware/auth.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";
import reviewController from "../Controller/reviewController.js";

const router = express.Router();

// ⚠️  ORDER MATTERS in Express — specific routes must come BEFORE param routes
// "/all" and "/guide/:guideId" must be declared before "/:id"
// otherwise Express matches "all" and "guide" as the :id param

// Create review (tourist only)
router.post("/", auth, roleBasedAuth("TOURIST"), reviewController.createReview);

// ✅ These specific routes go FIRST
router.get("/all", reviewController.getAllReviews);
router.get("/guide/:guideId", reviewController.getGuideRating);

// ✅ Generic param route goes LAST
router.get("/:id", reviewController.getPackageReviews);

export default router;
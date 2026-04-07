// routes/reviewRoutes.js
import express from "express";
import auth from "../Middleware/auth.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";
import reviewController from "../Controller/reviewController.js";

const router = express.Router();

router.post("/", auth, roleBasedAuth("TOURIST"), reviewController.createReview);

router.get("/all", reviewController.getAllReviews);
router.get("/guide/:guideId", reviewController.getGuideRating);


router.get("/:id", reviewController.getPackageReviews);

export default router;
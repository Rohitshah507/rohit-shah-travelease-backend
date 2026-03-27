// Service/reviewService.js
import Review from "../Model/Review.js";
import Booking from "../Model/Booking.js";
import TourPackage from "../Model/TourPackages.js";

const createReview = async (userId, tourPackageId, rating, comment) => {
  // Check booking completed
  const booking = await Booking.findOne({
    userId,
    tourPackageId,
    status: "COMPLETED",
  });

  if (!booking) {
    throw { statusCode: 403, message: "Complete tour before review" };
  }

  // Prevent duplicate review
  const existing = await Review.findOne({ userId, tourPackageId });

  if (existing) {
    throw { statusCode: 400, message: "Already reviewed this package" };
  }

  const tour = await TourPackage.findById(tourPackageId);

  if (!tour) {
    throw { statusCode: 404, message: "Tour package not found" };
  }

  const review = await Review.create({
    userId,
    tourPackageId,
    guideId: tour.guideId,
    rating,
    comment,
  });

  return review;
};

// Get reviews for a package
const getPackageReviews = async (tourPackageId) => {
  return await Review.find({ tourPackageId })
    .populate("userId", "username")
    .sort({ createdAt: -1 });
};

const getAllReviews = async () => {
  return await Review.find()
    .populate("userId", "username")
    .populate("guideId", "username")
    .sort({ createdAt: -1 });
};

// Get guide average rating
const getGuideRating = async (guideId) => {
  const result = await Review.aggregate([
    { $match: { guideId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { avgRating: 0, totalReviews: 0 };
};

export default {
  createReview,
  getAllReviews,
  getPackageReviews,
  getGuideRating,
};

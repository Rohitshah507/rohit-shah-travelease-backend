// Service/reviewService.js
import Review from "../Model/Review.js";
import Booking from "../Model/Booking.js";
import TourPackage from "../Model/TourPackages.js";

const createReview = async (userId, tourPackageId, rating, comment) => {
  // Check booking completed
  const booking = await Booking.findOne({
    userId,
    tourPackageId,
    bookingStatus: "COMPLETED",
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
  const packages = await TourPackage.find({ guideId }).select("_id title");
  const packageIds = packages.map((p) => p._id);

  if (packageIds.length === 0) {
    return { reviews: [], avgRating: 0 };
  }

  const reviews = await Review.find({
    tourPackageId: { $in: packageIds },
  })
    .populate("userId", "name email location")
    .populate("tourPackageId", "title destination")
    .sort({ createdAt: -1 });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const shaped = reviews.map((r) => ({
    _id: r._id,
    tourist: r.userId?.name || "Anonymous",
    tourTitle: r.tourPackageId?.title || "Tour Package",
    rating: r.rating,
    review: r.comment,
    date: new Date(r.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    createdAt: r.createdAt,
  }));

  return {
    reviews: shaped,
    avgRating: parseFloat(avgRating.toFixed(1)),
  };
};

export default {
  createReview,
  getAllReviews,
  getPackageReviews,
  getGuideRating,
};

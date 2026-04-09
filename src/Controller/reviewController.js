// Controller/reviewController.js
import reviewService from "../Service/reviewService.js";

const createReview = async (req, res) => {
  try {
    const { tourPackageId, rating, comment } = req.body;

    if (!tourPackageId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "TourPackageId, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await reviewService.createReview(
      req.user._id,
      tourPackageId,
      rating,
      comment,
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get reviews for a package
const getPackageReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await reviewService.getPackageReviews(id);

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get guide rating
const getGuideRating = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { reviews, avgRating } = await reviewService.getGuideRating(guideId);

    res.json({
      success: true,
      reviews,      
      avgRating,    
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createReview,
  getAllReviews,
  getPackageReviews,
  getGuideRating,
};

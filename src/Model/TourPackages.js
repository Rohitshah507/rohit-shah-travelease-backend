import mongoose from "mongoose";

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    destination: {
      type: String,
      required: true,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    imageUrls: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["Active", "INActive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const TourPackage = mongoose.model("TourPackage", tourPackageSchema);

export default TourPackage;

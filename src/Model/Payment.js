import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: Number,
    transaction_uuid: {
      type: String,
      unique: true,
    },
    method: {
      type: String,
      enum: ["KHALTI"],
      default: "KHALTI",
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

paymentSchema.index(
  { bookingId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "COMPLETED" } },
);

export default mongoose.model("Payment", paymentSchema);

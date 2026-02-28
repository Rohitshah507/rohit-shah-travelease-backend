import Payment from "../Model/Payment.js";
import Booking from "../Model/Booking.js";
import payment from "../utils/payment.js";

const initiateKhalti = async (id, userId) => {
  const booking = await Booking.findById(id)
    .populate("tourPackageId")
    .populate("userId");

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (!booking.userId.equals(userId)) {
    throw { statusCode: 403, message: "Unauthorized" };
  }

  const existing = await Payment.findOne({
    id: booking._id,
    status: "COMPLETED",
  });

  if (existing) {
    throw new Error("Booking already paid");
  }

  const transaction_uuid = crypto.randomUUID();

  await Payment.create({
    bookingId: booking._id,
    userId,
    amount: booking.tourPackageId.price,
    method: "KHALTI",
    status: "PENDING",
    transaction_uuid,
  });

  return await payment.payViaKhalti({
    amount: booking.tourPackageId.price * 100,
    purchase_order_id: booking._id.toString(),
    purchase_order_name: "Tour Booking Payment",
    customer_info: {
      name: booking.userId.username,
      email: booking.userId.email,
      phone: booking.userId.phoneNumber,
    },
  });
};

const ConfirmPayment = async (id) => {
  const payment = await Payment.findById(id).populate("bookingId");

  if (!payment) {
    throw new Error("Payment not found");
  }

  const verification = await Payment.findOne({
    transaction_uuid: id,
    status: "COMPLETED",
  });

  if (verification.status === "Completed") {
    payment.status = "COMPLETED";
    await payment.save();
  }

  return verification;
}


const getPayment = async (userId) => {
  return Payment.find({
    userId,
    status: "COMPLETED",
  }).populate("bookingId");
};

// For guide payments only //
const getGuidePayments = async (guideId) => {
  const payments = await Payment.find({ status: "COMPLETED" }).populate({
    path: "bookingId",
    populate: {
      path: "tourPackageId",
      match: { guideId },
    },
  });

  return payments.filter((p) => p.bookingId?.tourPackageId);
};

const getAllPayments = async () => {
  return Payment.find({
    status: "COMPLETED",
  })
    .populate("userId", "username email")
    .populate("bookingId");
};

export default {
  initiateKhalti,
  ConfirmPayment,
  getPayment,
  getGuidePayments,
  getAllPayments,
};

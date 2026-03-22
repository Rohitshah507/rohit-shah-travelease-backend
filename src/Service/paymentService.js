import Payment from "../Model/Payment.js";
import Booking from "../Model/Booking.js";
import payment from "../utils/payment.js";
import Notification from "../Model/Notification.js";

const initiateKhalti = async (id, userId) => {
  const booking = await Booking.findById(id)
    .populate("tourPackageId")
    .populate("userId");

  if (!booking) throw new Error("Booking not found");

  if (booking.userId._id.toString() !== userId.toString()) {
    throw { statusCode: 403, message: "Unauthorized" };
  }

  const existing = await Payment.findOne({
    bookingId: booking._id,
    status: "COMPLETED",
  });

  if (!booking.userId.phoneNumber || booking.userId.phoneNumber.length !== 10) {
    throw new Error("Invalid phone number");
  }

  if (existing) throw new Error("Booking already paid");

  await Payment.deleteOne({ bookingId: booking._id, status: "PENDING" });

  const transaction_uuid = crypto.randomUUID();

  const khaltiResponse = await payment.payViaKhalti({
    amount: booking.tourPackageId.price * 100,
    purchase_order_id: transaction_uuid,
    purchase_order_name: "Tour Booking Payment",
    customer_info: {
      name: booking.userId.username,
      email: booking.userId.email,
      phone: booking.userId.phoneNumber,
    },
  });

  await Payment.create({
    bookingId: booking._id,
    userId,
    amount: booking.tourPackageId.price,
    method: "KHALTI",
    status: "PENDING",
    transaction_uuid,
  });

  return khaltiResponse;
};

const ConfirmPayment = async (paymentId) => {
  const paymentRecord = await Payment.findById(paymentId).populate("bookingId");

  if (!paymentRecord) {
    throw { statusCode: 404, message: "Payment record not found" };
  }

  if (paymentRecord.status !== "PENDING") {
    throw {
      statusCode: 400,
      message: `Payment is already ${paymentRecord.status}`,
    };
  }

  paymentRecord.status = "COMPLETED";
  await paymentRecord.save();

  await Notification.create({
    userId: paymentRecord.userId,
    message: "Payment successful 💰 Your booking is confirmed!",
    type: "PAYMENT",
  });

  const socketId = userSocketMap.get(paymentRecord.userId.toString());

  if (socketId) {
    io.to(socketId).emit("paymentSuccess", {
      message: "💰 Payment successful!",
    });
  }

  if (paymentRecord.bookingId) {
    await Booking.findByIdAndUpdate(
      paymentRecord.bookingId._id || paymentRecord.bookingId,
      { bookingStatus: "CONFIRMED" },
      { new: true },
    );
  }

  return paymentRecord;
};

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
    },
  });

  return payments.filter(
    (p) =>
      p.bookingId &&
      p.bookingId.tourPackageId &&
      p.bookingId.tourPackageId.guideId.toString() === guideId.toString(),
  );
};

const getAllPayments = async () => {
  return Payment.find({})
    .populate("userId", "username email")
    .populate("bookingId")
    .sort({ createdAt: -1 }); // newest first
};

export default {
  initiateKhalti,
  ConfirmPayment,
  getPayment,
  getGuidePayments,
  getAllPayments,
};

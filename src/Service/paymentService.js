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

  if (booking.userId._id.toString() !== userId.toString()) {
    throw { statusCode: 403, message: "Unauthorized" };
  }

  const pendingBooking = await Payment.findOne({
    bookingId: booking._id,
    status: "PENDING",
  });

  if (pendingBooking) {
    throw new Error("Payment already initiated for this booking");
  }

  const existing = await Payment.findOne({
    bookingId: booking._id,
    status: "COMPLETED",
  });

  if (existing) {
    throw new Error("Booking already paid");
  }

  const transaction_uuid = crypto.randomUUID();

  await Payment.findOneAndUpdate(
    { bookingId: booking._id, status: "PENDING" },
    {
      $setOnInsert: {
        bookingId: booking._id,
        userId,
        amount: booking.tourPackageId.price,
        method: "KHALTI",
        status: "PENDING",
        transaction_uuid,
      },
    },
    { upsert: true, new: true },
  );

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

const ConfirmPayment = async (id, status, user) => {
  const paymentRecord = await Payment.findOne({
    bookingId: id,
    status: "PENDING",
  }).populate("bookingId");

  if (!paymentRecord) {
    throw { statusCode: 404, message: "Payment record not found" };
  }

  if (paymentRecord.userId._id.toString() !== user._id.toString()) {
    throw { statusCode: 403, message: "Unauthorized" };
  }

  if (status === "Completed") {
    paymentRecord.status = "COMPLETED";
    await paymentRecord.save();

    return await Booking.findByIdAndUpdate(
      id,
      { bookingStatus: "CONFIRMED" },
      { new: true },
    );
  }

  if (status === "Failed") {
    paymentRecord.status = "FAILED";
    await paymentRecord.save();

    return await Booking.findByIdAndUpdate(
      id,
      { bookingStatus: "FAILED" },
      { new: true },
    );
  }

  throw { statusCode: 400, message: "Invalid payment status" };
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

import axios from "axios";
import Payment from "../Model/Payment.js";
import Booking from "../Model/Booking.js";

const initiateKhalti = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId).populate("tourPackageId");

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.userId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: "Unauthorized" };
  }

  const existing = await Payment.findOne({
    bookingId,
    status: "COMPLETED",
  });

  if (existing) {
    throw new Error("Booking already paid");
  }

  // const amount = booking.tourPackageId.price * 100; // paisa

  // const response = await axios.post(
  //   "https://a.khalti.com/api/v2/epayment/initiate/",
  //   {
  //     return_url: "http://localhost:5000/api/payment/khalti/verify",
  //     website_url: "http://localhost:5173",
  //     amount,
  //     purchase_order_id: booking._id.toString(),
  //     purchase_order_name: "Tour Booking Payment",
  //   },
  //   {
  //     headers: {
  //       Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
  //       "Content-Type": "application/json",
  //     },
  //   },
  // );

  // const { pidx, payment_url } = response.data;

  // await Payment.create({
  //   bookingId,
  //   userId,
  //   amount: booking.tourPackageId.price,
  //   transaction_uuid: pidx,
  //   method: "KHALTI",
  //   status: "PENDING",
  // });

  // return payment_url;
  return { success: true };
};

const verifyKhalti = async (pidx) => {
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    },
  );

  return response.data;
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
  verifyKhalti,
  getPayment,
  getGuidePayments,
  getAllPayments,
};

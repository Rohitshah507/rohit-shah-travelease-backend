import Payment from "../Model/Payment.js";
import Booking from "../Model/Booking.js";

const createPayment = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId).populate("tourPackageId");

  if (!booking) {
    throw new Error("Booking not found");
  }

  const existingPayment = await Payment.findOne({
    bookingId,
    status: "COMPLETED",
  });

  if (existingPayment) {
    throw new Error("Booking already paid");
  }

  const amount = booking.tourPackageId.price;

  const payment = await Payment.create({
    bookingId,
    userId,
    amount,
    method: "ESEWA",
    status: "PENDING",
  });

  const esewaData = {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: payment._id.toString(),
    product_code: "EPAYTEST",
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: "http://localhost:5000/api/payment/esewa/success",
    failure_url: "http://localhost:5000/api/payment/esewa/failure",
  };

  return { payment, esewaData };
};

const getPayment = async (userId) => {
  const payments = await Payment.find({
    userId,
    status: "SUCCESS",
  }).populate("bookingId");

  return payments;
};

const getAllPayments = async () => {
  const allPayments = await Payment.find({
    status: "SUCCESS",
  })
    .populate("userId", "username email")
    .populate("bookingId");

  return allPayments;
};

export default { createPayment, getPayment, getAllPayments };

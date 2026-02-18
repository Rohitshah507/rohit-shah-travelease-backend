import paymentService from "../Service/paymentService.js";
import Payment from "../Model/Payment.js";
import axios from "axios";

const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const data = await paymentService.createPayment(bookingId, req.user._id);

    res.status(200).json({
      message: "Redirect to eSewa",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const esewaSuccessHandler = async (req, res) => {
  const { data } = req.query;

  const decoded = JSON.parse(
    Buffer.from(data, "base64").toString("utf-8")
  );

  const { transaction_uuid, total_amount } = decoded;

  const payment = await Payment.findOne({ transaction_uuid });

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  // Verify with eSewa server
  const verifyResponse = await axios.post(
    "https://rc-epay.esewa.com.np/api/epay/transaction/status",
    {
      product_code: "EPAYTEST",
      total_amount,
      transaction_uuid,
    }
  );

  if (verifyResponse.data.status === "COMPLETE") {
    payment.status = "COMPLETED";
    await payment.save();

    // 🔥 AUTO CONFIRM BOOKING
    await Booking.findByIdAndUpdate(payment.bookingId, {
      bookingStatus: "Confirmed",
    });

    return res.redirect("http://localhost:5173/payment-success");
  } else {
    payment.status = "FAILED";
    await payment.save();

    return res.redirect("http://localhost:5173/payment-failed");
  }
};


export const esewaFailure = async (req, res) => {
  try {
    const { transaction_uuid } = req.query;

    const payment = await Payment.findById(transaction_uuid);

    if (payment) {
      payment.status = "FAILED";
      await payment.save();
    }

    res.json({
      success: false,
      message: "Payment Failed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const payments = await paymentService.getPayment(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Payment Successfully",
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const allPayments = await paymentService.getAllPayments();

    return res.status(200).json({
      success: true,
      message: "All Payments Successfully",
      data: allPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default {
  createPayment,
  esewaSuccessHandler,
  esewaFailure,
  getPayment,
  getAllPayments,
};

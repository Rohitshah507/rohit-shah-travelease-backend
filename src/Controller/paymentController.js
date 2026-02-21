import paymentService from "../Service/paymentService.js";
import Payment from "../Model/Payment.js";
import Booking from "../Model/Booking.js";

const initiateKhalti = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const paymentUrl = await paymentService.initiateKhalti(
      bookingId,
      req.user._id,
    );

    res.json({
      success: true,
      paymentUrl,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyKhalti = async (req, res) => {
  try {
    const { pidx } = req.query;

    const verification = await paymentService.verifyKhalti(pidx);

    if (verification.status === "Completed") {
      const payment = await Payment.findOne({
        transaction_uuid: pidx,
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      payment.status = "COMPLETED";
      await payment.save();

      await Booking.findByIdAndUpdate(payment.bookingId, {
        bookingStatus: "Confirmed",
      });

      return res.redirect("http://localhost:5173/payment-success");
    }

    return res.redirect("http://localhost:5173/payment-failed");
  } catch (error) {
    return res.redirect("http://localhost:5173/payment-failed");
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

const getGuidePayments = async (req, res) => {
  try {
    const allPayments = await paymentService.getGuidePayments(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Guide Payments Successfully Retrieved",
      data: allPayments,
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
  initiateKhalti,
  verifyKhalti,
  getPayment,
  getGuidePayments,
  getAllPayments,
};

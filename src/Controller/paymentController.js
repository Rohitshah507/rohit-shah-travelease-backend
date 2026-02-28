import paymentService from "../Service/paymentService.js";
import Payment from "../Model/Payment.js";

const initiateKhalti = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentUrl = await paymentService.initiateKhalti(id, req.user._id);
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

const confirmKhaltiPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({
        success: false,
        message: "pidx is required",
      });
    }

    // 1️⃣ Verify from Khalti
    const khaltiResponse = await payment.confirmKhalti(pidx);

    if (khaltiResponse.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // 2️⃣ Find pending payment
    const payment = await Payment.findOne({
      transaction_uuid: pidx,
      status: "PENDING",
    }).populate("bookingId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // 3️⃣ Update payment
    payment.status = "COMPLETED";
    await payment.save();

    return res.json({
      success: true,
      message: "Payment confirmed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
  confirmKhaltiPayment,
  getPayment,
  getGuidePayments,
  getAllPayments,
};

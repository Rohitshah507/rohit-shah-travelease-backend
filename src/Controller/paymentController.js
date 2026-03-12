import paymentService from "../Service/paymentService.js";

const initiateKhalti = async (req, res) => {
  try {
    const { id } = req.params;

    const khaltiResponse = await paymentService.initiateKhalti(
      id,
      req.user._id,
    );

    res.json({
      success: true,
      paymentUrl: khaltiResponse.payment_url,
      pidx: khaltiResponse.pidx,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const ConfirmPayment = async (req, res) => {
  try {
    const { id } = req.params; 

    const data = await paymentService.ConfirmPayment(id);

    return res.status(200).json({
      success: true,
      message: "Payment Confirmed Successfully",
      data: data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
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
  ConfirmPayment,
  getPayment,
  getGuidePayments,
  getAllPayments,
};
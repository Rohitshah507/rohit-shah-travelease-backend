import bookingService from "../Service/bookingService.js";

const createBooking = async (req, res) => {
  try {
    const input = req.body;

    if (!input.tourPackageId || !input.startDate || !input.endDate) {
      return res.status(404).json({
        success: false,
        message: "All fields are Required",
      });
    }

    if (input.startDate >= input.endDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (input.numberOfAdults < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one adult is required for booking",
      });
    }

    const data = await bookingService.createBooking(req.user._id, {
      tourPackageId: input.tourPackageId,
      startDate: input.startDate,
      endDate: input.endDate,
      numberOfAdults: input.numberOfAdults,
      numberOfChildren: input.numberOfChildren,
    });

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Failed to create booking. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booked Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getMyBookings = async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user._id);

  return res.status(201).json({
    success: true,
    message: "All Bookings History",
    data: bookings,
  });
};

const getGuideBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getGuideBookings(req.user._id);
    return res.status(201).json({
      success: true,
      message: "Guide Booking List",
      data: bookings,
    });
  } catch (error) {
    res.status(501).send({
      success: "false",
      send: error.message || "Internal Server Error",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const allBookings = await bookingService.getAllBookings();

    return res.status(201).json({
      success: true,
      message: "All Bookings List",
      data: allBookings,
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const confirmationBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    const booking = await bookingService.confirmationBooking(id, userId);

    return res.json(booking);
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    await bookingService.cancelBooking(id, userId);

    return res.status(201).json({
      success: true,
      message: "Booking is Cancelled",
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const guideCancelBooking = async (req, res) => {
  try {
    const { id } = req.params.id;

    await bookingService.guideCancelBooking(id, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Cancelled",
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default {
  createBooking,
  getMyBookings,
  getGuideBookings,
  getAllBookings,
  confirmationBooking,
  cancelBooking,
  guideCancelBooking,
};

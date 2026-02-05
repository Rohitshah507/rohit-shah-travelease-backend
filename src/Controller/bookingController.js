import bookingService from "../Service/bookingService.js";

const createBooking = async (req, res) => {
  try {
    const { tourPackageId, bookingDate } = req.body;

    if (!tourPackageId || !bookingDate) {
      return res.status(404).send("All fields are Required");
    }

    const data = await bookingService.createBooking(req.user._id, {
      tourPackageId,
      bookingDate,
    });

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
    const id = req.params._id;
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
    const { id } = req.params._id;

    await bookingService.guideCancelBooking(id, req.user._id);
    
    return res.status(201).json({
      success:true,
      message:"Cancelled"
    })
  } catch (error) {
    res.status(501).send({
      success:false,
      message:error.message || "Internal Server Error"
    })
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

import Booking from "../Model/Booking.js";
import TourPackage from "../Model/TourPackages.js";

const createBooking = async (bookedBy, data) => {
  const finding = await TourPackage.findById(data.tourPackageId);
  if (!finding) {
    throw { statusCode: 402, message: "Tour Package is not found" };
  }

  const booking = await Booking.create({
    userId: bookedBy,
    tourPackageId: data.tourPackageId,
    bookingDate: data.bookingDate,
  });

  return booking;
};

const getMyBookings = async (userId) => {
  const bookings = await Booking.find({ userId }).populate("tourPackageId");

  return bookings;
};

const getGuideBookings = async (guideId) => {
  const bookings = await Booking.find().populate({
    path: "tourPackageId",
    match: { guideId },
  });
  const filtering = bookings.filter((b) => {
    return b.tourPackageId !== null;
  });
  return filtering;
};

const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate("tourPackageId")
    .populate("userId");

  return bookings;
};

const confirmationBooking = async (id) => {
  const booking = await Booking.findById().populate("tourPackageId");
  if (!booking) {
    throw { statusCode: 402, message: "Booking are not available" };
  }

  if (!booking.tourPackageId.guideId !== userId) {
    throw { statusCode: 402, message: "Not Authorized" };
  }

  booking.bookingStatus("Confirmed");
  await save();

  return booking;
};

const cancelBooking = async () => {};

export default {
  createBooking,
  getMyBookings,
  getGuideBookings,
  getAllBookings,
  confirmationBooking,
  cancelBooking,
};

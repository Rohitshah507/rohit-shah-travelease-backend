import Booking from "../Model/Booking.js";
import TourPackage from "../Model/TourPackages.js";

const createBooking = async (bookedBy, data) => {
  const finding = await TourPackage.findById(data.tourPackageId);
  if (!finding) {
    throw { statusCode: 402, message: "Tour Package is not found" };
  }

  const checkingBooked = await Booking.findOne({
    userId: bookedBy,
    tourPackageId: data.tourPackageId,
    StartDate: data.startDate,
    EndDate: data.endDate,
  });
  if (checkingBooked) {
    throw { statusCode: 404, message: "Its already Booked" };
  }

  const booking = await Booking.create({
    userId: bookedBy,
    tourPackageId: data.tourPackageId,
    startDate: data.startDate,
    endDate: data.endDate,
    numberOfAdults: data.numberOfAdults,
    numberOfChildren: data.numberOfChildren,
    bookingStatus: "Pending",
  });

  return booking;
};

const getMyBookings = async (userId) => {
  const bookings = await Booking.find({ userId }).populate("tourPackageId");

  return bookings;
};

const getGuideBookings = async (guideId) => {
  const bookings = await Booking.find()
    .populate({
      path: "tourPackageId",
      match: { guideId },
    })
    .populate({
      path: "userId",
      select: "username email phoneNumber",
    });
  const filtering = bookings.filter((b) => {
    return b.tourPackageId !== null;
  });
  return filtering;
};

const confirmationBooking = async (id, userId) => {
  const booking = await Booking.findById(id).populate("tourPackageId");
  if (!booking) {
    throw { statusCode: 402, message: "Booking are not available" };
  }

  if (booking.tourPackageId.guideId.toString() !== userId.toString()) {
    throw { statusCode: 402, message: "Not Authorized" };
  }

  booking.bookingStatus = "Confirmed";
  await booking.save();

  return booking;
};

const cancelBooking = async (id, userId) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw { statusCode: 402, message: "Booking not Found" };
  }

  if (booking.userId.toString() !== userId) {
    throw { statusCode: 402, message: "Not Authorized" };
  }

  booking.bookingStatus = "Cancelled";
  await booking.save();

  return booking;
};

const guideCancelBooking = async (id, userId) => {
  const booking = await Booking.findById(id).populate({
    path: "tourPackageId",
    match: { guideId: userId },
  });

  if (!booking) {
    throw { statusCode: 404, message: "Booking not found" };
  }

  if (!booking.tourPackageId) {
    throw { statusCode: 401, message: "Unauthorized" };
  }

  booking.bookingStatus = "Cancelled";
  await booking.save();

  return booking;
};

export default {
  createBooking,
  getMyBookings,
  getGuideBookings,
  confirmationBooking,
  cancelBooking,
  guideCancelBooking,
};

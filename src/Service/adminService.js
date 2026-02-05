import Booking from "../Model/Booking.js";

const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate("tourPackageId")
    .populate("userId");

  return bookings;
};

export default {getAllBookings}
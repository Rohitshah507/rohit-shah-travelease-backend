import Booking from "../Model/Booking.js";
import TourPackage from "../Model/TourPackages.js";
import Notification from "../Model/Notification.js";
import { io, userSocketMap } from "../utils/socket.js";

const createBooking = async (bookedBy, data) => {
  const finding = await TourPackage.findById(data.tourPackageId);
  if (!finding) {
    throw { statusCode: 402, message: "Tour Package is not found" };
  }

  if (data.startDate > finding.startDate) {
    throw { statusCode: 400, message: "Start date must be in the future" };
  }

  const checkingBooked = await Booking.findOne({
    userId: bookedBy,
    tourPackageId: data.tourPackageId,
    startDate: data.startDate,
    endDate: data.endDate,
    bookingStatus: { $in: ["PENDING", "CONFIRMED"] },
  });
  if (checkingBooked) {
    throw { statusCode: 404, message: "Its already Booked" };
  }

  const booking = await Booking.create({
    userId: bookedBy,
    ...data,
    bookingStatus: "PENDING",
  });

  await Notification.create({
    userId: bookedBy,
    message: "Your booking has been placed successfully!🧳",
    type: "BOOKING",
  });

  await Notification.create({
    userId: finding.guideId,
    message: "📢 A new booking has been made on your package!",
    type: "BOOKING",
  });

  const socketId = userSocketMap.get(finding.guideId.toString());

  if (socketId) {
    io.to(socketId).emit("newBooking", {
      message: "📢 New booking received!",
    });
  }

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
  const filtering = bookings.filter((b) => b.tourPackageId !== null);
  return filtering;
};

const getAllBookings = async () => {
  return Booking.find()
    .populate("userId", "username email phoneNumber")
    .populate({
      path: "tourPackageId",
      select: "title price guideId",
      populate: {
        path: "guideId",
        select: "username email",
      },
    })
    .sort({ createdAt: -1 });
};

const confirmationBooking = async (id, userId) => {
  const booking = await Booking.findById(id).populate("tourPackageId");
  if (!booking) {
    throw { statusCode: 402, message: "Booking are not available" };
  }

  if (booking.tourPackageId.guideId.toString() !== userId.toString()) {
    throw { statusCode: 402, message: "Not Authorized" };
  }

  if (booking.bookingStatus === "CONFIRMED") {
    throw { statusCode: 400, message: "Booking is already confirmed" };
  }

  booking.bookingStatus = "CONFIRMED";

  if (booking.endDate < new Date()) {
    booking.bookingStatus = "COMPLETED";
  }

  await booking.save();

  await Notification.create({
    userId: booking.userId,
    message: "🎉 Your booking has been confirmed by the guide!",
    type: "BOOKING",
  });

  const socketId = userSocketMap.get(booking.userId.toString());

  if (socketId) {
    io.to(socketId).emit("bookingConfirmed", {
      message: "🎉 Your booking has been confirmed!",
    });
  }

  return booking;
};

const cancelBooking = async (id, userId) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw { statusCode: 402, message: "Booking not Found" };
  }

  if (booking.userId.toString() !== userId.toString()) {
    throw { statusCode: 402, message: "Not Authorized" };
  }

  booking.bookingStatus = "CANCELLED";
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

  booking.bookingStatus = "CANCELLED";
  await booking.save();

  await Notification.create({
    userId: booking.userId,
    message: "Your booking has been cancelled by the guide!",
    type: "BOOKING",
  });

  const socketId = userSocketMap.get(booking.userId.toString());

  if (socketId) {
    io.to(socketId).emit("bookingCancelled", {
      message: "❌ Your booking was cancelled by guide",
    });
  }

  return booking;
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

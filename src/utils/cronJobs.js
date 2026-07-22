import cron from "node-cron";
import Booking from "../Model/Booking.js";

export const startBookingCron = () => {
  // Runs every 1 minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await Booking.updateMany(
        {
          endDate: { $lt: now },
          bookingStatus: "CONFIRMED",
        },
        {
          $set: { bookingStatus: "COMPLETED" },
        },
      );
    } catch (error) {
      throw (
        error || {
          statusCode: 500,
          message: "Error updating bookings in cron job",
        }
      );
    }
  });
};

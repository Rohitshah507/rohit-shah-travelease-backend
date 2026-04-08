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

      console.log(`✅ Cron Ran: ${result.modifiedCount} bookings updated`);
    } catch (error) {
      console.error("❌ Cron Error:", error.message);
    }
  });
};

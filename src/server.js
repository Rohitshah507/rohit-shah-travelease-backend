import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initSocket } from "./utils/socket.js";
import http from "http";

import authRoute from "./Routes/authRoute.js";
import userRoute from "./Routes/userRoute.js";
import packageRoute from "./Routes/packageRoute.js";
import bookingRoute from "./Routes/bookingRoute.js";
import adminRoute from "./Routes/adminRoute.js";
import paymentRoute from "./Routes/paymentRoute.js";
import notificationRoute from "./Routes/notificationRoute.js";
import reviewRoute from "./Routes/reviewRoute.js";
import config from "./Config/config.js";
import connectDB from "./Config/db.js";
import logger from "./Middleware/logger.js";
import connectCloudinary from "./Config/cloudinary.js";
import { startBookingCron } from "./utils/cronJobs.js";

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(logger);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: /* process.env.FRONTEND_URL || */ "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoute);
app.use("/api/auth", userRoute);
app.use("/api/user", packageRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/auth", adminRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/review", reviewRoute);
app.use("/api/notifications", notificationRoute);

/* ---------- SERVER START ---------- */
const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    const port = process.env.PORT || 5000;

    initSocket(server);
    startBookingCron();

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

connectCloudinary();

startServer();

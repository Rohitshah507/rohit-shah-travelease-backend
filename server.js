import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import authRoute from "./src/Routes/authRoute.js";
import userRoute from "./src/Routes/userRoute.js";
import packageRoute from "./src/Routes/packageRoute.js";
import bookingRoute from "./src/Routes/bookingRoute.js";
import adminRoute from "./src/Routes/adminRoute.js";
import connectDB from "./src/Config/db.js";
import config from "./src/Config/config.js";
import logger from "./src/Middleware/logger.js";
import connectCloudinary from "./src/Config/cloudinary.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

/* ---------- MIDDLEWARE ---------- */
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  }),
);

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoute);
app.use("/api/auth", userRoute);
app.use("/api/user", upload.array("images", 5), packageRoute);
app.use("/api/booking", bookingRoute);
app.use("api/admin", adminRoute)

/* ---------- SERVER START ---------- */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

/* ---------- Cloudinary ---------- */
connectCloudinary();

startServer();

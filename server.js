import express from "express";
import authRoute from "./src/Routes/authRoute.js";
import connectDB from "./src/Config/db.js";
import config from "./src/Config/config.js";
import cors from "cors";

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoute);

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

startServer();

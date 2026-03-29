import User from "../Model/User.js";
import adminService from "../Service/adminService.js";
import { io, userSocketMap } from "../utils/socket.js";
import Notification from "../Model/Notification.js";

const getPendingGuides = async (req, res) => {
  try {
    const guides = await User.find({
      role: { $in: ["GUIDE"] },
      guideStatus: { $in: ["PENDING"] },
    }).select("-password -__v");

    res.status(200).json({
      success: true,
      message: "Pending Guides List",
      data: guides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const approveGuide = async (req, res) => {
  const { id } = req.params;

  const guide = await User.findById(id);

  if (!guide) {
    return res.status(404).json({ message: "Guide not found" });
  }

  if (!guide.role.includes("GUIDE")) {
    return res.status(400).json({ message: "User is not a guide" });
  }

  guide.guideStatus[0] = "APPROVED";
  await guide.save();

  await Notification.create({
    userId: guide._id,
    message: "Guide Approved Successfully!",
    type: "USER",
  });

  const socketId = userSocketMap.get(guide._id.toString());

  if (socketId) {
    io.to(socketId).emit("guideApproved", {
      message: "🎉 Your guide account is approved!",
    });
  }

  res.status(200).json({
    success: true,
  });
};

const rejectGuide = async (req, res) => {
  const { id } = req.params;

  const guide = await User.findById(id);

  if (!guide) {
    return res.status(404).json({ message: "Guide not found" });
  }

  if (!guide.role.includes("GUIDE")) {
    return res.status(400).json({ message: "User is not a guide" });
  }

  guide.guideStatus[0] = "REJECTED";
  await guide.save();

  res.status(200).json({
    message: "Guide rejected successfully",
  });
};

const getAllGuides = async (req, res) => {
  try {
    const allGuides = await User.find({
      role: { $in: ["GUIDE"] },
    }).select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "All Guides List",
      data: allGuides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const allBookings = await adminService.getAllBookings();

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

export default {
  getPendingGuides,
  approveGuide,
  rejectGuide,
  getAllGuides,
  getAllBookings,
};

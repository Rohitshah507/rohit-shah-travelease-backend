import adminService from "../Service/adminService.js";

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

  res.status(200).json({
    message: "Guide approved successfully",
  });
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

export default {approveGuide, getAllBookings}
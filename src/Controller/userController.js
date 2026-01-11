import { userService } from "../Service/userService.js";

const userController = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is not found",
      });
    }
    const userDetails = await userService(userId);

    res.status(200).json({
      success: true,
      message: "User Details Sent Successfully",
      user: {
        name: userDetails.name,
        email: userDetails.email,
        role: userDetails.role,
        isVerified: userDetails.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({
        success:false,
        message: error.message
    })
  }
};

export { userController }

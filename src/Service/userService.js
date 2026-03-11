import User from "../Model/User.js";

const userService = async (userId) => {
  const userDetails = await User.findById(userId).select(
    "-password -__v -verificationCode -verificationCodeExpiryTime",
  );

  if (!userDetails) {
    return { message: "User Details is not Found" };
  }

  return userDetails;
};

// UPDATE USER PROFILE
const updateUserService = async (userId, data) => {
  console.log(userId, data);
  const updatedUser = await User.findByIdAndUpdate(userId, data, {
    new: true,
  }).select("-password -__v");

  return updatedUser;
};

export { userService, updateUserService };

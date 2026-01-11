import User from "../Model/User.js";

const userService = async (userId) => {
  const userDetails = await User.findById(userId).select(
    "-password -__v -verificationCode -verificationCodeExpiryTime"
  );

  if (!userDetails) {
    return { message: "User Details is not Found" };
  }

  return userDetails;
};

export { userService };

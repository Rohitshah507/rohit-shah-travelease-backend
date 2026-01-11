import User from "../Model/User.js";
import { verifyToken } from "../utils/token.js";

const auth = async (req, res, next) => {
  try {
    const cookie = req.cookies.authToken;

    if (!cookie) {
      return res.status(400).send("User is not authenticated");
    }

    const data = await verifyToken(cookie);

    const user = await User.findById(data.userId);

    if (!user) return res.status(401).send("User not found");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

export default auth;

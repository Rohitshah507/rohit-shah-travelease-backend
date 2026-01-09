import { verifyToken } from "../utils/token.js";

const auth = async (req, res, next) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.status(401).send("User is not authenticated");
  }

  const authToken = cookie.split("=")[1];

  try {
    const data = await verifyToken(authToken);
    req.user = await User.findById(data.id);
    next();
  } catch (error) {
    res.status(401).send("User is not authenticated");
  }
};

export default auth;

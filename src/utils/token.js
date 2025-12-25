import jwt from "jsonwebtoken";

import config from "../Config/config.js";


const createToken = (data) => {
  return jwt.sign(data, config.jwtSecret, { expiresIn: "7d" });
};

const verifyToken = async (authToken) => {
  return await new Promise((resolve, reject) => {
    jwt.verify(authToken, config.jwtSecret, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};
export { createToken, verifyToken };

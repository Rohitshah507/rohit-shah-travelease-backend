import jwt from 'jsonwebtoken';

import config from '../Config/config.js';
import authService from '../Service/authService.js';

const createToken = () => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
};
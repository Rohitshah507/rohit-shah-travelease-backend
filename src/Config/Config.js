import dotenv from 'dotenv';
dotenv.config();

const config = {
    mongoDbUrl: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/',
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS
};
export default config;


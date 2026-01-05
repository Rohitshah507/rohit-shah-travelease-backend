import dotenv from "dotenv";
dotenv.config();

const config = {
  mongoDbUrl: process.env.MONGO_DB_URL || "",
  port: process.env.PORT || 5000,
  frontend_url: process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET || "",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  jwtSecret: process.env.JWT_SECRET, 
  smtp_host: process.env.SMTP_HOST,
  smtp_service: process.env.SMTP_SERVICE,
  smtp_port: process.env.SMTP_PORT,
  smtp_mail: process.env.SMTP_MAIL,
  smtp_password: process.env.SMTP_PASSWORD
};
export default config;

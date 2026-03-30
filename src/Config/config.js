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
  smtp_password: process.env.SMTP_PASSWORD,
  cloud_name: process.env.CLOUD_NAME || "",
  api_key: process.env.API_KEY || "",
  api_secret: process.env.API_SECRET || "",
  khalti: {
    api_key: process.env.KHALTI_API_KEY || "",
    api_url: process.env.KHALTI_API_URL || "",
    return_url: process.env.RETURN_URL || "",
  },
  gemini: {
    api_key: process.env.GEMINI_API_KEY || "",
    url: process.env.GEMINI_URL || "",
  },
  brevo_smtp_key: process.env.BREVO_SMTP_KEY,
  smtp_mail: process.env.SMTP_MAIL,
};
export default config;

import nodemailer from "nodemailer";
import config from "../Config/config.js";

// ✅ Create once, reuse — faster & more efficient
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: config.smtp_mail,
    pass: config.smtp_password, 
  },
});

const sendEmail = async ({ email, subject, message }) => {
  if (!email) {
    throw new Error("Email recipient is missing");
  }

  const mailOptions = {
    from: `"TravelEase" <${config.smtp_mail}>`,
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

export { sendEmail };
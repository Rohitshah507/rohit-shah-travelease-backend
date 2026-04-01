import nodemailer from "nodemailer";
import config from "../Config/config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.smtp_mail,
    pass: config.smtp_password,
  },
});

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  console.log("📧 Attempting email send...");
  console.log("SMTP_MAIL:", config.smtp_mail ? config.smtp_mail : "❌ MISSING");
  console.log("TO:", email);

  const mailOptions = {
    from: `"TravelEase" <${config.smtp_mail}>`,
    to: email,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email error code:", err.code);
    console.error("❌ Email error message:", err.message);
    throw err;
  }
};

export { sendEmail };
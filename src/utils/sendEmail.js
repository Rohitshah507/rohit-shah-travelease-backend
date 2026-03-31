import nodemailer from "nodemailer";
import config from "../Config/config.js";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: config.brevo_user,
    pass: config.brevo_pass,
  },
});

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  // 🔍 ADD THIS - log what credentials are being used
  console.log("📧 Attempting email send...");
  console.log("BREVO_USER:", config.brevo_user ? config.brevo_user : "❌ MISSING");
  console.log("BREVO_PASS:", config.brevo_pass ? "✅ EXISTS" : "❌ MISSING");
  console.log("TO:", email);

  const mailOptions = {
    from: `"TravelEase" <${config.brevo_user}>`,
    to: email,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    // 🔍 Log the FULL error object, not just message
    console.error("❌ Email error code:", err.code);
    console.error("❌ Email error message:", err.message);
    console.error("❌ Email error response:", err.response);
    throw err;
  }
};

export { sendEmail };
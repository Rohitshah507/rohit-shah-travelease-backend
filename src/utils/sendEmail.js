import nodemailer from "nodemailer";
import config from "../Config/config.js";

const sendEmail = async (email, { subject, message }) => {
  if (!email) {
    throw new Error("Email recipient is missing");
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    secure: false, // 587 = false
    auth: {
      user: config.smtp_mail,
      pass: config.smtp_password,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: config.smtp_mail,
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

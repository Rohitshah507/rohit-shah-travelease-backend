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
    console.error("❌ Email error:", err.message); // This will show in Railway logs
    throw err;
  }
};

export { sendEmail };
import nodemailer from "nodemailer";
import config from "../Config/config.js";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: config.smtp_mail,
        pass: config.smtp_password, // Must be Gmail App Password
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 100,
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 35000,
    });
  }
  return transporter;
};

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  const mailOptions = {
    from: `"TravelEase" <${config.smtp_mail}>`,
    to: email,
    subject: subject,
    html: message,
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const tp = getTransporter();
      await tp.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to: ${email}`);
      return;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed: ${error.message}`);

      if (attempt === 3) {
        throw new Error(`Failed to send email after 3 attempts: ${error.message}`);
      }

      // Reset transporter on timeout so it reconnects fresh
      if (error.code === "ETIMEDOUT" || error.code === "ECONNECTION") {
        transporter = null;
      }

      // Wait before retrying (1s, 2s)
      await new Promise(res => setTimeout(res, 1000 * attempt));
    }
  }
};

export { sendEmail };
import nodemailer from "nodemailer";
import config from "../Config/config.js";

const sendEmail = async ({ email, subject, message }) => {
  if (!email) {
    throw new Error("Email recipient is missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.smtp_mail,
      pass: config.smtp_password,
    },
  });

  const mailOptions = {
    from: config.smtp_mail,
    to: email,          
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

export { sendEmail };

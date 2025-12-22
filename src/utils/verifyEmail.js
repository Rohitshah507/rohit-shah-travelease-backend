import nodemailer from 'nodemailer';

import config from '../Config/config.js';

const verifyEmail = async (token, toEmail, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  const mailOptions = {
    from: config.emailUser,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Verification email sent");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};


export default verifyEmail;
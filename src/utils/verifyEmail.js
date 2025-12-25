import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

import config from "../Config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyEmail = async (token, toEmail, subject, htmlContent) => {
  const templatePath = path.join(__dirname, "template.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);

  const htmlToSend = template({ token: encodeURIComponent(token) });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  const mailOptions = {
    from: config.emailUser,
    to: toEmail,
    subject: subject,
    html: htmlToSend,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", toEmail);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default verifyEmail;

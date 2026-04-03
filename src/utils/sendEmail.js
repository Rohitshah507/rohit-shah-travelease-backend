import sgMail from "@sendgrid/mail";
import config from "../Config/config.js";

// Set API Key
sgMail.setApiKey(config.sendgrid_api_key);

const sendEmail = async (email, { subject, message }) => {
  if (!email) {
    throw new Error("Email recipient is missing");
  }

  const msg = {
    to: email,
    from: config.email_from, // verified sender
    subject: subject,
    html: message,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ Email sent successfully:", response);
  } catch (err) {
    console.error("❌ SendGrid error:", err.response?.body || err.message);
    throw err;
  }
};

export { sendEmail };
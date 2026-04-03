import { Resend } from 'resend';
import config from "../Config/config.js";

const resend = new Resend(config.resend_api_key);

const sendEmail = async (email, { subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  try {
    await resend.emails.send({
      from: 'NepFund <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: message,
    });
    console.log(`✅ OTP sent successfully to ${email}`);
  } catch (err) {
    console.error("❌ Resend error:", err.message);
    throw err;
  }
};

export { sendEmail };
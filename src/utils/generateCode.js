import { generateEmailTemplate } from "./emailTemplate.js";
import { resetEmailTemplate } from "./resetEmailTemplate.js";
import { sendEmail } from "./sendEmail.js";

const generateVerificationCode = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${firstDigit}${remainingDigits}`;
};

const sendVerificationCode = async (email, verificationCode) => {
  try {
    const message = generateEmailTemplate(verificationCode);
    await sendEmail(email, { subject: "Your Verification Code", message });
    console.log(`✅ OTP sent successfully to ${email}`);
  } catch (error) {
    // ✅ Log clearly in Render logs so you can debug
    console.error(`❌ Failed to send OTP to ${email}:`, error.message);
  }
};

const generateResetCode = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${firstDigit}${remainingDigits}`;
};

const sendResetCode = async (email, resetCode) => {
  try {
    const message = resetEmailTemplate(resetCode);
    await sendEmail(email, { subject: "Reset Code", message });
    console.log(`✅ Reset code sent successfully to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send reset code to ${email}:`, error.message);
  }
};

export {
  generateVerificationCode,
  sendVerificationCode,
  generateResetCode,
  sendResetCode,
};
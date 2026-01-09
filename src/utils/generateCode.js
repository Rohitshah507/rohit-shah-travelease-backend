import { generateEmailTemplate } from "./emailTemplate.js";
import { resetEmailTemplate } from "./resetEmailTemplate.js";
import { sendEmail } from "./sendEmail.js";

const generateVerificationCode = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigit = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, 0);

  return firstDigit + remainingDigit;
};

const sendVerificationCode = async (email, verificationCode) => {
  try {
    const message = generateEmailTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Your Verification Code",
      message,
    });

  } catch (error) {
    return {
        success: false,
        message: `Failed to send verification code: ${error.message}`,
    }
  }
};



const generateResetCode = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigit = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, 0);

  return firstDigit + remainingDigit;
};

const sendResetCode = async (email, resetCode) => {
  try {
    const message = resetEmailTemplate(resetCode);

    await sendEmail({
      email,
      subject: "Reset Code",
      message,
    });

  } catch (error) {
    return {
        success: false,
        message: `Failed to send reset code: ${error.message}`,
    }
  }
};




export { generateVerificationCode, sendVerificationCode, generateResetCode, sendResetCode };

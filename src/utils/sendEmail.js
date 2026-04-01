import SibApiV3Sdk from "@getbrevo/brevo";
import config from "../Config/config.js";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = config.brevo_api_key;

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { name: "TravelEase", email: "shahaaditya1111@gmail.com" };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = message;

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent:", result.body.messageId);
  } catch (err) {
    console.error("❌ Brevo API error:", err.message);
    throw err;
  }
};

export { sendEmail };
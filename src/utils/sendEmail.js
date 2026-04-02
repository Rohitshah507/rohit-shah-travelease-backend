import SibApiV3Sdk from "@sendinblue/client";
import config from "../Config/config.js";

// Initialize Brevo client
const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.brevo_api_key);

const sendEmail = async (email, { subject, message }) => {
  if (!email) {
    throw new Error("Email recipient is missing");
  }

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email }],
    sender: { email: config.smtp_mail, name: "Your App Name" },
    subject: subject,
    htmlContent: message,
  });

  try {
    const response = await client.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", response);
  } catch (err) {
    console.error("❌ Email error:", err);
    throw err;
  }
};

export { sendEmail };
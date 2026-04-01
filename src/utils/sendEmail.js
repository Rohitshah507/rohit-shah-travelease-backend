import config from "../Config/config.js";

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": config.brevo_api_key,
    },
    body: JSON.stringify({
      sender: { name: "TravelEase", email: "shahaaditya1111@gmail.com" },
      to: [{ email }],
      subject: subject,
      htmlContent: message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Brevo API error:", JSON.stringify(data));
    throw new Error(data.message || "Failed to send email");
  }

  console.log("✅ Email sent:", data.messageId);
};

export { sendEmail };
import config from "../Config/config.js";

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.resend_api_key}`,
    },
    body: JSON.stringify({
      from: "TravelEase <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Resend error:", JSON.stringify(data));
    throw new Error(data.message || "Failed to send email");
  }

  console.log("✅ Email sent:", data.id);
};

export { sendEmail };
import config from "../Config/config.js";

const sendEmail = async ( email, {subject, message }) => {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.sendgrid_api_key}`,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: "noreply@sendgrid.net", name: "TravelEase" },
      subject: subject,
      content: [{ type: "text/html", value: message }],
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    console.error("❌ SendGrid error:", JSON.stringify(data));
    throw new Error("Failed to send email");
  }

  console.log("✅ Email sent via SendGrid");
};

export { sendEmail };
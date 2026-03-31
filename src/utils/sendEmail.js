import { Resend } from 'resend';
import config from '../Config/config.js';

const resend = new Resend(config.resend_api_key);

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Email recipient is missing");

  const { error } = await resend.emails.send({
    from: 'TravelEase <onboarding@resend.dev>',
    to: email,
    subject: subject,
    html: message,
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log(`✅ Email sent successfully to ${email}`);
};

export { sendEmail };
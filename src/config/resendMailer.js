const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    return await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      html,
    });
  } catch (error) {
    console.error("[RESEND ERROR]", error);
    return null;
  }
};

module.exports = sendEmail;

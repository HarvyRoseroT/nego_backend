const { Resend } = require("resend");

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("⚠️ RESEND_API_KEY not defined. Emails disabled.");
}

const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    console.log("Email skipped — Resend not configured.");
    return null;
  }

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

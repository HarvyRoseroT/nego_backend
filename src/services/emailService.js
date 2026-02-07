const sendEmail = require("../config/resendMailer");

exports.sendVerificationEmail = async ({ to, token }) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  return sendEmail({
    to,
    subject: "Verifica tu correo electrónico",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px">
        <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:24px">
          <h2>Verifica tu correo</h2>
          <p>Gracias por registrarte.</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 20px;background:#3fa10a;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
            Verificar correo
          </a>
        </div>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async ({ to, token }) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return sendEmail({
    to,
    subject: "Restablece tu contraseña",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px">
        <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:24px">
          <h2>Restablecer contraseña</h2>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#3fa10a;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
            Cambiar contraseña
          </a>
        </div>
      </div>
    `,
  });
};

exports.sendPaymentSuccessEmail = async ({ to, amount, currency, invoiceUrl }) => {
  return sendEmail({
    to,
    subject: "Pago confirmado",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px">
        <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:24px">
          <h2>Pago recibido</h2>
          <p>Monto: ${amount} ${currency}</p>
          <a href="${invoiceUrl}" style="display:inline-block;padding:12px 20px;background:#3fa10a;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
            Ver factura
          </a>
        </div>
      </div>
    `,
  });
};

exports.sendRenewalEmail = async ({ to, amount, currency, invoiceUrl }) => {
  return sendEmail({
    to,
    subject: "Tu suscripción fue renovada",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px">
        <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:24px">
          <h2>Renovación exitosa</h2>
          <p>Monto: ${amount} ${currency}</p>
          <a href="${invoiceUrl}" style="display:inline-block;padding:12px 20px;background:#3fa10a;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
            Ver factura
          </a>
        </div>
      </div>
    `,
  });
};

exports.sendPaymentFailedEmail = async ({ to }) => {
  return sendEmail({
    to,
    subject: "Problema con tu pago",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px">
        <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:24px">
          <h2>Pago fallido</h2>
          <p>No pudimos procesar tu pago.</p>
        </div>
      </div>
    `,
  });
};

exports.sendCancellationScheduledEmail = async ({ to, endDate }) => {
  return sendEmail({
    to,
    subject: "Tu suscripción se cancelará",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px">
        <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:24px">
          <h2>Cancelación programada</h2>
          <p>Tu suscripción estará activa hasta ${endDate.toLocaleDateString()}.</p>
        </div>
      </div>
    `,
  });
};

exports.sendCancellationEmail = async ({ to }) => {
  return sendEmail({
    to,
    subject: "Suscripción cancelada",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px">
        <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:24px">
          <h2>Suscripción cancelada</h2>
          <p>Tu suscripción ha sido cancelada.</p>
        </div>
      </div>
    `,
  });
};

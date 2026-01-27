const sendEmail = require("../config/sesMailer");

exports.sendVerificationEmail = async ({ to, token }) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  return sendEmail({
    to,
    subject: "Verifica tu correo electrónico",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:24px">
        <div style="max-width:520px; margin:auto; background:white; border-radius:12px; padding:24px">
          <h2 style="color:#111827">Verifica tu correo</h2>
          <p style="color:#374151">
            Gracias por registrarte. Para activar tu cuenta, haz clic en el botón de abajo.
          </p>
          <a href="${verifyUrl}"
             style="display:inline-block;margin:24px 0;padding:12px 20px;background:#3fa10a;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
            Verificar correo
          </a>
          <p style="color:#6b7280;font-size:14px">
            Este enlace expira en 30 minutos.
          </p>
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
      <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:24px">
        <div style="max-width:520px; margin:auto; background:white; border-radius:12px; padding:24px">
          <h2 style="color:#111827">Restablecer contraseña</h2>
          <p style="color:#374151">
            Hemos recibido una solicitud para cambiar tu contraseña.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;margin:24px 0;padding:12px 20px;background:#3fa10a;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
            Cambiar contraseña
          </a>
          <p style="color:#6b7280;font-size:14px">
            Este enlace expira en 30 minutos.
            Si no solicitaste este cambio, puedes ignorar este correo.
          </p>
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
      <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:24px">
        <div style="max-width:520px; margin:auto; background:white; border-radius:12px; padding:24px">
          <h2 style="color:#111827">Pago recibido</h2>
          <p style="color:#374151">
            Hemos recibido tu pago correctamente.
          </p>
          <p style="font-weight:600; margin:16px 0">
            Monto: ${amount} ${currency}
          </p>
          <a href="${invoiceUrl}"
             style="display:inline-block;padding:12px 20px;background:#3fa10a;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
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
      <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:24px">
        <div style="max-width:520px; margin:auto; background:white; border-radius:12px; padding:24px">
          <h2 style="color:#b91c1c">Pago fallido</h2>
          <p style="color:#374151">
            No pudimos procesar tu último pago.
            Te recomendamos revisar tu método de pago.
          </p>
        </div>
      </div>
    `,
  });
};

exports.sendPlanChangeEmail = async ({ to, planName }) => {
  return sendEmail({
    to,
    subject: "Tu plan ha sido actualizado",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:24px">
        <div style="max-width:520px; margin:auto; background:white; border-radius:12px; padding:24px">
          <h2 style="color:#111827">Plan actualizado</h2>
          <p style="color:#374151">
            Tu suscripción ahora está activa en el plan:
          </p>
          <p style="font-weight:600; margin:16px 0">
            ${planName}
          </p>
        </div>
      </div>
    `,
  });
};

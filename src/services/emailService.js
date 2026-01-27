const transporter = require("../config/mailer");


const safeSendMail = async (options) => {
  try {
    console.log("[MAILER] Attempting to send email", {
      to: options.to,
      subject: options.subject,
    });

    const info = await transporter.sendMail(options);

    console.log("[MAILER] Email sent successfully", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return info;
  } catch (error) {
    console.error("[MAILER ERROR]", {
      code: error.code,
      message: error.message,
      response: error.response,
      stack: error.stack,
    });

    throw error;
  }
};



exports.sendVerificationEmail = async ({ to, token }) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await safeSendMail({
    from: process.env.SMTP_FROM,
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
             style="
               display:inline-block;
               margin:24px 0;
               padding:12px 20px;
               background:#3fa10a;
               color:white;
               text-decoration:none;
               border-radius:8px;
               font-weight:600;
             ">
            Verificar correo
          </a>

          <p style="color:#6b7280; font-size:14px">
            Este enlace expira en 30 minutos.
          </p>

          <hr style="margin:24px 0" />

          <p style="font-size:12px; color:#9ca3af">
            Nego · Seguridad de cuenta
          </p>
        </div>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async ({ to, token }) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await safeSendMail({
    from: process.env.SMTP_FROM,
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
             style="
               display:inline-block;
               margin:24px 0;
               padding:12px 20px;
               background:#3fa10a;
               color:white;
               text-decoration:none;
               border-radius:8px;
               font-weight:600;
             ">
            Cambiar contraseña
          </a>

          <p style="color:#6b7280; font-size:14px">
            Este enlace expira en 30 minutos.
            Si no solicitaste este cambio, puedes ignorar este correo.
          </p>

          <hr style="margin:24px 0" />

          <p style="font-size:12px; color:#9ca3af">
            Nego · Seguridad de cuenta
          </p>
        </div>
      </div>
    `,
  });
};


exports.sendPaymentSuccessEmail = async ({ to, amount, currency, invoiceUrl }) => {
  await safeSendMail({
    from: process.env.SMTP_FROM,
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
             style="
               display:inline-block;
               padding:12px 20px;
               background:#3fa10a;
               color:white;
               text-decoration:none;
               border-radius:8px;
               font-weight:600;
             ">
            Ver factura
          </a>

          <hr style="margin:24px 0" />
          <p style="font-size:12px; color:#9ca3af">
            Nego · Facturación
          </p>
        </div>
      </div>
    `,
  });
};


exports.sendPaymentFailedEmail = async ({ to }) => {
  await safeSendMail({
    from: process.env.SMTP_FROM,
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

          <hr style="margin:24px 0" />
          <p style="font-size:12px; color:#9ca3af">
            Nego · Facturación
          </p>
        </div>
      </div>
    `,
  });
};


exports.sendPlanChangeEmail = async ({ to, planName }) => {
  await safeSendMail({
    from: process.env.SMTP_FROM,
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

          <hr style="margin:24px 0" />
          <p style="font-size:12px; color:#9ca3af">
            Nego · Suscripciones
          </p>
        </div>
      </div>
    `,
  });
};

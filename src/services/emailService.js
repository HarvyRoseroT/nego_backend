const sendEmail = require("../config/resendMailer");

exports.sendVerificationEmail = async ({ to, token }) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  return sendEmail({
    to,
    subject: "Verifica tu correo electrónico",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:40px 16px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:14px;padding:40px 32px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
          
          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:#3fa10a15;color:#3fa10a;font-weight:700;padding:8px 14px;border-radius:20px;font-size:13px;letter-spacing:.5px;">
              CONFIRMACIÓN DE CUENTA
            </div>
          </div>

          <h2 style="margin:0 0 12px 0;font-size:24px;color:#111827;text-align:center;">
            Verifica tu correo electrónico
          </h2>

          <p style="margin:0 0 24px 0;font-size:15px;color:#4b5563;line-height:1.6;text-align:center;">
            Gracias por registrarte. Para activar tu cuenta y comenzar a usar la plataforma,
            confirma tu dirección de correo haciendo clic en el botón inferior.
          </p>

          <div style="text-align:center;margin:32px 0;">
            <a 
              href="${verifyUrl}" 
              style="
                display:inline-block;
                padding:14px 26px;
                background:#3fa10a;
                color:#ffffff;
                text-decoration:none;
                border-radius:10px;
                font-weight:700;
                font-size:15px;
                box-shadow:0 6px 14px rgba(63,161,10,0.25);
              "
            >
              Verificar mi correo
            </a>
          </div>

          <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-align:center;">
            Si no creaste esta cuenta, puedes ignorar este mensaje.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            Este enlace expirará en 24 horas por seguridad.
          </p>

        </div>
      </div>
    `

  });
};

exports.sendPasswordResetEmail = async ({ to, token }) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return sendEmail({
    to,
    subject: "Restablece tu contraseña",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:40px 16px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:14px;padding:40px 32px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:#3fa10a15;color:#3fa10a;font-weight:700;padding:8px 14px;border-radius:20px;font-size:13px;letter-spacing:.5px;">
              SOLICITUD DE SEGURIDAD
            </div>
          </div>

          <h2 style="margin:0 0 12px 0;font-size:24px;color:#111827;text-align:center;">
            Restablecer contraseña
          </h2>

          <p style="margin:0 0 24px 0;font-size:15px;color:#4b5563;line-height:1.6;text-align:center;">
            Recibimos una solicitud para cambiar la contraseña de tu cuenta.
            Si fuiste tú, haz clic en el botón inferior para continuar.
          </p>

          <div style="text-align:center;margin:32px 0;">
            <a 
              href="${resetUrl}" 
              style="
                display:inline-block;
                padding:14px 26px;
                background:#3fa10a;
                color:#ffffff;
                text-decoration:none;
                border-radius:10px;
                font-weight:700;
                font-size:15px;
                box-shadow:0 6px 14px rgba(63,161,10,0.25);
              "
            >
              Cambiar mi contraseña
            </a>
          </div>

          <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-align:center;">
            Si no solicitaste este cambio, puedes ignorar este mensaje.
            Tu contraseña actual seguirá siendo válida.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            Este enlace expirará en 1 hora por motivos de seguridad.
          </p>

        </div>
      </div>
    `

  });
};

exports.sendPaymentSuccessEmail = async ({ to, amount, currency, invoiceUrl }) => {
  return sendEmail({
    to,
    subject: "Pago confirmado",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:40px 16px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:14px;padding:40px 32px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:#3fa10a15;color:#3fa10a;font-weight:700;padding:8px 14px;border-radius:20px;font-size:13px;letter-spacing:.5px;">
              PAGO CONFIRMADO
            </div>
          </div>

          <h2 style="margin:0 0 12px 0;font-size:24px;color:#111827;text-align:center;">
            Hemos recibido tu pago
          </h2>

          <p style="margin:0 0 28px 0;font-size:15px;color:#4b5563;line-height:1.6;text-align:center;">
            Tu transacción fue procesada correctamente. A continuación puedes ver el resumen del pago realizado.
          </p>

          <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin:24px 0;">
            <div style="display:flex;justify-content:space-between;font-size:14px;color:#374151;margin-bottom:8px;">
              <span style="font-weight:600;">Monto pagado</span>
              <span style="font-weight:700;color:#111827;">${amount} ${currency}</span>
            </div>
          </div>

          <div style="text-align:center;margin:32px 0;">
            <a 
              href="${invoiceUrl}" 
              style="
                display:inline-block;
                padding:14px 26px;
                background:#3fa10a;
                color:#ffffff;
                text-decoration:none;
                border-radius:10px;
                font-weight:700;
                font-size:15px;
                box-shadow:0 6px 14px rgba(63,161,10,0.25);
              "
            >
              Ver factura
            </a>
          </div>

          <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-align:center;">
            Si tienes alguna pregunta sobre este pago, puedes responder a este correo.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            Gracias por confiar en nosotros.
          </p>

        </div>
      </div>
    `

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
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:40px 16px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:14px;padding:40px 32px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:#fee2e2;color:#b91c1c;font-weight:700;padding:8px 14px;border-radius:20px;font-size:13px;letter-spacing:.5px;">
              PAGO NO PROCESADO
            </div>
          </div>

          <h2 style="margin:0 0 12px 0;font-size:24px;color:#111827;text-align:center;">
            No pudimos procesar tu pago
          </h2>

          <p style="margin:0 0 24px 0;font-size:15px;color:#4b5563;line-height:1.6;text-align:center;">
            Hubo un inconveniente al intentar realizar el cobro. Esto puede deberse a fondos insuficientes,
            tarjeta vencida o un rechazo del banco emisor.
          </p>

          <div style="background:#fef2f2;border-radius:12px;padding:20px;margin:24px 0;font-size:14px;color:#7f1d1d;">
            Te recomendamos verificar tu método de pago o intentar nuevamente desde tu panel de suscripción.
          </div>

          <div style="text-align:center;margin:32px 0;">
            <a 
              href="${retryUrl}" 
              style="
                display:inline-block;
                padding:14px 26px;
                background:#3fa10a;
                color:#ffffff;
                text-decoration:none;
                border-radius:10px;
                font-weight:700;
                font-size:15px;
                box-shadow:0 6px 14px rgba(63,161,10,0.25);
              "
            >
              Intentar nuevamente
            </a>
          </div>

          <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-align:center;">
            Si el problema persiste, puedes contactar con soporte para ayudarte.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            Tu acceso podría verse afectado si el pago no se regulariza.
          </p>

        </div>
      </div>
    `

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

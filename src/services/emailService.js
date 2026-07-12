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

exports.sendPlanExpiredEmail = async ({ to }) => {
  return sendEmail({
    to,
    subject: "Tu plan ha finalizado",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:40px 16px;">
        <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:14px;padding:40px 32px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:#ef444415;color:#ef4444;font-weight:700;padding:8px 14px;border-radius:20px;font-size:13px;letter-spacing:.5px;">
              PLAN FINALIZADO
            </div>
          </div>

          <h2 style="margin:0 0 12px 0;font-size:24px;color:#111827;text-align:center;">
            Tu suscripción ha expirado
          </h2>

          <p style="margin:0 0 28px 0;font-size:15px;color:#4b5563;line-height:1.6;text-align:center;">
            El período de tu plan ha terminado y actualmente tu cuenta se encuentra inactiva.
          </p>

          <p style="margin:0 0 28px 0;font-size:15px;color:#4b5563;line-height:1.6;text-align:center;">
            Para continuar utilizando todas las funcionalidades de Nego, debes realizar un nuevo pago.
          </p>

          <div style="text-align:center;margin:32px 0;">
            <a 
              href="${process.env.FRONTEND_URL}/configuracion" 
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
              Reactivar mi plan
            </a>
          </div>

          <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-align:center;">
            Si tienes alguna pregunta, puedes responder a este correo.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            Esperamos verte nuevamente pronto.
          </p>

        </div>
      </div>
    `,
    text: `
        Tu plan ha finalizado.

        El período de tu suscripción terminó y tu cuenta se encuentra inactiva.

        Para continuar utilizando Nego, realiza un nuevo pago aquí:
        ${process.env.FRONTEND_URL}

        Gracias por confiar en nosotros.
        `
  });
};


exports.sendPartnerWelcomeEmail = async ({ to, name, password, referralCode }) => {
  const panelUrl = process.env.FRONTEND_URL;

  return sendEmail({
    to,
    subject: "Tu acceso como Partner de Nego",
    html: `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:40px 16px;">
      <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:14px;padding:40px 32px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#3fa10a15;color:#3fa10a;font-weight:700;padding:8px 14px;border-radius:20px;font-size:13px;letter-spacing:.5px;">
            NUEVO PARTNER
          </div>
        </div>

        <h2 style="margin:0 0 12px 0;font-size:24px;color:#111827;text-align:center;">
          Bienvenido al programa de Partners de Nego
        </h2>

        <p style="margin:0 0 24px 0;font-size:15px;color:#4b5563;line-height:1.6;text-align:center;">
          Tu cuenta de partner ha sido creada exitosamente.  
          Desde el panel podrás ver tus clientes referidos, comisiones y estadísticas.
        </p>

        <div style="background:#ecfdf5;border-radius:10px;padding:18px 20px;margin:24px 0;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:13px;color:#065f46;">
            Tu código de referido
          </p>
          <p style="margin:0;font-size:22px;font-weight:700;color:#10b981;letter-spacing:2px;">
            ${referralCode}
          </p>
        </div>

        <div style="background:#f3f4f6;border-radius:10px;padding:18px 20px;margin:24px 0;">
          <p style="margin:0 0 10px 0;font-size:14px;color:#111827;">
            <strong>Acceso al panel</strong>
          </p>

          <p style="margin:0;font-size:14px;color:#374151;">
            <strong>Email:</strong> ${to}
          </p>

          <p style="margin:6px 0 0 0;font-size:14px;color:#374151;">
            <strong>Contraseña:</strong> ${password}
          </p>
        </div>

        <div style="text-align:center;margin:32px 0;">
          <a
            href="${panelUrl}"
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
            Ir al panel de partners
          </a>
        </div>

        <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-align:center;">
          Comparte tu código con restaurantes para comenzar a generar comisiones.
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

        <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
          Nego — Plataforma de digitalización para restaurantes
        </p>

      </div>
    </div>
    `
  });
};
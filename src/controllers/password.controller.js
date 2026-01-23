const { User, PasswordResetToken } = require("../models");
const { hashPassword } = require("../utils/password");
const { generateEmailToken } = require("../utils/emailToken");
const { sendPasswordResetEmail } = require("../services/emailService");

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      const token = generateEmailToken();

      await PasswordResetToken.create({
        user_id: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      });

      await sendPasswordResetEmail({
        to: user.email,
        token,
      });
    }

    res.json({
      message:
        "Si el correo existe, recibirás un enlace para cambiar tu contraseña.",
    });
  } catch (error) {
    console.error("REQUEST PASSWORD RESET ERROR:", error);
    res.status(500).json({
      message: "Error requesting password reset",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const record = await PasswordResetToken.findOne({
      where: {
        token,
        usedAt: null,
      },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    const user = await User.findByPk(record.user_id);

    if (!user) {
      return res.status(400).json({
        message: "Usuario no encontrado",
      });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    record.usedAt = new Date();
    await record.save();

    res.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      message: "Error resetting password",
    });
  }
};

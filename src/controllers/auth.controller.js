const { User, Subscription, Plan, EmailVerificationToken } = require("../models");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { generateEmailToken } = require("../utils/emailToken");
const { sendVerificationEmail } = require("../services/emailService");
const stripe = require("../config/stripe");
const sequelize = require("../config/database");
const { Op } = require("sequelize");


exports.register = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email }, transaction: t });
    if (exists) {
      await t.rollback();
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create(
      {
        name,
        email,
        password: await hashPassword(password),
        role: "client",
        emailVerified: false,
      },
      { transaction: t }
    );

    await Subscription.create(
      {
        user_id: user.id,
        status: "trial",
        start_date: new Date(),
        trial_end_date: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
      { transaction: t }
    );

    const token = generateEmailToken();

    await EmailVerificationToken.create(
      {
        user_id: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
      { transaction: t }
    );

    await sendVerificationEmail({
      to: user.email,
      token,
    });

    await t.commit();

    return res.status(201).json({
      message:
        "Usuario creado exitosamente. Por favor revisa tu bandeja de entrada o Spam.",
    });
  } catch (error) {
    await t.rollback();
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Register error" });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const record = await EmailVerificationToken.findOne({
      where: {
        token,
        usedAt: null,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(record.user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      record.usedAt = new Date();
      await record.save();
      return res.json({ message: "Email verified successfully" });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();

    if (!user.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
          role: user.role,
        },
      });

      user.stripe_customer_id = customer.id;
    }

    await user.save();

    record.usedAt = new Date();
    await record.save();

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return res.status(500).json({ message: "Verification error" });
  }
};


exports.resendVerification = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { email } = req.body;

    if (!email) {
      await t.rollback();
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
      transaction: t,
    });

    if (!user) {
      await t.commit();
      return res.json({
        message:
          "Si el correo existe, se enviará un nuevo enlace de verificación.",
      });
    }

    if (user.emailVerified) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Email is already verified" });
    }

    await EmailVerificationToken.update(
      { usedAt: new Date() },
      {
        where: {
          user_id: user.id,
          usedAt: null,
        },
        transaction: t,
      }
    );

    const token = generateEmailToken();

    await EmailVerificationToken.create(
      {
        user_id: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
      { transaction: t }
    );

    await sendVerificationEmail({
      to: user.email,
      token,
    });

    await t.commit();

    return res.json({
      message:
        "Si el correo existe, se enviará un nuevo enlace de verificación.",
    });
  } catch (error) {
    await t.rollback();
    console.error("RESEND VERIFICATION ERROR:", error);
    return res.status(500).json({ message: "Resend verification error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.scope("withPassword").findOne({
      where: { email },
      include: [
        {
          model: Subscription,
          attributes: [
            "id",
            "status",
            "start_date",
            "trial_end_date",
            "end_date",
          ],
          include: [
            {
              model: Plan,
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    await user.updateLastLogin();

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.Subscription || null,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role", "stripe_customer_id", "notification_preferences"],
      include: [
        {
          model: Subscription,
          attributes: [
            "id",
            "status",
            "start_date",
            "trial_end_date",
            "end_date",
          ],
          include: [
            {
              model: Plan,
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscription = user.Subscription
      ? {
          id: user.Subscription.id,
          status: user.Subscription.status,

          ends_at:
            user.Subscription.trial_end_date ||
            user.Subscription.end_date ||
            null,

          Plan: user.Subscription.Plan
            ? {
                id: user.Subscription.Plan.id,
                name: user.Subscription.Plan.name,
                price: user.Subscription.Plan.price,
              }
            : null,
        }
      : null;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      stripe_customer_id: user.stripe_customer_id,
      subscription,
      notification_preferences: user.notification_preferences,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({
    message: "Logout successful",
  });
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      emails_pagos,
      emails_cambios_plan,
      emails_novedades
    } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notification_preferences = {
      emails_pagos:
        typeof emails_pagos === "boolean"
          ? emails_pagos
          : user.notification_preferences.emails_pagos,

      emails_cambios_plan:
        typeof emails_cambios_plan === "boolean"
          ? emails_cambios_plan
          : user.notification_preferences.emails_cambios_plan,

      emails_novedades:
        typeof emails_novedades === "boolean"
          ? emails_novedades
          : user.notification_preferences.emails_novedades
    };

    await user.save();

    return res.json({
      message: "Notification preferences updated",
      notification_preferences: user.notification_preferences
    });
  } catch (error) {
    console.error("UPDATE NOTIFICATION PREFERENCES ERROR:", error);
    return res
      .status(500)
      .json({ message: "Error updating notification preferences" });
  }
};

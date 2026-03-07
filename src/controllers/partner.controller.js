const sequelize = require("../config/database");
const { hashPassword } = require("../utils/hash");
const { generateReferralCodeFromName } = require("../utils/referralCode");
const { Commission, Referral, PartnerProfile, User } = require("../models");
const { Op } = require("sequelize");
const { sendPartnerWelcomeEmail } = require("../services/emailService");

exports.createPartner = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      await t.rollback();
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const exists = await User.findOne({
      where: { email },
      transaction: t,
    });

    if (exists) {
      await t.rollback();
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const referralCode = await generateReferralCodeFromName(name, t);

    const hashedPassword = await hashPassword(password);

    const user = await User.create(
      {
        name,
        email,
        password: hashedPassword,
        role: "partner",
        emailVerified: true,
        isActive: true,
      },
      { transaction: t }
    );

    await PartnerProfile.create(
      {
        user_id: user.id,
        referral_code: referralCode,
        is_active: true,
      },
      { transaction: t }
    );

    await t.commit();

    try {
      await sendPartnerWelcomeEmail({
        to: email,
        name,
        password,
        referralCode,
      });
    } catch (emailError) {
      console.error("PARTNER EMAIL ERROR:", emailError);
    }

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode,
      active: user.isActive,
    });

  } catch (error) {
    await t.rollback();

    console.error("CREATE PARTNER ERROR:", error);

    return res.status(500).json({
      message: "Error creando partner",
      error: error.message,
    });
  }
};

exports.validateReferralCode = async (req, res) => {
  try {
    const { code } = req.params;

    const partner = await PartnerProfile.findOne({
      where: {
        referral_code: code,
        is_active: true,
      },
    });

    if (!partner) {
      return res.status(404).json({ valid: false });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(500).json({ valid: false });
  }
};

exports.listPartners = async (req, res) => {
  try {
    const partners = await User.findAll({
      where: { role: "partner" },
      attributes: ["id", "name", "email", "isActive"],
      include: [
        {
          model: PartnerProfile,
          attributes: ["referral_code", "is_active"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = partners.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      active: p.isActive,
      referralCode: p.PartnerProfile?.referral_code || null,
      profileActive: p.PartnerProfile?.is_active || false,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("LIST PARTNERS ERROR:", error);
    return res.status(500).json({
      message: "Error obteniendo partners",
    });
  }
};

exports.updatePartnerStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  if (typeof active !== "boolean") {
    return res.status(400).json({
      message: "Active must be boolean",
    });
  }

  const t = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { id, role: "partner" },
      transaction: t,
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({
        message: "Partner not found",
      });
    }

    await user.update(
      { isActive: active },
      { transaction: t }
    );

    await PartnerProfile.update(
      { is_active: active },
      { where: { user_id: user.id }, transaction: t }
    );

    await t.commit();

    return res.json({
      message: active
        ? "Partner activado correctamente"
        : "Partner desactivado correctamente",
    });
  } catch (error) {
    await t.rollback();
    console.error("UPDATE PARTNER STATUS ERROR:", error);
    return res.status(500).json({
      message: "Error actualizando estado del partner",
    });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, role: "partner" },
    });

    if (!user) {
      return res.status(404).json({
        message: "Partner no encontrado",
      });
    }

    await user.update({ isActive: false });

    await PartnerProfile.update(
      { is_active: false },
      { where: { user_id: id } }
    );

    return res.status(200).json({
      message: "Partner desactivado correctamente",
    });
  } catch (error) {
    console.error("DELETE PARTNER ERROR:", error);
    return res.status(500).json({
      message: "Error eliminando partner",
    });
  }
};

exports.listCommissions = async (req, res) => {
  try {

    const commissions = await Commission.findAll({
      include: [
        {
          model: Referral,
          include: [
            {
              model: PartnerProfile,
              attributes: ["id", "referral_code"],
              include: [
                {
                  model: User,
                  attributes: ["id", "name", "email"]
                }
              ]
            },
            {
              model: User,
              as: "client",
              attributes: ["id", "name", "email"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return res.json(commissions);

  } catch (error) {
    console.error("LIST COMMISSIONS ERROR:", error);
    return res.status(500).json({
      message: "Error obteniendo comisiones"
    });
  }
};

exports.payCommissions = async (req, res) => {
  try {

    const { commissionIds } = req.body;

    if (!Array.isArray(commissionIds) || commissionIds.length === 0) {
      return res.status(400).json({
        message: "commissionIds required"
      });
    }

    const commissions = await Commission.findAll({
      where: {
        id: {
          [Op.in]: commissionIds
        },
        status: "approved"
      }
    });

    if (!commissions.length) {
      return res.status(400).json({
        message: "No approved commissions found"
      });
    }

    await Commission.update(
      {
        status: "paid",
        paid_at: new Date()
      },
      {
        where: {
          id: {
            [Op.in]: commissionIds
          },
          status: "approved"
        }
      }
    );

    return res.json({
      message: "Commissions marked as paid"
    });

  } catch (error) {
    console.error("PAY COMMISSIONS ERROR:", error);
    return res.status(500).json({
      message: "Error paying commissions"
    });
  }
};

exports.listAllPayments = async (req, res) => {
  try {
    const payments = await Commission.findAll({
      include: [
        {
          model: Referral,
          include: [
            {
              model: User,
              as: "client",
              attributes: ["id", "name", "email"]
            },
            {
              model: PartnerProfile,
              include: [
                {
                  model: User,
                  attributes: ["id", "name", "email"]
                }
              ]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.json(payments);

  } catch (error) {
    console.error("LIST PAYMENTS ERROR:", error);
    return res.status(500).json({
      message: "Error obteniendo pagos"
    });
  }
};
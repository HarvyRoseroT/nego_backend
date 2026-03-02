const sequelize = require("../config/database");
const { User, PartnerProfile } = require("../models");
const { hashPassword } = require("../utils/hash");
const { generateReferralCodeFromName } = require("../utils/referralCode");

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

    const exists = await User.findOne({ where: { email }, transaction: t });
    if (exists) {
      await t.rollback();
      return res.status(400).json({ message: "Email already registered" });
    }

    const referralCode = await generateReferralCodeFromName(name, t);

    const user = await User.create(
      {
        name,
        email,
        password: await hashPassword(password),
        role: "partner",
        emailVerified: true,
        isActive: true
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

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode,
      active: user.isActive
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
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
      message: "Partner creado correctamente",
      referralCode,
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
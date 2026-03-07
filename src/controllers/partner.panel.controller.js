const { Commission, Referral, PartnerProfile, User } = require("../models");
const { Op } = require("sequelize");

exports.getPartnerDashboard = async (req, res) => {
  try {
    const partnerProfile = await PartnerProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (!partnerProfile) {
      return res.status(404).json({ message: "Partner profile not found" });
    }

    const referrals = await Referral.findAll({
      where: { partner_id: partnerProfile.id },
      attributes: ["id"]
    });

    const referralIds = referrals.map(r => r.id);

    if (!referralIds.length) {
      return res.json({
        referrals: 0,
        totals: {
          total_generated: 0,
          available: 0,
          pending: 0,
          paid: 0
        }
      });
    }

    const totals = await Commission.findOne({
      attributes: [
        [
          Commission.sequelize.literal(
            "COALESCE(SUM(commission_amount),0)"
          ),
          "total_generated"
        ],
        [
          Commission.sequelize.literal(
            "COALESCE(SUM(CASE WHEN status = 'approved' THEN commission_amount ELSE 0 END),0)"
          ),
          "available"
        ],
        [
          Commission.sequelize.literal(
            "COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END),0)"
          ),
          "pending"
        ],
        [
          Commission.sequelize.literal(
            "COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END),0)"
          ),
          "paid"
        ]
      ],
      where: {
        referral_id: {
          [Op.in]: referralIds
        }
      },
      raw: true
    });

    return res.json({
      referrals: referrals.length,
      totals
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getPartnerCommissions = async (req, res) => {
  try {
    const partnerProfile = await PartnerProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (!partnerProfile) {
      return res.status(404).json({ message: "Partner profile not found" });
    }

    const commissions = await Commission.findAll({
      include: [
        {
          model: Referral,
          where: { partner_id: partnerProfile.id },
          attributes: ["id"],
          include: [
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
    console.error("COMMISSIONS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getPartnerReferrals = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const partnerProfile = await PartnerProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (!partnerProfile) {
      return res.status(404).json({ message: "Partner profile not found" });
    }

    const referrals = await Referral.findAll({
      where: { partner_id: partnerProfile.id },
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return res.json(referrals);

  } catch (error) {
    console.error("REFERRALS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
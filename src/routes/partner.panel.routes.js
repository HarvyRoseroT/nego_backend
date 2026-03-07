const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

const {
  getPartnerDashboard,
  getPartnerCommissions,
  getPartnerReferrals
} = require("../controllers/partner.panel.controller");

router.get(
  "/dashboard",
  authMiddleware,
  requireRole("partner"),
  getPartnerDashboard
);

router.get(
  "/commissions",
  authMiddleware,
  requireRole("partner"),
  getPartnerCommissions
);

router.get(
  "/referrals",
  authMiddleware,
  requireRole("partner"),
  getPartnerReferrals
);

module.exports = router;
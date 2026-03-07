const express = require("express");
const router = express.Router();

const {
  validateReferralCode,
  createPartner,
  listPartners,
  updatePartnerStatus,
  deletePartner,
  listCommissions,
  payCommissions,
  listAllPayments
} = require("../controllers/partner.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.get("/validate/:code", validateReferralCode);

router.get(
  "/",
  authMiddleware,
  requireRole("superadmin"),
  listPartners
);

router.post(
  "/create",
  authMiddleware,
  requireRole("superadmin"),
  createPartner
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("superadmin"),
  updatePartnerStatus
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("superadmin"),
  deletePartner
);

router.get(
  "/commissions",
  authMiddleware,
  requireRole("superadmin"),
  listCommissions
);

router.post(
  "/commissions/pay",
  authMiddleware,
  requireRole("superadmin"),
  payCommissions
);

router.get(
  "/payments",
  authMiddleware,
  requireRole("superadmin"),
  listAllPayments
);

module.exports = router;
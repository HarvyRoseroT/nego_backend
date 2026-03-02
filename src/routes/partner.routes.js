const express = require("express");
const router = express.Router();

const {
  validateReferralCode,
  createPartner,
  listPartners,
  updatePartnerStatus,
  deletePartner
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

module.exports = router;
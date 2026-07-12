const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing/billing.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.get(
  "/mode",
  authMiddleware,
  billingController.getMode
);

router.patch(
  "/mode",
  authMiddleware,
  requireRole("superadmin"),
  billingController.updateMode
);

router.get(
  "/subscription",
  authMiddleware,
  billingController.getMySubscription
);

router.get(
  "/acceptance-token",
  authMiddleware,
  billingController.getAcceptanceToken
);

router.post(
  "/checkout-data",
  authMiddleware,
  billingController.createCheckoutData
);

router.get(
  "/invoices",
  authMiddleware,
  billingController.getMyInvoices
);

module.exports = router;

const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing/billing.controller");
const authMiddleware = require("../middlewares/auth.middleware");

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

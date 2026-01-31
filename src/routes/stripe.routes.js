const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const stripeController = require("../controllers/stripe.controller");
const createBillingPortalSession = require("../controllers/billingPortal.controller");

router.post(
  "/create-subscription",
  auth,
  stripeController.createSubscription
);

router.post(
  "/billing-portal",
  auth,
  createBillingPortalSession.createBillingPortalSession
);


module.exports = router;

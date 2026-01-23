const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const stripeController = require("../controllers/stripe.controller");

router.post(
  "/create-subscription",
  auth,
  stripeController.createSubscription
);

module.exports = router;

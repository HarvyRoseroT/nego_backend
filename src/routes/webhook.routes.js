const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/billing/webhook.controller");

router.post("/", webhookController.handleWompiWebhook);

module.exports = router;

const express = require("express");
const router = express.Router();

const { trackEvent } = require("../controllers/analytics.controller");

router.post("/event", trackEvent);

module.exports = router;

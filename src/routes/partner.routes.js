const express = require("express");
const router = express.Router();

const {
  validateReferralCode,
  createPartner,
} = require("../controllers/partner.controller");

router.get("/validate/:code", validateReferralCode);

router.post("/create", createPartner);

module.exports = router;
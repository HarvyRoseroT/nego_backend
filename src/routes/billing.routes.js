const express = require("express");
const router = express.Router();
const { getInvoices } = require("../controllers/billingController");
const auth = require("../middlewares/auth.middleware");

router.get("/invoices", auth, getInvoices);

module.exports = router;

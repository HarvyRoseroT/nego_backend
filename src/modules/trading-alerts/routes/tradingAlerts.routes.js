const express = require("express");
const router = express.Router();

const { runCheck } = require("../controllers/check.controller");
const { getHistory } = require("../controllers/history.controller");
const { getConfig, upsertConfig } = require("../controllers/config.controller");

router.post("/check", runCheck);
router.get("/history", getHistory);
router.get("/config", getConfig);
router.post("/config", upsertConfig);

module.exports = router;

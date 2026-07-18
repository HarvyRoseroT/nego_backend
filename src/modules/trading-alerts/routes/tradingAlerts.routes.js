const express = require("express");
const router = express.Router();

const { runCheck } = require("../controllers/check.controller");
const { getHistory, getHistoryDetail } = require("../controllers/history.controller");
const { getConfig, upsertConfig } = require("../controllers/config.controller");
const { getCandles } = require("../controllers/candles.controller");

router.post("/check", runCheck);
router.get("/history", getHistory);
router.get("/history/:id", getHistoryDetail);
router.get("/candles", getCandles);
router.get("/config", getConfig);
router.post("/config", upsertConfig);

module.exports = router;

const TradingAlertHistory = require("../models/TradingAlertHistory");

function buildDedupKey(pair, timeframe, candleTimestamp, direction) {
  return `${pair}_${timeframe}_${candleTimestamp}_${direction}`;
}

async function existsByDedupKey(dedupKey) {
  const existing = await TradingAlertHistory.findOne({ where: { dedup_key: dedupKey } });
  return !!existing;
}

module.exports = { buildDedupKey, existsByDedupKey };

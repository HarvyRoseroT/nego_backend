const TradingConfig = require("../models/TradingConfig");
const { runAnalysisForPair } = require("../services/analysis.service");

async function runCheck(req, res) {
  const secret = process.env.TRADING_CRON_SECRET;
  if (secret) {
    const provided = req.headers["x-trading-cron-secret"];
    if (provided !== secret) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  const configs = await TradingConfig.findAll({ where: { enabled: true } });

  const results = [];
  for (const config of configs) {
    try {
      const result = await runAnalysisForPair(config.pair, config.timeframe, config.swing_lookback);
      results.push(result);
    } catch (error) {
      results.push({
        pair: config.pair,
        timeframe: config.timeframe,
        saved: false,
        reason: "error",
        error: error.message
      });
    }
  }

  return res.status(200).json({
    checked: results.length,
    alertsSaved: results.filter((r) => r.saved).length,
    results
  });
}

module.exports = { runCheck };

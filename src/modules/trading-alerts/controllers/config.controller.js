const TradingConfig = require("../models/TradingConfig");
const { VALID_INTERVALS } = require("../constants");

async function getConfig(req, res) {
  const configs = await TradingConfig.findAll({ order: [["pair", "ASC"], ["timeframe", "ASC"]] });
  return res.status(200).json({ results: configs });
}

async function upsertConfig(req, res) {
  const { pair, timeframe, enabled, swing_lookback } = req.body;

  if (!pair || !timeframe) {
    return res.status(400).json({ message: "pair y timeframe son requeridos" });
  }

  if (!VALID_INTERVALS.includes(timeframe)) {
    return res.status(400).json({ message: `timeframe inválido. Valores permitidos: ${VALID_INTERVALS.join(", ")}` });
  }

  const normalizedPair = String(pair).toUpperCase().trim();
  if (!/^[A-Z0-9]{5,20}$/.test(normalizedPair)) {
    return res.status(400).json({ message: "pair inválido" });
  }

  const [config] = await TradingConfig.findOrCreate({
    where: { pair: normalizedPair, timeframe },
    defaults: {
      enabled: enabled !== undefined ? !!enabled : true,
      swing_lookback: swing_lookback !== undefined ? Number(swing_lookback) : 5
    }
  });

  if (enabled !== undefined) config.enabled = !!enabled;
  if (swing_lookback !== undefined) config.swing_lookback = Number(swing_lookback);
  await config.save();

  return res.status(200).json({ result: config });
}

module.exports = { getConfig, upsertConfig };

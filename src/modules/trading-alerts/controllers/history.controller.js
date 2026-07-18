const { Op } = require("sequelize");
const TradingAlertHistory = require("../models/TradingAlertHistory");

async function getHistory(req, res) {
  const { pair, timeframe, direction, minScore } = req.query;
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Number(req.query.offset) || 0;

  const where = {};
  if (pair) where.pair = String(pair).toUpperCase();
  if (timeframe) where.timeframe = timeframe;
  if (direction) where.direction = direction;
  if (minScore) where.score = { [Op.gte]: Number(minScore) };

  const { rows, count } = await TradingAlertHistory.findAndCountAll({
    where,
    order: [["candle_timestamp", "DESC"]],
    limit,
    offset
  });

  return res.status(200).json({ total: count, limit, offset, results: rows });
}

module.exports = { getHistory };

const { fetchRecentCandles } = require("../services/marketData.service");
const { VALID_INTERVALS } = require("../constants");

const MAX_LIMIT = 500;

async function getCandles(req, res) {
  const pair = String(req.query.pair || "BTCUSDT").toUpperCase().trim();
  const timeframe = req.query.timeframe || "15m";
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), MAX_LIMIT);

  if (!/^[A-Z0-9]{5,20}$/.test(pair)) {
    return res.status(400).json({ message: "pair inválido" });
  }

  if (!VALID_INTERVALS.includes(timeframe)) {
    return res.status(400).json({
      message: `timeframe inválido. Valores permitidos: ${VALID_INTERVALS.join(", ")}`
    });
  }

  try {
    const candles = await fetchRecentCandles(pair, timeframe, limit);
    return res.status(200).json({ pair, timeframe, candles });
  } catch (error) {
    const upstreamStatus = error.response?.status;
    console.error(
      "trading-alerts candles fetch error:",
      upstreamStatus,
      error.response?.data || error.message
    );
    return res.status(502).json({
      message: "No se pudieron obtener las velas del proveedor de datos de mercado",
      upstreamStatus: upstreamStatus || null
    });
  }
}

module.exports = { getCandles };

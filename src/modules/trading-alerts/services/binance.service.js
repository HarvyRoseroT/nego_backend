const axios = require("axios");
const { BINANCE_BASE_URL } = require("../constants");

function mapKline(k) {
  return {
    openTime: k[0],
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
    closeTime: k[6]
  };
}

async function getKlines(pair, timeframe, limit) {
  const response = await axios.get(`${BINANCE_BASE_URL}/fapi/v1/klines`, {
    params: {
      symbol: pair,
      interval: timeframe,
      limit
    },
    timeout: 10000
  });

  return response.data.map(mapKline);
}

/**
 * Fetches closed candles only. Binance's last returned kline is usually still
 * forming, so we always request one extra and drop it — every candle returned
 * here has already closed.
 */
async function fetchKlines(pair, timeframe, limit) {
  const raw = await getKlines(pair, timeframe, limit + 1);
  return raw.slice(0, -1);
}

/**
 * Fetches the most recent candles for charting, including the currently
 * forming one (flagged via isClosed) so the UI can render a live-updating
 * candle the same way Binance/TradingView do.
 */
async function fetchRecentCandles(pair, timeframe, limit) {
  const raw = await getKlines(pair, timeframe, limit);
  const now = Date.now();
  return raw.map((c) => ({ ...c, isClosed: c.closeTime <= now }));
}

module.exports = { fetchKlines, fetchRecentCandles };

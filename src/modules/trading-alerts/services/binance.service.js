const axios = require("axios");
const { BINANCE_BASE_URL } = require("../constants");

/**
 * Fetches closed candles only. Binance's last returned kline is usually still
 * forming, so we always request one extra and drop it — every candle returned
 * here has already closed.
 */
async function fetchKlines(pair, timeframe, limit) {
  const response = await axios.get(`${BINANCE_BASE_URL}/fapi/v1/klines`, {
    params: {
      symbol: pair,
      interval: timeframe,
      limit: limit + 1
    },
    timeout: 10000
  });

  const raw = response.data.slice(0, -1);

  return raw.map((k) => ({
    openTime: k[0],
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
    closeTime: k[6]
  }));
}

module.exports = { fetchKlines };

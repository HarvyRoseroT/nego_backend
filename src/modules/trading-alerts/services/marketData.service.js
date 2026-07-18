const axios = require("axios");
const { MARKET_DATA_BASE_URL } = require("../constants");

// Kraken usa el intervalo en minutos como entero.
const INTERVAL_MINUTES = {
  "1m": 1, "5m": 5, "15m": 15, "30m": 30,
  "1h": 60, "4h": 240, "1d": 1440, "1w": 10080
};

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Kraken usa su propia nomenclatura de pares (ISO 4217-ish, BTC = XBT) en vez del
// formato "BTCUSDT" estilo Binance que usa el resto del módulo.
function toKrakenPair(pair) {
  const base = pair.replace(/USDT?$/, "");
  const krakenBase = base === "BTC" ? "XBT" : base;
  return `${krakenBase}USD`;
}

async function getKlines(pair, timeframe, limit) {
  const intervalMinutes = INTERVAL_MINUTES[timeframe];
  if (!intervalMinutes) {
    throw new Error(`timeframe no soportado: ${timeframe}`);
  }
  const intervalMs = intervalMinutes * 60_000;

  const response = await axios.get(`${MARKET_DATA_BASE_URL}/0/public/OHLC`, {
    params: {
      pair: toKrakenPair(pair),
      interval: intervalMinutes
    },
    timeout: 10000,
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/json"
    }
  });

  if (response.data?.error?.length) {
    throw new Error(`Kraken error: ${response.data.error.join(", ")}`);
  }

  const resultKey = Object.keys(response.data?.result || {}).find((k) => k !== "last");
  const rows = resultKey ? response.data.result[resultKey] : [];

  const candles = rows.map(([time, open, high, low, close, , volume]) => {
    const openTimeMs = Number(time) * 1000;
    return {
      openTime: openTimeMs,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume),
      closeTime: openTimeMs + intervalMs - 1
    };
  });

  return limit ? candles.slice(-limit) : candles;
}

/**
 * Fetches closed candles only. La última vela de la respuesta puede seguir
 * formándose, así que pedimos una extra y la descartamos — todas las velas
 * devueltas aquí ya cerraron.
 */
async function fetchKlines(pair, timeframe, limit) {
  const raw = await getKlines(pair, timeframe, limit + 1);
  return raw.slice(0, -1);
}

/**
 * Fetches the most recent candles for charting, including the currently
 * forming one (flagged via isClosed) so the UI can render una vela en vivo.
 */
async function fetchRecentCandles(pair, timeframe, limit) {
  const raw = await getKlines(pair, timeframe, limit);
  const now = Date.now();
  return raw.map((c) => ({ ...c, isClosed: c.closeTime <= now }));
}

module.exports = { fetchKlines, fetchRecentCandles };

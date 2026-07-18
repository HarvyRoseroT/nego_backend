const axios = require("axios");
const { MARKET_DATA_BASE_URL } = require("../constants");

// Bybit usa códigos de intervalo propios (minutos como número, o D/W/M).
const INTERVAL_CODE = {
  "1m": "1", "3m": "3", "5m": "5", "15m": "15", "30m": "30",
  "1h": "60", "2h": "120", "4h": "240", "6h": "360", "12h": "720",
  "1d": "D", "1w": "W", "1M": "M"
};

const INTERVAL_MS = {
  "1m": 60_000, "3m": 180_000, "5m": 300_000, "15m": 900_000, "30m": 1_800_000,
  "1h": 3_600_000, "2h": 7_200_000, "4h": 14_400_000, "6h": 21_600_000, "12h": 43_200_000,
  "1d": 86_400_000, "1w": 604_800_000
};

function mapKline([openTime, open, high, low, close, volume], intervalMs) {
  const openTimeMs = Number(openTime);
  return {
    openTime: openTimeMs,
    open: Number(open),
    high: Number(high),
    low: Number(low),
    close: Number(close),
    volume: Number(volume),
    closeTime: openTimeMs + intervalMs - 1
  };
}

async function getKlines(pair, timeframe, limit) {
  const interval = INTERVAL_CODE[timeframe];
  const intervalMs = INTERVAL_MS[timeframe];
  if (!interval || !intervalMs) {
    throw new Error(`timeframe no soportado: ${timeframe}`);
  }

  const response = await axios.get(`${MARKET_DATA_BASE_URL}/v5/market/kline`, {
    params: {
      category: "linear", // perpetuos USDT, equivalente a Binance Futures
      symbol: pair,
      interval,
      limit
    },
    timeout: 10000
  });

  if (response.data?.retCode !== 0) {
    throw new Error(`Bybit error: ${response.data?.retMsg || "respuesta inválida"}`);
  }

  const list = response.data?.result?.list || [];
  // Bybit devuelve las velas en orden descendente (más reciente primero).
  return list.map((raw) => mapKline(raw, intervalMs)).sort((a, b) => a.openTime - b.openTime);
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

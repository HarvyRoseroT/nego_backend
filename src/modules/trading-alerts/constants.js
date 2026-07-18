const DEFAULT_PAIRS = (process.env.TRADING_DEFAULT_PAIRS || "BTCUSDT")
  .split(",")
  .map((p) => p.trim().toUpperCase())
  .filter(Boolean);

const DEFAULT_TIMEFRAMES = (process.env.TRADING_DEFAULT_TIMEFRAMES || "4h,1h,15m")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

const VALID_BINANCE_INTERVALS = [
  "1m", "3m", "5m", "15m", "30m",
  "1h", "2h", "4h", "6h", "8h", "12h",
  "1d", "3d", "1w", "1M"
];

const DEFAULT_SWING_LOOKBACK = Number(process.env.TRADING_SWING_LOOKBACK || 5);

const KLINES_LIMIT = Number(process.env.TRADING_KLINES_LIMIT || 200);

const BINANCE_BASE_URL = process.env.TRADING_BINANCE_BASE_URL || "https://fapi.binance.com";

const FIBONACCI_LEVELS = [0.236, 0.382, 0.5, 0.618, 0.786];

const GOLDEN_POCKET = [0.5, 0.618];

const NEAR_ZONE_MARGIN_PCT = 0.003; // ~0.3%

const MACD_SETTINGS = { fast: 12, slow: 26, signal: 9 };

const DIRECTIONS = { BULLISH: "bullish", BEARISH: "bearish" };

module.exports = {
  DEFAULT_PAIRS,
  DEFAULT_TIMEFRAMES,
  VALID_BINANCE_INTERVALS,
  DEFAULT_SWING_LOOKBACK,
  KLINES_LIMIT,
  BINANCE_BASE_URL,
  FIBONACCI_LEVELS,
  GOLDEN_POCKET,
  NEAR_ZONE_MARGIN_PCT,
  MACD_SETTINGS,
  DIRECTIONS
};

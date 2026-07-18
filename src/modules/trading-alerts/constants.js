const DEFAULT_PAIRS = (process.env.TRADING_DEFAULT_PAIRS || "BTCUSDT")
  .split(",")
  .map((p) => p.trim().toUpperCase())
  .filter(Boolean);

const DEFAULT_TIMEFRAMES = (process.env.TRADING_DEFAULT_TIMEFRAMES || "4h,1h,15m")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

// Limitado a los intervalos que el proveedor de datos (Bybit) soporta nativamente.
const VALID_INTERVALS = [
  "1m", "3m", "5m", "15m", "30m",
  "1h", "2h", "4h", "6h", "12h",
  "1d", "1w", "1M"
];

const DEFAULT_SWING_LOOKBACK = Number(process.env.TRADING_SWING_LOOKBACK || 5);

const KLINES_LIMIT = Number(process.env.TRADING_KLINES_LIMIT || 200);

// Binance bloquea (HTTP 451) las IPs de datacenter de la mayoría de los hosts en la nube,
// incluido Railway. Bybit sirve datos de mercado públicos sin ese bloqueo.
const MARKET_DATA_BASE_URL = process.env.TRADING_MARKET_DATA_BASE_URL || "https://api.bybit.com";

const FIBONACCI_LEVELS = [0.236, 0.382, 0.5, 0.618, 0.786];

const GOLDEN_POCKET = [0.5, 0.618];

const NEAR_ZONE_MARGIN_PCT = 0.003; // ~0.3%

const MACD_SETTINGS = { fast: 12, slow: 26, signal: 9 };

const DIRECTIONS = { BULLISH: "bullish", BEARISH: "bearish" };

module.exports = {
  DEFAULT_PAIRS,
  DEFAULT_TIMEFRAMES,
  VALID_INTERVALS,
  DEFAULT_SWING_LOOKBACK,
  KLINES_LIMIT,
  MARKET_DATA_BASE_URL,
  FIBONACCI_LEVELS,
  GOLDEN_POCKET,
  NEAR_ZONE_MARGIN_PCT,
  MACD_SETTINGS,
  DIRECTIONS
};

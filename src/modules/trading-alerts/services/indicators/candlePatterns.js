function body(c) {
  return Math.abs(c.close - c.open);
}
function upperWick(c) {
  return c.high - Math.max(c.open, c.close);
}
function lowerWick(c) {
  return Math.min(c.open, c.close) - c.low;
}
function isBullish(c) {
  return c.close > c.open;
}
function isBearish(c) {
  return c.close < c.open;
}

/**
 * A "real" body is required so a doji never gets misread as a hammer/star —
 * without this floor, body ~= 0 makes lowerWick >= 2*body trivially true.
 */
function hasRealBody(c) {
  const range = c.high - c.low;
  return range > 0 && body(c) >= range * 0.05;
}

function isHammer(c) {
  if (!hasRealBody(c)) return false;
  const b = body(c);
  return lowerWick(c) >= 2 * b && upperWick(c) <= b * 0.3;
}

function isShootingStar(c) {
  if (!hasRealBody(c)) return false;
  const b = body(c);
  return upperWick(c) >= 2 * b && lowerWick(c) <= b * 0.3;
}

function isBullishEngulfing(prev, curr) {
  if (!isBearish(prev) || !isBullish(curr)) return false;
  return curr.open <= prev.close && curr.close >= prev.open;
}

function isBearishEngulfing(prev, curr) {
  if (!isBullish(prev) || !isBearish(curr)) return false;
  return curr.open >= prev.close && curr.close <= prev.open;
}

function isDoji(c) {
  if (c.open === 0) return false;
  return Math.abs(c.close - c.open) / c.open <= 0.001;
}

/**
 * A strong confirmation candle: real body taking up most of its range, in a
 * clear direction.
 */
function isStrongCandle(c) {
  const range = c.high - c.low;
  if (range === 0) return false;
  return body(c) >= range * 0.6;
}

function analyzeCandlePatterns(candles) {
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const patterns = {
    hammer: last ? isHammer(last) : false,
    shootingStar: last ? isShootingStar(last) : false,
    bullishEngulfing: prev && last ? isBullishEngulfing(prev, last) : false,
    bearishEngulfing: prev && last ? isBearishEngulfing(prev, last) : false,
    dojiBullishConfirmation:
      prev && last ? isDoji(prev) && isStrongCandle(last) && isBullish(last) : false,
    dojiBearishConfirmation:
      prev && last ? isDoji(prev) && isStrongCandle(last) && isBearish(last) : false
  };

  const bullish = patterns.hammer || patterns.bullishEngulfing || patterns.dojiBullishConfirmation;
  const bearish =
    patterns.shootingStar || patterns.bearishEngulfing || patterns.dojiBearishConfirmation;

  return { patterns, bullish, bearish };
}

module.exports = { analyzeCandlePatterns };

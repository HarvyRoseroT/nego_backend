const { FIBONACCI_LEVELS, GOLDEN_POCKET } = require("../../constants");

/**
 * Impulse = the most recent confirmed swing high paired with the most recent
 * confirmed swing low. Whichever pivot is more recent decides the direction:
 * low -> high (up) means price is expected to retrace down into the pocket;
 * high -> low (down) means price is expected to retrace up into it.
 */
function getRecentImpulse(swingHighs, swingLows) {
  if (swingHighs.length === 0 || swingLows.length === 0) return null;

  const lastHigh = swingHighs[swingHighs.length - 1];
  const lastLow = swingLows[swingLows.length - 1];

  const direction = lastHigh.index > lastLow.index ? "up" : "down";

  return {
    direction,
    high: lastHigh.price,
    low: lastLow.price,
    highTime: lastHigh.time,
    lowTime: lastLow.time
  };
}

function computeLevels(impulse) {
  const range = impulse.high - impulse.low;
  const levels = {};
  for (const pct of FIBONACCI_LEVELS) {
    levels[pct] =
      impulse.direction === "up"
        ? impulse.high - range * pct
        : impulse.low + range * pct;
  }
  return levels;
}

function analyzeFibonacci(swingHighs, swingLows, currentPrice) {
  const impulse = getRecentImpulse(swingHighs, swingLows);
  if (!impulse) {
    return { impulse: null, levels: null, goldenPocket: null, inGoldenPocket: false };
  }

  const levels = computeLevels(impulse);
  const gpA = levels[GOLDEN_POCKET[0]];
  const gpB = levels[GOLDEN_POCKET[1]];
  const goldenPocket = { min: Math.min(gpA, gpB), max: Math.max(gpA, gpB) };

  const inGoldenPocket = currentPrice >= goldenPocket.min && currentPrice <= goldenPocket.max;

  return { impulse, levels, goldenPocket, inGoldenPocket };
}

module.exports = { analyzeFibonacci, getRecentImpulse, computeLevels };

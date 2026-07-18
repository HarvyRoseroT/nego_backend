const { MACD_SETTINGS } = require("../../constants");

/**
 * Standard EMA: seeded with the SMA of the first `period` values, then
 * recursively smoothed. Returns one value per input starting at index
 * `period - 1` (earlier indexes are `null`, not enough data yet).
 */
function ema(values, period) {
  const result = new Array(values.length).fill(null);
  if (values.length < period) return result;

  const k = 2 / (period + 1);
  const seed = values.slice(0, period).reduce((sum, v) => sum + v, 0) / period;
  result[period - 1] = seed;

  for (let i = period; i < values.length; i++) {
    result[i] = values[i] * k + result[i - 1] * (1 - k);
  }
  return result;
}

function computeMACD(closes) {
  const { fast, slow, signal } = MACD_SETTINGS;
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);

  const dif = closes.map((_, i) =>
    emaFast[i] !== null && emaSlow[i] !== null ? emaFast[i] - emaSlow[i] : null
  );

  const difValues = dif.filter((v) => v !== null);
  const deaFromFirstValid = ema(difValues, signal);

  const dea = new Array(closes.length).fill(null);
  const firstDifIndex = dif.findIndex((v) => v !== null);
  if (firstDifIndex !== -1) {
    deaFromFirstValid.forEach((v, idx) => {
      dea[firstDifIndex + idx] = v;
    });
  }

  const histogram = dif.map((v, i) => (v !== null && dea[i] !== null ? v - dea[i] : null));

  return { dif, dea, histogram };
}

function analyzeMACD(closes) {
  const { dif, dea, histogram } = computeMACD(closes);
  const last = closes.length - 1;
  const prev = last - 1;

  let cross = null;
  if (
    prev >= 0 &&
    dif[prev] !== null &&
    dea[prev] !== null &&
    dif[last] !== null &&
    dea[last] !== null
  ) {
    const wasBelow = dif[prev] <= dea[prev];
    const isAbove = dif[last] > dea[last];
    const wasAbove = dif[prev] >= dea[prev];
    const isBelow = dif[last] < dea[last];

    if (wasBelow && isAbove) cross = "bullish";
    else if (wasAbove && isBelow) cross = "bearish";
  }

  return {
    dif: dif[last],
    dea: dea[last],
    histogram: histogram[last],
    cross
  };
}

module.exports = { analyzeMACD, computeMACD };

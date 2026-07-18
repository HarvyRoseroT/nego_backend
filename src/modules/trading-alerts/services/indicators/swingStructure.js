/**
 * A candle at index i is a confirmed swing high/low only once `lookback`
 * candles exist on both sides of it, so the most recent `lookback` candles
 * can never produce a confirmed pivot — that's expected, not a bug.
 */
function detectSwingHighs(candles, lookback) {
  const swings = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    const window = candles.slice(i - lookback, i + lookback + 1);
    const maxHigh = Math.max(...window.map((c) => c.high));
    if (candles[i].high === maxHigh) {
      swings.push({ index: i, time: candles[i].openTime, price: candles[i].high });
    }
  }
  return swings;
}

function detectSwingLows(candles, lookback) {
  const swings = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    const window = candles.slice(i - lookback, i + lookback + 1);
    const minLow = Math.min(...window.map((c) => c.low));
    if (candles[i].low === minLow) {
      swings.push({ index: i, time: candles[i].openTime, price: candles[i].low });
    }
  }
  return swings;
}

function classifySequence(points) {
  if (points.length < 2) return "insufficient";
  const last = points.slice(-3);
  const increasing = last.every((p, idx) => idx === 0 || p.price > last[idx - 1].price);
  const decreasing = last.every((p, idx) => idx === 0 || p.price < last[idx - 1].price);
  if (increasing) return "higher";
  if (decreasing) return "lower";
  return "mixed";
}

/**
 * MSS = the first higher high after a run of lower highs (bullish), or the
 * first lower low after a run of higher lows (bearish). Only the most recent
 * event of each kind is reported.
 */
function detectMSS(swingHighs, swingLows) {
  let bullish = null;
  for (let i = 2; i < swingHighs.length; i++) {
    const wasLowerHigh = swingHighs[i - 1].price < swingHighs[i - 2].price;
    const isHigherHigh = swingHighs[i].price > swingHighs[i - 1].price;
    if (wasLowerHigh && isHigherHigh) {
      bullish = { ...swingHighs[i] };
    }
  }

  let bearish = null;
  for (let i = 2; i < swingLows.length; i++) {
    const wasHigherLow = swingLows[i - 1].price > swingLows[i - 2].price;
    const isLowerLow = swingLows[i].price < swingLows[i - 1].price;
    if (wasHigherLow && isLowerLow) {
      bearish = { ...swingLows[i] };
    }
  }

  return { bullish, bearish };
}

function analyzeSwingStructure(candles, lookback) {
  const swingHighs = detectSwingHighs(candles, lookback);
  const swingLows = detectSwingLows(candles, lookback);
  const highsTrend = classifySequence(swingHighs);
  const lowsTrend = classifySequence(swingLows);
  const mss = detectMSS(swingHighs, swingLows);

  let structure = "neutral";
  if (highsTrend === "higher" && lowsTrend === "higher") structure = "bullish";
  else if (highsTrend === "lower" && lowsTrend === "lower") structure = "bearish";

  const lastCandleIndex = candles.length - 1;
  const recentWindow = lookback * 2;

  const bullishMssRecent =
    mss.bullish && lastCandleIndex - mss.bullish.index <= recentWindow;
  const bearishMssRecent =
    mss.bearish && lastCandleIndex - mss.bearish.index <= recentWindow;

  return {
    swingHighs,
    swingLows,
    structure,
    mss: {
      bullish: bullishMssRecent ? mss.bullish : null,
      bearish: bearishMssRecent ? mss.bearish : null
    }
  };
}

module.exports = { analyzeSwingStructure, detectSwingHighs, detectSwingLows };

/**
 * Evaluated one candle back from the latest close: `sweepCandle` is the
 * candle whose wick pierced a prior swing point and closed back inside it;
 * `confirmCandle` (the most recent close) is checked for a strong reversal
 * in the swept direction.
 */
function analyzeLiquiditySweep(candles, swingHighs, swingLows) {
  if (candles.length < 2) {
    return { bullish: { detected: false }, bearish: { detected: false } };
  }

  const sweepIndex = candles.length - 2;
  const sweepCandle = candles[sweepIndex];
  const confirmCandle = candles[candles.length - 1];

  const priorSwingHighs = swingHighs.filter((s) => s.index < sweepIndex);
  const priorSwingLows = swingLows.filter((s) => s.index < sweepIndex);

  const nearestSwingHigh = priorSwingHighs[priorSwingHighs.length - 1] || null;
  const nearestSwingLow = priorSwingLows[priorSwingLows.length - 1] || null;

  let bearish = { detected: false };
  if (nearestSwingHigh) {
    const detected =
      sweepCandle.high > nearestSwingHigh.price && sweepCandle.close < nearestSwingHigh.price;
    const confirmed = detected && confirmCandle.close < confirmCandle.open;
    bearish = { detected, confirmed, level: nearestSwingHigh.price };
  }

  let bullish = { detected: false };
  if (nearestSwingLow) {
    const detected =
      sweepCandle.low < nearestSwingLow.price && sweepCandle.close > nearestSwingLow.price;
    const confirmed = detected && confirmCandle.close > confirmCandle.open;
    bullish = { detected, confirmed, level: nearestSwingLow.price };
  }

  return { bullish, bearish };
}

module.exports = { analyzeLiquiditySweep };

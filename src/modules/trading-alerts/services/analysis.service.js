const { fetchKlines } = require("./binance.service");
const { analyzeSwingStructure } = require("./indicators/swingStructure");
const { analyzeFibonacci } = require("./indicators/fibonacci");
const { analyzeMACD } = require("./indicators/macd");
const { analyzeCandlePatterns } = require("./indicators/candlePatterns");
const { analyzeLiquiditySweep } = require("./indicators/liquiditySweep");
const { buildDedupKey, existsByDedupKey } = require("./dedup.service");
const TradingAlertHistory = require("../models/TradingAlertHistory");
const { KLINES_LIMIT, NEAR_ZONE_MARGIN_PCT, DIRECTIONS } = require("../constants");

function nearestSwingPoint(points, price) {
  if (points.length === 0) return null;
  return points.reduce((closest, p) =>
    Math.abs(p.price - price) < Math.abs(closest.price - price) ? p : closest
  );
}

function isWithinZones(price, zones, marginPct) {
  return zones.some(([lo, hi]) => {
    const loM = lo * (1 - marginPct);
    const hiM = hi * (1 + marginPct);
    return price >= loM && price <= hiM;
  });
}

async function runAnalysisForPair(pair, timeframe, swingLookback) {
  const minCandles = Math.max(swingLookback * 2 + 3, 40);
  const candles = await fetchKlines(pair, timeframe, KLINES_LIMIT);

  if (candles.length < minCandles) {
    return { pair, timeframe, saved: false, reason: "insufficient_data" };
  }

  const closes = candles.map((c) => c.close);
  const lastCandle = candles[candles.length - 1];
  const currentPrice = lastCandle.close;

  const swingResult = analyzeSwingStructure(candles, swingLookback);
  const fibResult = analyzeFibonacci(swingResult.swingHighs, swingResult.swingLows, currentPrice);
  const macdResult = analyzeMACD(closes);
  const liquidityResult = analyzeLiquiditySweep(candles, swingResult.swingHighs, swingResult.swingLows);
  const candleResultRaw = analyzeCandlePatterns(candles);

  const zones = [];
  if (fibResult.goldenPocket) {
    zones.push([fibResult.goldenPocket.min, fibResult.goldenPocket.max]);
  }
  const nearestHigh = nearestSwingPoint(swingResult.swingHighs, currentPrice);
  const nearestLow = nearestSwingPoint(swingResult.swingLows, currentPrice);
  if (nearestHigh) zones.push([nearestHigh.price, nearestHigh.price]);
  if (nearestLow) zones.push([nearestLow.price, nearestLow.price]);

  const nearZone = isWithinZones(currentPrice, zones, NEAR_ZONE_MARGIN_PCT);
  const candlePatterns = nearZone
    ? candleResultRaw
    : { ...candleResultRaw, bullish: false, bearish: false, skippedReason: "not_near_zone" };

  let bullishScore = 0;
  let bearishScore = 0;

  if (swingResult.mss.bullish) bullishScore++;
  if (swingResult.mss.bearish) bearishScore++;

  if (fibResult.inGoldenPocket) {
    if (fibResult.impulse.direction === "up") bullishScore++;
    else bearishScore++;
  }

  if (macdResult.cross === "bullish") bullishScore++;
  if (macdResult.cross === "bearish") bearishScore++;

  if (candlePatterns.bullish) bullishScore++;
  if (candlePatterns.bearish) bearishScore++;

  if (liquidityResult.bullish.detected) bullishScore++;
  if (liquidityResult.bearish.detected) bearishScore++;

  const signalsDetected = {
    structure: { trend: swingResult.structure, mss: swingResult.mss },
    fibonacci: fibResult,
    macd: macdResult,
    candlePatterns: { ...candlePatterns, nearZone },
    liquiditySweep: liquidityResult,
    bullishScore,
    bearishScore
  };

  let direction = null;
  let score = 0;
  if (bullishScore > bearishScore) {
    direction = DIRECTIONS.BULLISH;
    score = bullishScore;
  } else if (bearishScore > bullishScore) {
    direction = DIRECTIONS.BEARISH;
    score = bearishScore;
  }

  if (!direction) {
    return { pair, timeframe, saved: false, reason: "no_dominant_direction", bullishScore, bearishScore };
  }

  const candleTimestamp = lastCandle.openTime;
  const dedupKey = buildDedupKey(pair, timeframe, candleTimestamp, direction);

  if (await existsByDedupKey(dedupKey)) {
    return { pair, timeframe, saved: false, reason: "duplicate", dedupKey };
  }

  const record = await TradingAlertHistory.create({
    pair,
    timeframe,
    candle_timestamp: candleTimestamp,
    direction,
    score,
    signals_detected: signalsDetected,
    price: currentPrice,
    dedup_key: dedupKey
  });

  return { pair, timeframe, saved: true, direction, score, dedupKey, id: record.id };
}

module.exports = { runAnalysisForPair };

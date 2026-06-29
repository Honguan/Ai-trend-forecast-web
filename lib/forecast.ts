import { average, ema, macd, rsi, sma } from "./indicators";
import type { Candle, ForecastPoint, IndicatorResult } from "./types";

export function defaultHorizon(range: string): number {
  if (range === "1d") return 6;
  if (range === "5d") return 5;
  if (range === "1mo") return 7;
  if (range === "6mo") return 14;
  return 30;
}

export function calculateIndicators(candles: Candle[]): IndicatorResult {
  const closes = candles.map((candle) => candle.close);
  const macdValue = macd(closes);
  const sma20 = sma(closes, Math.min(20, closes.length));
  const ema20 = ema(closes, Math.min(20, closes.length));
  const latest = closes.at(-1) ?? 0;
  const volatilityPct = calculateVolatilityPct(closes);
  return {
    sma20,
    ema20,
    rsi14: rsi(closes, Math.min(14, Math.max(1, closes.length - 1))),
    macd: macdValue.macd,
    macdSignal: macdValue.signal,
    macdHistogram: macdValue.histogram,
    volatilityPct,
    trend: latest > sma20 && macdValue.histogram >= 0 ? "up" : latest < sma20 && macdValue.histogram <= 0 ? "down" : "flat"
  };
}

export function buildForecast(candles: Candle[], range: string): ForecastPoint[] {
  if (candles.length < 2) return [];
  const horizon = defaultHorizon(range);
  const closes = candles.map((candle) => candle.close);
  const recent = closes.slice(-Math.min(10, closes.length));
  const step = average(recent.slice(1).map((value, index) => value - recent[index]));
  const volatility = calculateVolatilityPct(closes) / 100;
  const last = candles.at(-1)!;
  const date = new Date(last.time);
  return Array.from({ length: horizon }, (_, index) => {
    date.setDate(date.getDate() + 1);
    const expected = Math.max(0, last.close + step * (index + 1));
    const band = expected * volatility * Math.sqrt(index + 1);
    return {
      time: date.toISOString().slice(0, 10),
      expected: round(expected),
      low: round(Math.max(0, expected - band)),
      high: round(expected + band)
    };
  });
}

function calculateVolatilityPct(values: number[]): number {
  const returns = values.slice(1).map((value, index) => (value - values[index]) / values[index]);
  const mean = average(returns);
  const variance = average(returns.map((value) => (value - mean) ** 2));
  return round(Math.sqrt(variance) * 100);
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

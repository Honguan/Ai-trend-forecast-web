export function sma(values: number[], period: number): number {
  const slice = values.slice(-period);
  return average(slice);
}

export function ema(values: number[], period: number): number {
  if (values.length === 0) return 0;
  if (values.length <= period) return average(values);
  const smoothing = 2 / (period + 1);
  const seed = average(values.slice(0, period));
  return values.slice(period).reduce((previous, value) => value * smoothing + previous * (1 - smoothing), seed);
}

export function rsi(values: number[], period = 14): number {
  const changes = values.slice(1).map((value, index) => value - values[index]);
  const slice = changes.slice(-period);
  const gains = slice.map((change) => Math.max(change, 0));
  const losses = slice.map((change) => Math.abs(Math.min(change, 0)));
  const averageLoss = average(losses);
  if (averageLoss === 0) return 100;
  const relativeStrength = average(gains) / averageLoss;
  return 100 - 100 / (1 + relativeStrength);
}

export function macd(values: number[]): { macd: number; signal: number; histogram: number } {
  const lineValues = values.map((_, index) => {
    const slice = values.slice(0, index + 1);
    return ema(slice, 12) - ema(slice, 26);
  });
  const line = lineValues.at(-1) ?? 0;
  const signal = ema(lineValues, 9);
  return { macd: line, signal, histogram: line - signal };
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

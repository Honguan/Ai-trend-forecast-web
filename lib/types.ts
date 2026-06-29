export type AssetType = "stock" | "crypto" | "metal";

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type ForecastPoint = {
  time: string;
  expected: number;
  low: number;
  high: number;
};

export type IndicatorResult = {
  sma20: number;
  ema20: number;
  rsi14: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  volatilityPct: number;
  trend: "up" | "down" | "flat";
};

export type AnalysisResult = {
  symbol: string;
  assetType: AssetType;
  range: string;
  interval: string;
  indicators: IndicatorResult;
  forecast: ForecastPoint[];
  explanation: string;
};

export type ReviewRecord = {
  id: number;
  symbol: string;
  assetType: AssetType;
  range: string;
  createdAt: string;
  expected: number;
  actual: number;
  errorPct: number;
};

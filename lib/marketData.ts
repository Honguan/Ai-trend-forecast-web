import type { AssetType, Candle } from "./types";

type TwelveDataCandle = {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
};

export function resolveTwelveDataSymbol(assetType: AssetType, symbol: string): string {
  const normalized = symbol.trim().toUpperCase();
  if (assetType === "stock") return normalized.replace(/[^A-Z.-]/g, "");
  return normalized.includes("/") ? normalized : normalized.replace("-", "/");
}

export function normalizeTwelveDataCandles(values: TwelveDataCandle[]): Candle[] {
  return values
    .map((value) => ({
      time: value.datetime,
      open: Number(value.open),
      high: Number(value.high),
      low: Number(value.low),
      close: Number(value.close),
      volume: value.volume ? Number(value.volume) : undefined
    }))
    .filter((candle) => Number.isFinite(candle.close))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export async function fetchMarketHistory(params: {
  assetType: AssetType;
  symbol: string;
  range: string;
  interval: string;
  apiKey?: string;
}): Promise<Candle[]> {
  if (!params.apiKey) throw new Error("缺少 MARKET_DATA_API_KEY。");
  const url = new URL("https://api.twelvedata.com/time_series");
  url.searchParams.set("symbol", resolveTwelveDataSymbol(params.assetType, params.symbol));
  url.searchParams.set("interval", params.interval);
  url.searchParams.set("outputsize", String(outputSizeForRange(params.range)));
  url.searchParams.set("apikey", params.apiKey);
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.status === "error") throw new Error(data.message ?? "市場資料取得失敗。");
  const candles = normalizeTwelveDataCandles(data.values ?? []);
  if (candles.length < 20) throw new Error("歷史資料不足，請改用較長時間範圍或確認代號。");
  return candles;
}

function outputSizeForRange(range: string): number {
  if (range === "1d") return 80;
  if (range === "5d") return 120;
  if (range === "1mo") return 160;
  if (range === "6mo") return 220;
  return 365;
}

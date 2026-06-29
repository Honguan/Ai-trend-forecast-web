import type { AnalysisResult, Candle, ForecastPoint, IndicatorResult, ReviewRecord } from "./types";
import { summarizePastReviews } from "./reviews";

export async function explainAnalysis(input: {
  symbol: string;
  candles: Candle[];
  indicators: IndicatorResult;
  forecast: ForecastPoint[];
  reviews: ReviewRecord[];
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}): Promise<string> {
  if (!input.apiKey) return fallbackExplanation(input.indicators, input.reviews);
  const response = await fetch(`${input.baseUrl ?? "https://api.openai.com/v1"}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${input.apiKey}`
    },
    body: JSON.stringify({
      model: input.model ?? "gpt-4.1-mini",
      messages: [
        { role: "system", content: "你是金融研究助理。只解釋技術分析與風險，不提供投資建議。" },
        { role: "user", content: buildPrompt(input) }
      ],
      temperature: 0.2
    })
  });
  if (!response.ok) throw new Error("AI 端點回應失敗。");
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || fallbackExplanation(input.indicators, input.reviews);
}

export function buildAnalysisResult(input: Omit<AnalysisResult, "explanation"> & { explanation: string }): AnalysisResult {
  return input;
}

function buildPrompt(input: {
  symbol: string;
  candles: Candle[];
  indicators: IndicatorResult;
  forecast: ForecastPoint[];
  reviews: ReviewRecord[];
}): string {
  const latest = input.candles.at(-1);
  return [
    `標的：${input.symbol}`,
    `最新收盤：${latest?.close}`,
    `趨勢：${input.indicators.trend}`,
    `RSI：${input.indicators.rsi14.toFixed(2)}，MACD柱：${input.indicators.macdHistogram.toFixed(4)}，波動率：${input.indicators.volatilityPct.toFixed(2)}%`,
    `預測終點：${input.forecast.at(-1)?.expected}`,
    summarizePastReviews(input.reviews),
    "請用繁體中文用三段說明：走勢原因、預測依據、主要風險。"
  ].join("\n");
}

function fallbackExplanation(indicators: IndicatorResult, reviews: ReviewRecord[]): string {
  return [
    `目前趨勢判定為 ${indicators.trend}，主要依據是均線、RSI、MACD 與近期波動率。`,
    `本次預測線由近期收盤變化與波動區間推估，AI 金鑰未設定時使用本機規則說明。`,
    summarizePastReviews(reviews)
  ].join("\n\n");
}

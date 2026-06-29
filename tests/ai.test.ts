import test from "node:test";
import assert from "node:assert/strict";
import { explainAnalysis } from "../lib/ai";
import type { IndicatorResult } from "../lib/types";

const indicators: IndicatorResult = {
  sma20: 100,
  ema20: 101,
  rsi14: 55,
  macd: 1,
  macdSignal: 0.8,
  macdHistogram: 0.2,
  volatilityPct: 2,
  trend: "up"
};

test("uses local explanation when ai key is missing", async () => {
  const text = await explainAnalysis({ symbol: "AAPL", candles: [], indicators, forecast: [], reviews: [] });
  assert.match(text, /本機規則說明/);
});

test("reports ai endpoint failure", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("fail", { status: 500 });
  try {
    await assert.rejects(
      explainAnalysis({ symbol: "AAPL", candles: [], indicators, forecast: [], reviews: [], apiKey: "test" }),
      /AI 端點回應失敗/
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

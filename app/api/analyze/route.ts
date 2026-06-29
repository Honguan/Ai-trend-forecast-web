import { NextRequest, NextResponse } from "next/server";
import { explainAnalysis } from "../../../lib/ai";
import { buildForecast, calculateIndicators } from "../../../lib/forecast";
import { listReviews, saveAnalysis } from "../../../lib/db";
import type { AssetType, Candle } from "../../../lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { assetType: AssetType; symbol: string; range: string; interval: string; candles: Candle[] };
    if (!Array.isArray(body.candles) || body.candles.length < 20) throw new Error("歷史資料不足，至少需要 20 筆。");
    const indicators = calculateIndicators(body.candles);
    const forecast = buildForecast(body.candles, body.range);
    const reviews = listReviews(body.symbol.toUpperCase(), body.assetType);
    const explanation = await explainAnalysis({
      symbol: body.symbol.toUpperCase(),
      candles: body.candles,
      indicators,
      forecast,
      reviews,
      baseUrl: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL
    });
    const result = {
      symbol: body.symbol.toUpperCase(),
      assetType: body.assetType,
      range: body.range,
      interval: body.interval,
      indicators,
      forecast,
      explanation
    };
    const analysisId = saveAnalysis(result);
    return NextResponse.json({ result, analysisId });
  } catch (caught) {
    return NextResponse.json({ error: caught instanceof Error ? caught.message : "分析失敗。" }, { status: 400 });
  }
}

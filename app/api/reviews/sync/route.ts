import { NextRequest, NextResponse } from "next/server";
import { fetchMarketHistory } from "../../../../lib/marketData";
import { calculateErrorPct } from "../../../../lib/reviews";
import { saveReview } from "../../../../lib/db";
import type { AssetType, ForecastPoint } from "../../../../lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      analysisId: number;
      assetType: AssetType;
      symbol: string;
      range: string;
      interval: string;
      forecast: ForecastPoint[];
    };
    const forecastEnd = body.forecast?.at(-1);
    if (!forecastEnd) throw new Error("缺少可復盤的預測資料。");
    const candles = await fetchMarketHistory({
      assetType: body.assetType,
      symbol: body.symbol,
      range: body.range,
      interval: body.interval,
      apiKey: process.env.MARKET_DATA_API_KEY
    });
    const actual = candles.at(-1)?.close;
    if (!actual) throw new Error("缺少實際走勢資料。");
    const review = {
      analysisId: body.analysisId,
      symbol: body.symbol.toUpperCase(),
      assetType: body.assetType,
      range: body.range,
      expected: forecastEnd.expected,
      actual,
      errorPct: calculateErrorPct(forecastEnd.expected, actual)
    };
    const id = saveReview(review);
    return NextResponse.json({ review: { id, ...review } });
  } catch (caught) {
    return NextResponse.json({ error: caught instanceof Error ? caught.message : "復盤同步失敗。" }, { status: 400 });
  }
}

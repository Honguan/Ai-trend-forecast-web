import { NextRequest, NextResponse } from "next/server";
import { fetchMarketHistory } from "../../../../lib/marketData";
import type { AssetType } from "../../../../lib/types";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams;
    const assetType = search.get("type") as AssetType;
    const symbol = search.get("symbol") ?? "";
    const range = search.get("range") ?? "1mo";
    const interval = search.get("interval") ?? "1day";
    if (!["stock", "crypto", "metal"].includes(assetType)) throw new Error("不支援的資產類型。");
    if (!symbol.trim()) throw new Error("請輸入代號。");
    const candles = await fetchMarketHistory({ assetType, symbol, range, interval, apiKey: process.env.MARKET_DATA_API_KEY });
    return NextResponse.json({ candles });
  } catch (caught) {
    return NextResponse.json({ error: caught instanceof Error ? caught.message : "市場資料取得失敗。" }, { status: 400 });
  }
}

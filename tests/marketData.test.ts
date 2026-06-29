import test from "node:test";
import assert from "node:assert/strict";
import { fetchMarketHistory, normalizeTwelveDataCandles, resolveTwelveDataSymbol } from "../lib/marketData";

test("resolves symbols for supported assets", () => {
  assert.equal(resolveTwelveDataSymbol("stock", "aapl"), "AAPL");
  assert.equal(resolveTwelveDataSymbol("crypto", "btc/usd"), "BTC/USD");
  assert.equal(resolveTwelveDataSymbol("metal", "xau/usd"), "XAU/USD");
});

test("normalizes twelve data candles from oldest to newest", () => {
  const candles = normalizeTwelveDataCandles([
    { datetime: "2025-01-02", open: "2", high: "3", low: "1", close: "2.5", volume: "20" },
    { datetime: "2025-01-01", open: "1", high: "2", low: "0.5", close: "1.5", volume: "10" }
  ]);
  assert.deepEqual(candles.map((candle) => candle.time), ["2025-01-01", "2025-01-02"]);
  assert.equal(candles[0].close, 1.5);
});

test("reports missing market api key", async () => {
  await assert.rejects(
    fetchMarketHistory({ assetType: "stock", symbol: "AAPL", range: "1mo", interval: "1day" }),
    /缺少 MARKET_DATA_API_KEY/
  );
});

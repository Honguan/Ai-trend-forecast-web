import test from "node:test";
import assert from "node:assert/strict";
import { buildForecast, defaultHorizon } from "../lib/forecast";
import type { Candle } from "../lib/types";

const candles: Candle[] = Array.from({ length: 40 }, (_, index) => ({
  time: new Date(Date.UTC(2025, 0, index + 1)).toISOString().slice(0, 10),
  open: 100 + index,
  high: 102 + index,
  low: 99 + index,
  close: 101 + index,
  volume: 1000 + index
}));

test("chooses forecast horizon from selected range", () => {
  assert.equal(defaultHorizon("1d"), 6);
  assert.equal(defaultHorizon("1mo"), 7);
  assert.equal(defaultHorizon("1y"), 30);
});

test("builds forecast points after the last candle", () => {
  const points = buildForecast(candles, "1mo");
  assert.equal(points.length, 7);
  assert.ok(points[0].time > candles.at(-1)!.time);
  assert.ok(points.every((point) => point.expected > candles.at(-1)!.close));
});

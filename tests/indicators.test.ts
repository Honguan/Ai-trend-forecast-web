import test from "node:test";
import assert from "node:assert/strict";
import { ema, macd, rsi, sma } from "../lib/indicators";

test("calculates sma from the latest period", () => {
  assert.equal(sma([1, 2, 3, 4, 5], 3), 4);
});

test("calculates ema with standard smoothing", () => {
  assert.equal(Number(ema([10, 12, 14], 3).toFixed(2)), 12);
});

test("calculates rsi for rising prices", () => {
  assert.equal(rsi([1, 2, 3, 4, 5], 3), 100);
});

test("calculates macd values from closes", () => {
  const value = macd(Array.from({ length: 40 }, (_, index) => index + 1));
  assert.ok(value.macd > 0);
  assert.ok(value.signal > 0);
  assert.ok(Number.isFinite(value.histogram));
});

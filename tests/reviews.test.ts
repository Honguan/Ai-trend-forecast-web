import test from "node:test";
import assert from "node:assert/strict";
import { calculateReviewStats, summarizePastReviews } from "../lib/reviews";
import type { ReviewRecord } from "../lib/types";

const reviews: ReviewRecord[] = [
  { id: 1, symbol: "AAPL", assetType: "stock", range: "1mo", createdAt: "2025-01-01", expected: 110, actual: 105, errorPct: 4.76 },
  { id: 2, symbol: "AAPL", assetType: "stock", range: "1mo", createdAt: "2025-01-02", expected: 90, actual: 100, errorPct: 10 }
];

test("calculates average review error and hit rate", () => {
  const stats = calculateReviewStats(reviews);
  assert.equal(Number(stats.averageErrorPct.toFixed(2)), 7.38);
  assert.equal(stats.hitRatePct, 50);
});

test("summarizes past reviews for ai prompt", () => {
  assert.match(summarizePastReviews(reviews), /平均誤差 7.38%/);
  assert.match(summarizePastReviews([]), /尚無/);
});

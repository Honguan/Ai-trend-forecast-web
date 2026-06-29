import type { ReviewRecord } from "./types";

export function calculateReviewStats(records: ReviewRecord[]): { averageErrorPct: number; hitRatePct: number } {
  if (records.length === 0) return { averageErrorPct: 0, hitRatePct: 0 };
  const averageErrorPct = records.reduce((sum, record) => sum + record.errorPct, 0) / records.length;
  const hitRatePct = (records.filter((record) => record.errorPct <= 5).length / records.length) * 100;
  return { averageErrorPct, hitRatePct };
}

export function summarizePastReviews(records: ReviewRecord[]): string {
  if (records.length === 0) return "尚無過去復盤紀錄。";
  const stats = calculateReviewStats(records);
  return `過去 ${records.length} 次復盤，平均誤差 ${stats.averageErrorPct.toFixed(2)}%，5% 內命中率 ${stats.hitRatePct.toFixed(0)}%。`;
}

export function calculateErrorPct(expected: number, actual: number): number {
  if (actual === 0) return 0;
  return Number((Math.abs(expected - actual) / actual * 100).toFixed(2));
}

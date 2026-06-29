import Database from "better-sqlite3";
import type { AnalysisResult, AssetType, ReviewRecord } from "./types";

const db = new Database(process.env.SQLITE_PATH ?? "trend-forecast.db");

db.exec(`
  create table if not exists analyses (
    id integer primary key autoincrement,
    symbol text not null,
    asset_type text not null,
    range text not null,
    interval text not null,
    result_json text not null,
    created_at text not null default current_timestamp
  );

  create table if not exists reviews (
    id integer primary key autoincrement,
    analysis_id integer not null,
    symbol text not null,
    asset_type text not null,
    range text not null,
    expected real not null,
    actual real not null,
    error_pct real not null,
    created_at text not null default current_timestamp
  );
`);

export function saveAnalysis(result: AnalysisResult): number {
  const info = db
    .prepare("insert into analyses (symbol, asset_type, range, interval, result_json) values (?, ?, ?, ?, ?)")
    .run(result.symbol, result.assetType, result.range, result.interval, JSON.stringify(result));
  return Number(info.lastInsertRowid);
}

export function listReviews(symbol: string, assetType: AssetType): ReviewRecord[] {
  return db
    .prepare(
      "select id, symbol, asset_type as assetType, range, created_at as createdAt, expected, actual, error_pct as errorPct from reviews where symbol = ? and asset_type = ? order by id desc limit 20"
    )
    .all(symbol, assetType) as ReviewRecord[];
}

export function saveReview(input: {
  analysisId: number;
  symbol: string;
  assetType: AssetType;
  range: string;
  expected: number;
  actual: number;
  errorPct: number;
}): number {
  const info = db
    .prepare("insert into reviews (analysis_id, symbol, asset_type, range, expected, actual, error_pct) values (?, ?, ?, ?, ?, ?, ?)")
    .run(input.analysisId, input.symbol, input.assetType, input.range, input.expected, input.actual, input.errorPct);
  return Number(info.lastInsertRowid);
}

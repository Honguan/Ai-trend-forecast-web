"use client";

import { FormEvent, useMemo, useState } from "react";
import type { AnalysisResult, AssetType, Candle, ForecastPoint } from "../lib/types";

const ranges = [
  ["1d", "1日"],
  ["5d", "5日"],
  ["1mo", "1個月"],
  ["6mo", "6個月"],
  ["1y", "1年"]
];

const intervals: Record<string, string> = {
  "1d": "5min",
  "5d": "30min",
  "1mo": "1day",
  "6mo": "1day",
  "1y": "1day"
};

export default function HomePage() {
  const [assetType, setAssetType] = useState<AssetType>("stock");
  const [symbol, setSymbol] = useState("AAPL");
  const [range, setRange] = useState("1mo");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const chart = useMemo(() => buildChart(candles, analysis?.forecast ?? []), [candles, analysis]);

  async function analyze(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const interval = intervals[range];
      const historyResponse = await fetch(`/api/market/history?type=${assetType}&symbol=${encodeURIComponent(symbol)}&range=${range}&interval=${interval}`);
      const history = await historyResponse.json();
      if (!historyResponse.ok) throw new Error(history.error);
      setCandles(history.candles);

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assetType, symbol, range, interval, candles: history.candles })
      });
      const nextAnalysis = await analysisResponse.json();
      if (!analysisResponse.ok) throw new Error(nextAnalysis.error);
      setAnalysis(nextAnalysis.result);
      setAnalysisId(nextAnalysis.analysisId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "分析失敗。");
    } finally {
      setLoading(false);
    }
  }

  async function syncReview() {
    if (!analysisId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/reviews/sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ analysisId, assetType, symbol, range, interval: intervals[range], forecast: analysis?.forecast })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setError(`已復盤：實際 ${data.review.actual}，誤差 ${data.review.errorPct}%`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "復盤失敗。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="topbar">
        <div>
          <h1>AI 走勢分析</h1>
          <p className="subtitle">本地部署，支援美股、加密貨幣與貴金屬；僅供研究，不構成投資建議。</p>
        </div>
      </div>

      <form className="form" onSubmit={analyze}>
        <label>
          類型
          <select value={assetType} onChange={(event) => setAssetType(event.target.value as AssetType)}>
            <option value="stock">美股</option>
            <option value="crypto">加密貨幣</option>
            <option value="metal">貴金屬</option>
          </select>
        </label>
        <label>
          代號
          <input value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder="AAPL / BTC/USD / XAU/USD" />
        </label>
        <label>
          範圍
          <select value={range} onChange={(event) => setRange(event.target.value)}>
            {ranges.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          間距
          <input value={intervals[range]} readOnly />
        </label>
        <button disabled={loading}>{loading ? "處理中" : "分析"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        <div className="panel">
          <div className="legend">
            <span>目前走勢</span>
            <span>預期走勢</span>
          </div>
          <svg className="chart" viewBox="0 0 920 420" role="img" aria-label="走勢與預測圖">
            <rect width="920" height="420" fill="#fff" />
            {chart.grid.map((line) => (
              <line key={line} x1="40" x2="890" y1={line} y2={line} stroke="#eef1f5" />
            ))}
            <polyline fill="none" stroke="#0f766e" strokeWidth="3" points={chart.history} />
            <polyline fill="none" stroke="#7c3aed" strokeDasharray="8 7" strokeWidth="3" points={chart.forecast} />
            {!candles.length && <text x="360" y="210" fill="#657184">請輸入代號並開始分析</text>}
          </svg>
        </div>

        <aside className="panel">
          <h2>分析理由</h2>
          <p className="explanation">{analysis?.explanation ?? "尚無分析。"}</p>
          {analysis && (
            <>
              <div className="stats">
                <div className="stat">
                  <b>趨勢</b>
                  <span>{analysis.indicators.trend}</span>
                </div>
                <div className="stat">
                  <b>RSI</b>
                  <span>{analysis.indicators.rsi14.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <b>MACD柱</b>
                  <span>{analysis.indicators.macdHistogram.toFixed(4)}</span>
                </div>
                <div className="stat">
                  <b>波動率</b>
                  <span>{analysis.indicators.volatilityPct.toFixed(2)}%</span>
                </div>
              </div>
              <button type="button" onClick={syncReview} disabled={loading} style={{ marginTop: 14 }}>
                同步復盤
              </button>
            </>
          )}
          <p className="muted" style={{ marginTop: 12 }}>預測線由技術模型產生，AI 只整理原因與風險。</p>
        </aside>
      </section>
    </main>
  );
}

function buildChart(candles: Candle[], forecastPoints: ForecastPoint[]) {
  const historyValues = candles.map((candle) => candle.close);
  const forecastValues = forecastPoints.map((point) => point.expected);
  const values = [...historyValues, ...forecastValues];
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const scaleY = (value: number) => 380 - ((value - min) / (max - min || 1)) * 330;
  const step = 850 / Math.max(values.length - 1, 1);
  const history = historyValues.map((value, index) => `${40 + index * step},${scaleY(value)}`).join(" ");
  const forecast = forecastValues.map((value, index) => `${40 + (historyValues.length + index) * step},${scaleY(value)}`).join(" ");
  return { history, forecast, grid: [50, 132, 214, 296, 378] };
}

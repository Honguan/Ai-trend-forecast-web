# AI 走勢分析本地網頁

本專案是一個本地部署的 AI 走勢分析與復盤工具。它使用 Twelve Data 取得歷史走勢資料，以技術指標產生預測線，並透過 OpenAI 相容端點整理分析理由與風險說明。

分析內容僅供研究，不構成投資建議。

## 功能

- 熱門商品下拉選單，自動帶入資產類型與代號。
- 支援美股、ETF、指數、外匯、加密貨幣、貴金屬與能源商品。
- 同一張圖顯示目前走勢與預期走勢。
- 技術指標包含 SMA、EMA、RSI、MACD 與波動率。
- AI 說明走勢原因、預測依據與主要風險。
- 使用 SQLite 保存分析與復盤紀錄。

## 環境需求

- Node.js 22 或更新版本
- npm
- Twelve Data API key

## 安裝

```bash
npm install
```

建立 `.env`，可從 `.env.example` 複製：

```bash
cp .env.example .env
```

Windows PowerShell 可用：

```powershell
Copy-Item .env.example .env
```

## 環境變數

```env
MARKET_DATA_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
SQLITE_PATH=./trend-forecast.db
```

- `MARKET_DATA_API_KEY`：必填，Twelve Data API key。
- `OPENAI_BASE_URL`：選填，OpenAI 相容 API 端點。
- `OPENAI_API_KEY`：選填，未設定時會使用本機規則說明。
- `OPENAI_MODEL`：選填，AI 模型名稱。
- `SQLITE_PATH`：選填，SQLite 資料庫檔案位置。

## 開發

```bash
npm run dev
```

預設網址：

```text
http://localhost:3000
```

## 測試與建置

```bash
npm test
npm run build
```

## 本機 Production

先建置：

```bash
npm run build
```

啟動：

```bash
npm start
```

## 部署注意事項

本專案包含 Next.js API routes 與 SQLite，因此不適合純靜態部署。

部署環境需要：

- 可執行 Node.js server。
- 可設定環境變數。
- 可保留 SQLite 檔案，否則復盤資料會在重啟或重新部署後遺失。

若部署到 Vercel、Render、Railway 或其他雲端平台，請確認是否有持久化磁碟或改用外部資料庫。

## 使用流程

1. 選擇熱門商品，或手動輸入代號。
2. 選擇時間範圍。
3. 按下「分析」取得歷史走勢、預測線與 AI 分析理由。
4. 之後可按「同步復盤」保存預測誤差。

## 限制

- 第一版不包含交易下單。
- 第一版不訓練自有模型。
- 資料可用性受 Twelve Data 支援商品與 API 額度限制。
- AI 回覆品質取決於設定的 OpenAI 相容模型。

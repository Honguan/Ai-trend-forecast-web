import type { AssetType } from "./types";

export type Instrument = {
  assetType: AssetType;
  symbol: string;
  name: string;
  group: string;
};

export const supportedAssetTypes: AssetType[] = ["stock", "etf", "index", "forex", "crypto", "metal", "commodity"];

export const popularInstruments: Instrument[] = [
  { assetType: "stock", symbol: "AAPL", name: "Apple", group: "美股" },
  { assetType: "stock", symbol: "MSFT", name: "Microsoft", group: "美股" },
  { assetType: "stock", symbol: "NVDA", name: "NVIDIA", group: "美股" },
  { assetType: "stock", symbol: "TSLA", name: "Tesla", group: "美股" },
  { assetType: "stock", symbol: "AMZN", name: "Amazon", group: "美股" },
  { assetType: "stock", symbol: "GOOGL", name: "Alphabet", group: "美股" },
  { assetType: "stock", symbol: "META", name: "Meta", group: "美股" },
  { assetType: "etf", symbol: "SPY", name: "S&P 500 ETF", group: "ETF" },
  { assetType: "etf", symbol: "QQQ", name: "Nasdaq 100 ETF", group: "ETF" },
  { assetType: "etf", symbol: "DIA", name: "Dow Jones ETF", group: "ETF" },
  { assetType: "etf", symbol: "IWM", name: "Russell 2000 ETF", group: "ETF" },
  { assetType: "etf", symbol: "GLD", name: "Gold ETF", group: "ETF" },
  { assetType: "etf", symbol: "SLV", name: "Silver ETF", group: "ETF" },
  { assetType: "etf", symbol: "TLT", name: "20+ Year Treasury ETF", group: "ETF" },
  { assetType: "index", symbol: "SPX", name: "S&P 500 Index", group: "指數" },
  { assetType: "index", symbol: "NDX", name: "Nasdaq 100 Index", group: "指數" },
  { assetType: "index", symbol: "DJI", name: "Dow Jones Index", group: "指數" },
  { assetType: "index", symbol: "VIX", name: "Volatility Index", group: "指數" },
  { assetType: "forex", symbol: "EUR/USD", name: "Euro / US Dollar", group: "外匯" },
  { assetType: "forex", symbol: "USD/JPY", name: "US Dollar / Japanese Yen", group: "外匯" },
  { assetType: "forex", symbol: "GBP/USD", name: "British Pound / US Dollar", group: "外匯" },
  { assetType: "forex", symbol: "AUD/USD", name: "Australian Dollar / US Dollar", group: "外匯" },
  { assetType: "crypto", symbol: "BTC/USD", name: "Bitcoin", group: "加密貨幣" },
  { assetType: "crypto", symbol: "ETH/USD", name: "Ethereum", group: "加密貨幣" },
  { assetType: "crypto", symbol: "SOL/USD", name: "Solana", group: "加密貨幣" },
  { assetType: "crypto", symbol: "BNB/USD", name: "BNB", group: "加密貨幣" },
  { assetType: "metal", symbol: "XAU/USD", name: "Gold Spot", group: "貴金屬" },
  { assetType: "metal", symbol: "XAG/USD", name: "Silver Spot", group: "貴金屬" },
  { assetType: "metal", symbol: "XPT/USD", name: "Platinum Spot", group: "貴金屬" },
  { assetType: "metal", symbol: "XPD/USD", name: "Palladium Spot", group: "貴金屬" },
  { assetType: "commodity", symbol: "WTI/USD", name: "WTI Crude Oil", group: "能源商品" },
  { assetType: "commodity", symbol: "BRENT/USD", name: "Brent Crude Oil", group: "能源商品" },
  { assetType: "commodity", symbol: "NG/USD", name: "Natural Gas", group: "能源商品" }
];

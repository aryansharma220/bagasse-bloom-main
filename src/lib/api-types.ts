export interface MarketSeriesPoint {
  year: string;
  demand?: number;
  price?: number;
}

export interface MarketSeries {
  demandSeries: Array<{ year: string; demand: number }>;
  priceSeries: Array<{ year: string; price: number }>;
  generatedAt: string;
}

export interface MarketPriceSnapshot {
  goPriceMin: number;
  goPriceMax: number;
  goPriceAvg: number;
  confidence?: number;
  timestamp?: string;
  sources?: string[];
}

export interface MarketNewsItem {
  title?: string;
  source?: string;
  date?: string;
  relevance?: string;
}

export interface AllMarketData {
  marketPrices: MarketPriceSnapshot;
  marketSeries: MarketSeries;
  electricity: Record<string, unknown>;
  incentives: Record<string, unknown>;
  news: MarketNewsItem[];
  timestamp: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success?: false;
  error: string;
  timestamp?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface InvestmentRecommendationData {
  recommendation: string;
  model?: string;
}

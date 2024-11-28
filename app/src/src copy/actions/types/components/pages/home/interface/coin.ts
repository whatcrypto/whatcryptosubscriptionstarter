// Common Types
type Trend = 'up' | 'down' | 'stable'
type Sentiment = 'positive' | 'negative' | 'neutral'
type GradeType = 'buy' | 'sell' | 'hold'

// Market and Price Types
export interface CoinPrices {
  current: number;
  entry: number;
  target: number;
  nextEntry: number;
  stopLoss: number;
}

// Analysis Types
export interface TechnicalAnalysis {
  trend: string;
  macd: string;
  rsi: number;
  movingAverage: string;
  accumulation: string;
}

export interface FundamentalAnalysis {
  networkGrowth: string;
  developerActivity: string;
  institutionalInterest: string;
}

// Metrics Types
export interface CoinMetrics {
  volatility: string;
  momentum: number;
  phase: string;
  nextSupport: number;
}

export interface Score {
  score: number;
  trend: Trend;
  description: string;
}

export interface CoinScores {
  developerActivity: Score;
  socialSentiment: Score;
  walletActivity: Score;
  networkMetrics: Score;
  institutionalInterest: Score;
  ecosystemGrowth: Score;
  liquidityDepth: Score;
  protocolHealth: Score;
}

// Main Coin Type
export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  signal: string;
  stage: string;
  grade: GradeType;
  prices: CoinPrices;
  analysis: {
    technical: TechnicalAnalysis;
    fundamental: FundamentalAnalysis;
  };
  metrics: CoinMetrics;
  scores: CoinScores;
}

// Component Props
export interface CoinProps {
  coin: Coin;
}

export interface CoinListProps {
  coins: Coin[];
}

export interface CoinAnalysisProps extends CoinProps {}
export interface CoinMetricsProps extends CoinProps {}
export interface CoinPricesProps extends CoinProps {}
export interface CoinScoringProps {
  scores: CoinScores;
}
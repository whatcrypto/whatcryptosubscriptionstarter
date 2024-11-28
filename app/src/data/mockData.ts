export interface MarketInsight {
  devActivity: {
    score: number;
    commits: number;
    activeDevs: number;
    trend: 'up' | 'down' | 'stable';
  };
  socialSentiment: {
    score: number;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    trend: 'up' | 'down' | 'stable';
  };
  walletActivity: {
    activeWallets: number;
    newWallets: number;
    trend: 'up' | 'down' | 'stable';
  };
  networkMetrics: {
    validatorCount?: number;
    transactionsPerDay: number;
    networkGrowth: number;
  };
  institutionalInterest: {
    score: number;
    majorHolders: number;
    recentInvestments: number;
  };
  ecosystemGrowth: {
    partnerships: number;
    integrations: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  rating: number;
  insights: MarketInsight;
}

export const cryptoData: CryptoData[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 65432.10,
    change24h: 2.4,
    marketCap: 1234567890000,
    volume: 28945670000,
    rating: 5,
    insights: {
      devActivity: {
        score: 92,
        commits: 1243,
        activeDevs: 89,
        trend: 'up'
      },
      socialSentiment: {
        score: 88,
        mentions: 125000,
        sentiment: 'positive',
        trend: 'up'
      },
      walletActivity: {
        activeWallets: 1250000,
        newWallets: 25000,
        trend: 'up'
      },
      networkMetrics: {
        transactionsPerDay: 325000,
        networkGrowth: 15
      },
      institutionalInterest: {
        score: 95,
        majorHolders: 42,
        recentInvestments: 8
      },
      ecosystemGrowth: {
        partnerships: 156,
        integrations: 892,
        trend: 'up'
      }
    }
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3456.78,
    change24h: -1.2,
    marketCap: 456789012345,
    volume: 12345678900,
    rating: 4,
    insights: {
      devActivity: {
        score: 98,
        commits: 2156,
        activeDevs: 156,
        trend: 'up'
      },
      socialSentiment: {
        score: 85,
        mentions: 98000,
        sentiment: 'positive',
        trend: 'up'
      },
      walletActivity: {
        activeWallets: 890000,
        newWallets: 18000,
        trend: 'up'
      },
      networkMetrics: {
        validatorCount: 845000,
        transactionsPerDay: 1250000,
        networkGrowth: 22
      },
      institutionalInterest: {
        score: 92,
        majorHolders: 38,
        recentInvestments: 6
      },
      ecosystemGrowth: {
        partnerships: 234,
        integrations: 1456,
        trend: 'up'
      }
    }
  },
  {
    id: '3',
    name: 'Solana',
    symbol: 'SOL',
    price: 123.45,
    change24h: 5.6,
    marketCap: 78901234567,
    volume: 3456789012,
    rating: 4,
    insights: {
      devActivity: {
        score: 95,
        commits: 1876,
        activeDevs: 123,
        trend: 'up'
      },
      socialSentiment: {
        score: 82,
        mentions: 75000,
        sentiment: 'positive',
        trend: 'up'
      },
      walletActivity: {
        activeWallets: 560000,
        newWallets: 15000,
        trend: 'up'
      },
      networkMetrics: {
        validatorCount: 1850,
        transactionsPerDay: 2450000,
        networkGrowth: 28
      },
      institutionalInterest: {
        score: 88,
        majorHolders: 28,
        recentInvestments: 5
      },
      ecosystemGrowth: {
        partnerships: 145,
        integrations: 678,
        trend: 'up'
      }
    }
  }
];

export const insightMetrics = [
  {
    key: 'devActivity',
    label: 'Developer Activity',
    description: 'Measures GitHub activity, active developers, and code commits'
  },
  {
    key: 'socialSentiment',
    label: 'Social Sentiment',
    description: 'Analyzes social media mentions and overall sentiment'
  },
  {
    key: 'walletActivity',
    label: 'Wallet Activity',
    description: 'Tracks active wallets and new wallet creation'
  },
  {
    key: 'networkMetrics',
    label: 'Network Metrics',
    description: 'Monitors network growth, transactions, and validators'
  },
  {
    key: 'institutionalInterest',
    label: 'Institutional Interest',
    description: 'Tracks major holders and institutional investments'
  },
  {
    key: 'ecosystemGrowth',
    label: 'Ecosystem Growth',
    description: 'Measures partnerships and platform integrations'
  }
];
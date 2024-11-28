import type { MarketInsight } from './mockData';
import { getGradeForCoin, getBadgeColor } from '../utils/marketCycle';

export interface CategorizedCoin {
  id: string;
  name: string;
  symbol: string;
  category: string;
  rating: number;
  grade: 'buy' | 'sell' | 'hold';
  badgeColor: 'green' | 'red' | 'yellow';
  shortTermPhase: string;
  longTermPhase: string;
  percentChange: number;
  insights: MarketInsight;
}

// Sample insights template
const generateInsights = (score: number = 85): MarketInsight => ({
  devActivity: {
    score,
    commits: Math.floor(Math.random() * 2000) + 500,
    activeDevs: Math.floor(Math.random() * 100) + 20,
    trend: Math.random() > 0.5 ? 'up' : 'down'
  },
  socialSentiment: {
    score: Math.floor(Math.random() * 20) + 70,
    mentions: Math.floor(Math.random() * 100000) + 10000,
    sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
    trend: Math.random() > 0.5 ? 'up' : 'down'
  },
  walletActivity: {
    activeWallets: Math.floor(Math.random() * 500000) + 100000,
    newWallets: Math.floor(Math.random() * 20000) + 5000,
    trend: Math.random() > 0.5 ? 'up' : 'down'
  },
  networkMetrics: {
    validatorCount: Math.floor(Math.random() * 2000) + 500,
    transactionsPerDay: Math.floor(Math.random() * 2000000) + 500000,
    networkGrowth: Math.floor(Math.random() * 30) + 10
  },
  institutionalInterest: {
    score: Math.floor(Math.random() * 20) + 70,
    majorHolders: Math.floor(Math.random() * 40) + 10,
    recentInvestments: Math.floor(Math.random() * 8) + 2
  },
  ecosystemGrowth: {
    partnerships: Math.floor(Math.random() * 200) + 50,
    integrations: Math.floor(Math.random() * 1000) + 200,
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }
});

export const baseCoinData = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    category: 'Store of Value',
    rating: 5.0,
    shortTermPhase: 'Accumulation',
    longTermPhase: 'Markup',
    percentChange: 2.4,
    insights: generateInsights(95)
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    category: 'Smart Contract Platform',
    rating: 4.9,
    shortTermPhase: 'Breakout',
    longTermPhase: 'Markup',
    percentChange: 3.2,
    insights: generateInsights(94)
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    category: 'Layer 1',
    rating: 4.8,
    shortTermPhase: 'Accumulation',
    longTermPhase: 'Markup',
    percentChange: 5.6,
    insights: generateInsights(92)
  },
  {
    id: 'ada',
    name: 'Cardano',
    symbol: 'ADA',
    category: 'Layer 1',
    rating: 4.7,
    shortTermPhase: 'Distribution',
    longTermPhase: 'Accumulation',
    percentChange: -2.1,
    insights: generateInsights(90)
  },
  {
    id: 'avax',
    name: 'Avalanche',
    symbol: 'AVAX',
    category: 'Layer 1',
    rating: 4.6,
    shortTermPhase: 'Breakout',
    longTermPhase: 'Markup',
    percentChange: 6.7,
    insights: generateInsights(89)
  },
  {
    id: 'uni',
    name: 'Uniswap',
    symbol: 'UNI',
    category: 'DeFi',
    rating: 4.5,
    shortTermPhase: 'Accumulation',
    longTermPhase: 'Markup',
    percentChange: 4.2,
    insights: generateInsights(88)
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    category: 'Web3',
    rating: 4.7,
    shortTermPhase: 'Accumulation',
    longTermPhase: 'Markup',
    percentChange: 3.2,
    insights: generateInsights(91)
  },
  {
    id: 'matic',
    name: 'Polygon',
    symbol: 'MATIC',
    category: 'Layer 2',
    rating: 4.4,
    shortTermPhase: 'Accumulation',
    longTermPhase: 'Markup',
    percentChange: 2.8,
    insights: generateInsights(87)
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    symbol: 'ARB',
    category: 'Layer 2',
    rating: 4.4,
    shortTermPhase: 'Breakout',
    longTermPhase: 'Markup',
    percentChange: 7.2,
    insights: generateInsights(87)
  },
  {
    id: 'op',
    name: 'Optimism',
    symbol: 'OP',
    category: 'Layer 2',
    rating: 4.3,
    shortTermPhase: 'Accumulation',
    longTermPhase: 'Markup',
    percentChange: 5.8,
    insights: generateInsights(86)
  },
  {
    id: 'aave',
    name: 'Aave',
    symbol: 'AAVE',
    category: 'DeFi',
    rating: 4.4,
    shortTermPhase: 'Breakout',
    longTermPhase: 'Markup',
    percentChange: 3.8,
    insights: generateInsights(87)
  },
  {
    id: 'mkr',
    name: 'Maker',
    symbol: 'MKR',
    category: 'DeFi',
    rating: 4.3,
    shortTermPhase: 'Accumulation',
    longTermPhase: 'Markup',
    percentChange: 2.9,
    insights: generateInsights(86)
  },
  {
    id: 'dot',
    name: 'Polkadot',
    symbol: 'DOT',
    category: 'Interoperability',
    rating: 4.5,
    shortTermPhase: 'Distribution',
    longTermPhase: 'Accumulation',
    percentChange: -1.5,
    insights: generateInsights(88)
  },
  {
    id: 'axs',
    name: 'Axie Infinity',
    symbol: 'AXS',
    category: 'Gaming',
    rating: 4.2,
    shortTermPhase: 'Distribution',
    longTermPhase: 'Accumulation',
    percentChange: -3.2,
    insights: generateInsights(84)
  },
  {
    id: 'mana',
    name: 'Decentraland',
    symbol: 'MANA',
    category: 'Metaverse',
    rating: 4.1,
    shortTermPhase: 'Correction',
    longTermPhase: 'Accumulation',
    percentChange: -2.8,
    insights: generateInsights(83)
  }
];

// Function to generate categorized coins with dynamic grades
export function getCategorizedCoins(): CategorizedCoin[] {
  return baseCoinData.map(coin => {
    const grade = getGradeForCoin(coin as CategorizedCoin);
    return {
      ...coin,
      grade,
      badgeColor: getBadgeColor(grade)
    };
  });
}

export const categorizedCoins = getCategorizedCoins();

export const filterCoins = (
  coins: CategorizedCoin[],
  category: string,
  sortBy: string = 'rating'
): CategorizedCoin[] => {
  let filteredCoins = [...coins];

  // Apply category filters
  switch (category) {
    case 'wc20':
      filteredCoins = filteredCoins.filter(coin => coin.rating >= 4.5);
      break;
    case 'sector-leaders':
      filteredCoins = filteredCoins.filter(coin => 
        coin.grade === 'buy' && 
        coin.rating >= 4.3 && 
        coin.insights.devActivity.score >= 85
      );
      break;
    case '100x':
      filteredCoins = filteredCoins.filter(coin => 
        coin.shortTermPhase === 'Accumulation' && 
        coin.longTermPhase === 'Markup' &&
        coin.insights.devActivity.trend === 'up' &&
        coin.insights.socialSentiment.trend === 'up'
      );
      break;
    case 'moonshots':
      filteredCoins = filteredCoins.filter(coin => 
        coin.percentChange > 5 &&
        coin.insights.devActivity.score >= 80 &&
        coin.insights.socialSentiment.sentiment === 'positive'
      );
      break;
    case 'innovators':
      filteredCoins = filteredCoins.filter(coin => 
        coin.insights.devActivity.score >= 85 &&
        coin.insights.ecosystemGrowth.trend === 'up'
      );
      break;
    case 'income':
      filteredCoins = filteredCoins.filter(coin => 
        coin.category.includes('Layer 1') || 
        coin.category === 'DeFi'
      );
      break;
    case 'buyhold':
      filteredCoins = filteredCoins.filter(coin => 
        coin.grade === 'buy' &&
        coin.longTermPhase === 'Accumulation' &&
        coin.rating >= 4.0
      );
      break;
    case 'potential':
      filteredCoins = filteredCoins.filter(coin => 
        coin.insights.socialSentiment.trend === 'up' &&
        coin.insights.devActivity.trend === 'up' &&
        coin.rating >= 4.0
      );
      break;
    case 'risk-reward':
      filteredCoins = filteredCoins.filter(coin => 
        coin.percentChange > 5 &&
        coin.rating >= 3.8 &&
        coin.insights.devActivity.score >= 75
      );
      break;
  }

  // Apply sorting
  filteredCoins.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'change':
        return b.percentChange - a.percentChange;
      case 'devActivity':
        return b.insights.devActivity.score - a.insights.devActivity.score;
      case 'social':
        return b.insights.socialSentiment.score - a.insights.socialSentiment.score;
      default:
        return b.rating - a.rating;
    }
  });

  return filteredCoins;
};

export const categories = [
  {
    id: 'wc20',
    name: 'WC20',
    description: 'Top 20 cryptocurrencies by WhatCrypto score'
  },
  {
    id: 'sector-leaders',
    name: 'Sector Leaders',
    description: 'Leading projects in their respective sectors'
  },
  {
    id: '100x',
    name: '100x Opportunities',
    description: 'High-growth potential projects with strong fundamentals'
  },
  {
    id: 'moonshots',
    name: 'Moonshots',
    description: 'Early-stage projects with massive potential'
  },
  {
    id: 'innovators',
    name: 'Innovators',
    description: 'Projects pushing technological boundaries'
  },
  {
    id: 'income',
    name: 'Income Generators',
    description: 'Best staking and yield opportunities'
  },
  {
    id: 'buyhold',
    name: 'Buy & Hold',
    description: 'Long-term investment opportunities'
  },
  {
    id: 'potential',
    name: 'High Potential',
    description: 'Projects showing strong growth signals'
  },
  {
    id: 'risk-reward',
    name: 'High Risk/Reward',
    description: 'Higher risk projects with potential for significant returns'
  }
];
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { 
  CoinHeader, 
  CoinActions,
  CoinPrices, 
  CoinAnalysis,
  CoinMetrics,
  CoinScoring,
  CoinSimilarOpportunities
} from '../components/coin-details';

const CoinDetails: React.FC = () => {
  const { id } = useParams();

  // Sample data - in a real app, this would come from an API or store
  const coinData = {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45000,
    change: 2.5,
    signal: 'Buy',
    stage: 'Accumulation',
    grade: 'A+',
    prices: {
      current: 45000,
      entry: 42500,
      target: 52000,
      nextEntry: 41000,
      stopLoss: 39000
    },
    metrics: {
      volatility: 'Medium',
      momentum: 1.8,
      phase: 'Markup',
      nextSupport: 41200
    },
    analysis: {
      technical: {
        trend: 'Uptrend',
        macd: 'Bullish',
        rsi: 65,
        movingAverage: 'Above 200MA',
        accumulation: 'Strong buying'
      },
      fundamental: {
        networkGrowth: 'High',
        developerActivity: 'Medium',
        institutionalInterest: 'High'
      }
    },
    scores: {
      developerActivity: {
        score: 92,
        trend: 'up' as const,
        activeDevs: 156,
        commits: 1243,
        repositories: 89,
        description: 'Strong developer activity with consistent growth'
      },
      socialSentiment: {
        score: 88,
        trend: 'up' as const,
        mentions: 125000,
        sentiment: 'Positive',
        engagement: 82,
        description: 'High social engagement and positive sentiment'
      },
      walletActivity: {
        score: 85,
        trend: 'up' as const,
        activeWallets: 1250000,
        newWallets: 25000,
        transactions: 325000,
        description: 'Growing network activity and adoption'
      },
      networkMetrics: {
        score: 90,
        trend: 'up' as const,
        validatorCount: 845000,
        transactionsPerDay: 1250000,
        networkGrowth: 15,
        description: 'Strong network fundamentals and growth'
      },
      institutionalInterest: {
        score: 95,
        trend: 'up' as const,
        majorHolders: 42,
        recentInvestments: 8,
        institutionalHoldings: 856000,
        description: 'High institutional adoption and investment'
      },
      ecosystemGrowth: {
        score: 87,
        trend: 'up' as const,
        partnerships: 156,
        integrations: 892,
        newProjects: 45,
        description: 'Expanding ecosystem with new partnerships'
      },
      liquidityDepth: {
        score: 94,
        trend: 'up' as const,
        volume24h: 28945670000,
        marketCap: 1234567890000,
        liquidity: 'High',
        description: 'Deep liquidity across major exchanges'
      },
      protocolHealth: {
        score: 96,
        trend: 'up' as const,
        uptime: 99.99,
        securityScore: 95,
        decentralization: 'High',
        description: 'Robust protocol with strong security measures'
      }
    },
    investorProfiles: {
      aggressive: {
        action: 'Buy',
        allocation: 35,
        strategy: 'Accumulate aggressively at current levels with a focus on momentum'
      },
      moderate: {
        action: 'Hold',
        allocation: 15,
        strategy: 'Scale in gradually with a balanced risk approach'
      },
      conservative: {
        action: 'Watch',
        allocation: 5,
        strategy: 'Maintain small position, focus on risk management'
      }
    },
    similarOpportunities: [
      {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 2480.50,
        change: 1.8,
        description: 'Similar technical setup'
      },
      {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        price: 98.75,
        change: 3.2,
        description: 'Strong momentum indicators'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Link 
        to="/markets" 
        className="inline-flex items-center text-slate-400 hover:text-slate-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Markets
      </Link>

      <div className="space-y-6">
        <CoinHeader coin={coinData} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CoinPrices coin={coinData} />
          <CoinMetrics coin={coinData} />
        </div>
        <CoinScoring scores={coinData.scores} />
        <CoinAnalysis coin={coinData} />
        <CoinActions coin={coinData} />
        <CoinSimilarOpportunities coins={coinData.similarOpportunities} />
      </div>
    </div>
  );
};

export default CoinDetails;
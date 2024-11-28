import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  CoinHeader, 
  CoinActions,
  CoinPrices, 
  CoinAnalysis,
  CoinMetrics,
  CoinSimilarOpportunities
} from '../components/coin-details';

interface Props {
  isDarkMode: boolean;
}

const News: React.FC<Props> = () => {
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
    <div className="min-h-screen bg-[#0B1222] text-white">
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-4">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Coins
        </Link>

        <div className="space-y-4">
          <CoinHeader coin={coinData} />
          <CoinPrices coin={coinData} />
          <CoinActions coin={coinData} />
          <CoinAnalysis coin={coinData} />
          <CoinMetrics coin={coinData} />
          <CoinSimilarOpportunities coins={coinData.similarOpportunities} />
        </div>
      </div>
    </div>
  );
};

export default News;
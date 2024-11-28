import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CoinHeader } from './sections/CoinHeader';
import { CoinActions } from './sections/CoinActions';
import { CoinPrices } from './sections/CoinPrices';
import { CoinAnalysis } from './sections/CoinAnalysis';
import { CoinMetrics } from './sections/CoinMetrics';
import { SimilarCoins } from './sections/SimilarCoins';
import { MarketInsights } from './sections/MarketInsights';

interface CoinDetailProps {
  id: string;
}

export function CoinDetail({ id }: CoinDetailProps) {
  // This would typically come from an API
  const coin = {
    id,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45000,
    change: 2.5,
    signal: 'buy',
    stage: 'Accumulation',
    marketCap: '857.2B',
    volume: '24.5B',
    prices: {
      current: 45000,
      entry: 42500,
      target: 52000,
      nextEntry: 41000,
      stopLoss: 39000
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
    metrics: {
      volatility: 'Medium',
      momentum: 1.8,
      phase: 'Markup',
      nextSupport: 41200
    },
    insights: {
      developer: {
        activity: 'High',
        commits: '+47% MoM',
        contributors: '235 active',
        repositories: '12 new',
        description: 'Strong development momentum with increasing contributor base'
      },
      social: {
        sentiment: 'Positive',
        mentions: '+85% WoW',
        engagement: 'High',
        trending: true,
        description: 'Growing social interest and positive community sentiment'
      },
      network: {
        growth: 'Accelerating',
        transactions: '+32% MoM',
        activeAddresses: '1.2M',
        newWallets: '+15K daily',
        description: 'Network activity showing strong organic growth'
      },
      institutional: {
        interest: 'Strong',
        holdings: '+$450M',
        entities: '15 new',
        description: 'Increasing institutional adoption and accumulation'
      },
      innovation: {
        score: 'High',
        updates: '2 major',
        partnerships: '5 new',
        description: 'Recent protocol upgrades and ecosystem expansion'
      }
    },
    grade: 'A',
    performance: {
      day: '+2.5%',
      week: '+8.7%',
      month: '+15.2%'
    },
    investorProfiles: {
      aggressive: {
        action: 'Buy',
        allocation: 30,
        strategy: 'Accumulate aggressively at current levels with a focus on momentum'
      },
      moderate: {
        action: 'Buy',
        allocation: 15,
        strategy: 'Scale in gradually with a balanced risk approach'
      },
      conservative: {
        action: 'Hold',
        allocation: 5,
        strategy: 'Maintain small position, focus on risk management'
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link 
        href="/coins"
        className="inline-flex items-center gap-2 text-content-secondary hover:text-content transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Coins
      </Link>

      <div className="flex flex-col gap-8">
        <CoinHeader coin={coin} />
        <div className="grid lg:grid-cols-2 gap-8">
          <CoinPrices coin={coin} />
          <CoinActions coin={coin} />
        </div>
        <MarketInsights insights={coin.insights} />
        <CoinAnalysis coin={coin} />
        <CoinMetrics coin={coin} />
        <SimilarCoins currentCoin={coin} />
      </div>
    </div>
  );
}
import React from 'react';
import { Coin } from '@/src/components/pages/coins/interface/coin';
import { CoinActions, CoinMetrics } from '@/whatcrypto.app/src/components/coin-details';
import { CoinHeader, CoinScoring, CoinSimilarOpportunities } from '@/whatcrypto.app/src/components/coin-details';
import { MoneyFlowCycle } from '@/src/components/types/coin';
import { CoinFundamentalAnalysis } from '@/whatcrypto.app/src/components/coin-details/CoinFundamentalAnalysis';
import { CoinTechnicalAnalysis } from '@/whatcrypto.app/src/components/coin-details/CoinTechnicalAnalysis';

interface CoinPageProps {
  coin: Coin;
}

export default function CoinPage({ coin }: CoinPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <CoinHeader coin={coin} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price and Actions Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <CoinPrices coin={coin} />
            <CoinActions coin={coin} />
          </div>

          {/* Analysis Section */}
          <div className="bg-[#151C2C] rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <CoinTechnicalAnalysis 
                trend={coin.analysis.technical.trend}
                rsi={coin.analysis.technical.rsi}
                accumulation={coin.analysis.technical.accumulation}
                macd={coin.analysis.technical.macd}
                movingAverage={coin.analysis.technical.movingAverage}
              />
              <CoinFundamentalAnalysis 
                networkGrowth={coin.analysis.fundamental.networkGrowth}
                developerActivity={coin.analysis.fundamental.developerActivity}
                institutionalInterest={coin.analysis.fundamental.institutionalInterest}
              />
            </div>
          </div>

          {/* Metrics and Scoring */}
          <div className="grid md:grid-cols-2 gap-6">
            <CoinMetrics coin={coin} />
            <CoinScoring scores={coin.scores} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <MoneyFlowCycle />
          <CoinSimilarOpportunities coins={coin.similarOpportunities} />
        </div>
      </div>
    </div>
  );
}

// Export all components together
export {
  CoinHeader,
  CoinActions,
  CoinTechnicalAnalysis,
  CoinFundamentalAnalysis,
  CoinMetrics,
  CoinScoring,
  MoneyFlowCycle,
  CoinSimilarOpportunities,
};          
            
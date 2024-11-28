import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import {
  CoinActions,
  CoinAnalysis,
  CoinHeader,
  CoinMetrics,
  CoinPrices,
  CoinScoring,
  CoinSimilarOpportunities,
} from '../coin-details/index';

export default async function CoinDetailsPage({ params }: { params: { id: string } }) {
  // This would be a server component fetching data
  const coinData = {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45000,
    change: 2.5,
    signal: 'Buy',
    stage: 'Accumulation',
    grade: 'A+',
    // ... rest of your coin data
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/markets"
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
  )
} 
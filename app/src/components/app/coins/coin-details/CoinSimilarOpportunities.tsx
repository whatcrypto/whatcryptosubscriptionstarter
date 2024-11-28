import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SimilarCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  description: string;
}

interface CoinSimilarOpportunitiesProps {
  coins: SimilarCoin[];
}

export function CoinSimilarOpportunities({ coins }: CoinSimilarOpportunitiesProps) {
  return (
    <div className="bg-[#151C2C] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Similar Opportunities</h2>
        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1">
          View More Similar Coins
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {coins.map((coin) => (
          <div key={coin.id} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">{coin.name}</h3>
                  <span className="text-sm text-slate-400">{coin.symbol}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{coin.description}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">${coin.price.toLocaleString()}</p>
                <p className={`text-sm flex items-center justify-end gap-1 ${
                  coin.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {coin.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {coin.change >= 0 ? '+' : ''}{coin.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
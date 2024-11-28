import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight, Zap } from 'lucide-react';

interface SimilarCoinsProps {
  currentCoin: {
    id: string;
  };
}

export function SimilarCoins({ currentCoin }: SimilarCoinsProps) {
  const similarCoins = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2800,
      change: -1.2,
      signal: 'hold',
      reason: 'Similar market cycle and correlation',
      matchType: 'Market Phase',
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      price: 1.25,
      change: 5.8,
      signal: 'buy',
      reason: 'Strong technical setup',
      matchType: 'Technical Pattern',
    },
  ].filter(coin => coin.id !== currentCoin.id);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Similar Opportunities</h2>
      
      <div className="flex flex-col gap-4">
        {similarCoins.map((coin) => (
          <Link
            key={coin.id}
            to={`/coins/${coin.id}`}
            className="block p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  coin.signal === 'buy' ? 'bg-emerald-500/20' : 'bg-yellow-500/20'
                }`}>
                  {coin.change > 0 ? (
                    <TrendingUp className={`w-5 h-5 ${
                      coin.signal === 'buy' ? 'text-emerald-400' : 'text-yellow-400'
                    }`} />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{coin.name}</h3>
                    <span className="text-sm text-slate-400">{coin.symbol}</span>
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      <Zap className="w-3 h-3" />
                      {coin.matchType}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{coin.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">${coin.price.toLocaleString()}</p>
                <p className={`text-sm ${coin.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {coin.change > 0 ? '+' : ''}{coin.change}%
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-3 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2 bg-blue-500/10 rounded-lg hover:bg-blue-500/20">
        View More Similar Coins
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
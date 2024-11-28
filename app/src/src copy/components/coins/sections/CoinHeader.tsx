import React from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface CoinHeaderProps {
  coin: {
    name: string;
    symbol: string;
    price: number;
    change: number;
    signal: string;
    stage: string;
    grade: string;
  };
}

export function CoinHeader({ coin }: CoinHeaderProps) {
  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case 'buy':
        return 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30';
      case 'sell':
        return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button className="text-slate-400 hover:text-yellow-400 transition-colors">
              <Star className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
                <span className="text-sm text-slate-400">{coin.symbol}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                  Grade {coin.grade}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getSignalColor(coin.signal)}`}>
                  {coin.signal.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                  {coin.stage}
                </span>
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Add to Portfolio
          </button>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-white">${coin.price.toLocaleString()}</p>
          <p className={`flex items-center gap-1 text-lg ${
            coin.change > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {coin.change > 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            {Math.abs(coin.change)}%
          </p>
        </div>
      </div>
    </div>
  );
}
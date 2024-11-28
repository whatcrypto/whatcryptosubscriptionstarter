import React from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface CoinOverviewProps {
  coin: {
    name: string;
    symbol: string;
    price: number;
    change: number;
    signal: string;
    stage: string;
    marketCap: string;
    volume: string;
  };
}

export function CoinOverview({ coin }: CoinOverviewProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-yellow-400 transition-colors">
            <Star className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
            <p className="text-slate-400">{coin.symbol}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              coin.signal === 'buy' 
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {coin.signal.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
              {coin.stage}
            </span>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Add to Portfolio
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-slate-400 mb-1">Price</p>
          <p className="text-2xl font-bold text-white">${coin.price.toLocaleString()}</p>
          <p className={`flex items-center gap-1 text-sm ${
            coin.change > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {coin.change > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(coin.change)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Market Cap</p>
          <p className="text-2xl font-bold text-white">${coin.marketCap}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Volume (24h)</p>
          <p className="text-2xl font-bold text-white">${coin.volume}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Stage</p>
          <p className="text-2xl font-bold text-white">{coin.stage}</p>
        </div>
      </div>
    </div>
  );
}
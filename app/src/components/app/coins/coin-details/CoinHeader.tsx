import React from 'react';
import { Star, TrendingUp } from 'lucide-react';

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
  return (
    <div className="bg-[#151C2C] rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
            <Star className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
              <span className="text-sm text-slate-400">{coin.symbol}</span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400">
                Grade {coin.grade}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-400">
                {coin.signal}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-400">
                {coin.stage}
              </span>
            </div>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-sm font-medium text-white rounded-lg hover:bg-blue-600 transition-colors">
          Add to Portfolio
        </button>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">
          ${coin.price.toLocaleString()}
        </span>
        <div className={`flex items-center text-sm font-medium ${
          coin.change >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {coin.change >= 0 ? '+' : ''}{coin.change}%
        </div>
      </div>
    </div>
  );
}
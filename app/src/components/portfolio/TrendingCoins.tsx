import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TrendingCoins: React.FC = () => {
  const trendingCoins = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 65432.10,
      change: 2.4,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3456.78,
      change: -1.2,
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      price: 123.45,
      change: 5.6,
    },
  ];

  return (
    <div className="space-y-4">
      {trendingCoins.map((coin) => (
        <div
          key={coin.symbol}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
        >
          <div className="flex items-center">
            <img
              src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${coin.symbol.toLowerCase()}.png`}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/generic.png';
              }}
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-slate-900">{coin.name}</div>
              <div className="text-sm text-slate-500">{coin.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-900">
              ${coin.price.toLocaleString()}
            </div>
            <div
              className={`flex items-center justify-end ${
                coin.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {coin.change >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(coin.change)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingCoins;
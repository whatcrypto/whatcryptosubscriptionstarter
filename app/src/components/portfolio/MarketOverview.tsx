import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MarketOverview: React.FC = () => {
  const stats = [
    {
      label: 'Market Cap',
      value: '$2.1T',
      change: 2.4,
    },
    {
      label: '24h Volume',
      value: '$84.5B',
      change: -1.2,
    },
    {
      label: 'BTC Dominance',
      value: '46.2%',
      change: 0.8,
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-2">
          <div className="text-sm text-slate-500">{stat.label}</div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-900">{stat.value}</span>
            <div
              className={`flex items-center ${
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(stat.change)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketOverview;
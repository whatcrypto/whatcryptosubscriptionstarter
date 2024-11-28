import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export function PortfolioHistory() {
  const updates = [
    {
      date: '2024-03-15',
      type: 'rebalance',
      description: 'Monthly portfolio rebalancing',
      changes: [
        'Increased BTC allocation to 45%',
        'Reduced ETH exposure to 35%',
      ],
    },
    {
      date: '2024-03-01',
      type: 'signal',
      description: 'Signal changes',
      changes: [
        'BTC signal changed to BUY',
        'ADA entered accumulation phase',
      ],
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Portfolio History</h2>
      
      <div className="space-y-6">
        {updates.map((update, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              {update.type === 'rebalance' ? (
                <TrendingUp className="w-5 h-5 text-blue-400" />
              ) : (
                <Calendar className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-white">{update.description}</h3>
                <span className="text-sm text-slate-400">{update.date}</span>
              </div>
              <ul className="space-y-1">
                {update.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="text-sm text-slate-300">
                    • {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
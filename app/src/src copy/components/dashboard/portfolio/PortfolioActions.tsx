import React from 'react';
import { ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react';

export function PortfolioActions() {
  const actions = [
    {
      type: 'buy',
      asset: 'Bitcoin (BTC)',
      reason: 'Strong accumulation signals',
      impact: 'High',
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      type: 'rebalance',
      asset: 'Ethereum (ETH)',
      reason: 'Above target allocation',
      impact: 'Medium',
      icon: AlertTriangle,
      color: 'yellow',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Suggested Actions</h2>
      
      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.asset}
              className={`p-4 bg-${action.color}-500/10 rounded-lg`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 text-${action.color}-400 mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{action.asset}</h3>
                    <span className={`text-xs text-${action.color}-400`}>
                      {action.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{action.reason}</p>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                {action.type === 'buy' ? 'Buy Now' : 'Rebalance'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
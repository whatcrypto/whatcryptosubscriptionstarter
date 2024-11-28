import React from 'react';
import { TrendingUp, AlertTriangle, BarChart2, Target } from 'lucide-react';

export function PortfolioMetrics() {
  const metrics = [
    {
      label: 'Volatility',
      value: '0.85',
      description: 'Lower than market average',
      icon: BarChart2,
      color: 'blue',
    },
    {
      label: 'Sharpe Ratio',
      value: '2.1',
      description: 'Good risk-adjusted returns',
      icon: Target,
      color: 'emerald',
    },
    {
      label: 'Max Drawdown',
      value: '-28%',
      description: 'Past 12 months',
      icon: TrendingUp,
      color: 'yellow',
    },
    {
      label: 'Risk Score',
      value: '7.2',
      description: 'Moderate to High',
      icon: AlertTriangle,
      color: 'red',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Portfolio Metrics</h2>
      
      <div className="space-y-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="flex items-start gap-4">
              <div className={`w-10 h-10 bg-${metric.color}-500/20 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${metric.color}-400`} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="text-lg font-semibold text-white">{metric.value}</p>
                </div>
                <p className="text-sm text-slate-400">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
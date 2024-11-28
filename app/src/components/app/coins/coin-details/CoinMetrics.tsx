import React from 'react';
import { TrendingUp, AlertTriangle, BarChart2, Target } from 'lucide-react';

interface CoinMetricsProps {
  coin: {
    metrics: {
      volatility: string;
      momentum: number;
      phase: string;
      nextSupport: number;
    };
  };
}

export function CoinMetrics({ coin }: CoinMetricsProps) {
  const metrics = [
    {
      label: 'Volatility',
      value: coin.metrics.volatility,
      description: 'Current market volatility level',
      icon: BarChart2,
      color: 'blue',
    },
    {
      label: 'Momentum',
      value: `${coin.metrics.momentum > 0 ? '+' : ''}${coin.metrics.momentum}`,
      description: 'Price momentum indicator',
      icon: TrendingUp,
      color: coin.metrics.momentum > 0 ? 'emerald' : 'red',
    },
    {
      label: 'Market Phase',
      value: coin.metrics.phase,
      description: 'Current market cycle phase',
      icon: AlertTriangle,
      color: 'purple',
    },
    {
      label: 'Next Support',
      value: `$${coin.metrics.nextSupport.toLocaleString()}`,
      description: 'Key support level',
      icon: Target,
      color: 'yellow',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Market Metrics</h2>
      
      <div className="flex flex-col gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 bg-${metric.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm text-slate-400">{metric.label}</p>
                    <p className={`text-lg font-semibold text-${metric.color}-400`}>{metric.value}</p>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{metric.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
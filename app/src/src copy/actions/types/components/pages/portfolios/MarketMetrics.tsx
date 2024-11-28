import React from 'react';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

export function MarketMetrics({ isDarkMode }: Props) {
  const metrics = [
    {
      label: 'Market Sentiment',
      value: '78',
      change: '+5.2%',
      description: 'Overall market sentiment score',
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Volatility Index',
      value: '42',
      change: '-2.8%',
      description: 'Market volatility indicator',
      icon: BarChart2,
      color: 'purple'
    },
    {
      label: 'Momentum Score',
      value: '85',
      change: '+3.4%',
      description: 'Market momentum indicator',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-[#151C2C]' : 'bg-white'} rounded-xl p-6`}>
      <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        Market Metrics
      </h2>
      
      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 bg-${metric.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm text-slate-400">{metric.label}</p>
                    <p className={`text-lg font-semibold text-${metric.color}-400`}>{metric.value}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-slate-400">{metric.description}</p>
                    <span className={`text-sm ${
                      metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowUpRight, PieChart, TrendingUp, AlertTriangle, Target, Info } from 'lucide-react';

export function PortfolioOverview() {
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  const portfolioStats = [
    {
      id: 'total-value',
      label: 'Total Value',
      value: '$24,500',
      change: '+5.2%',
      icon: PieChart,
      color: 'accent',
      details: 'Total portfolio value across all assets, including unrealized gains/losses.'
    },
    {
      id: 'daily-return',
      label: 'Daily Return',
      value: '$1,275',
      change: '+2.8%',
      icon: TrendingUp,
      color: 'success',
      details: '24-hour change in portfolio value based on current market prices.'
    },
    {
      id: 'risk-score',
      label: 'Risk Score',
      value: '7.2/10',
      change: 'Moderate',
      icon: AlertTriangle,
      color: 'warning',
      details: 'Calculated based on portfolio volatility, asset correlation, and market conditions. Higher score indicates higher risk.'
    },
    {
      id: 'goal-progress',
      label: 'Goal Progress',
      value: '82%',
      change: 'On Track',
      icon: Target,
      color: 'accent',
      details: 'Progress towards your set investment target of $30,000. Projected to reach goal by September 2024.'
    },
  ];

  const allocation = [
    { name: 'Bitcoin (BTC)', percentage: 45, color: 'bg-accent' },
    { name: 'Ethereum (ETH)', percentage: 35, color: 'bg-success' },
    { name: 'Others', percentage: 20, color: 'bg-warning' },
  ];

  return (
    <div className="bg-card rounded-xl p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-content">Portfolio Overview</h2>
          <button className="px-4 py-2 text-sm bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors">
            Rebalance
          </button>
        </div>
        <button className="w-full px-4 py-2 text-sm text-content-secondary hover:text-content transition-colors">
          View Detailed Analysis
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {portfolioStats.map((stat) => {
          const Icon = stat.icon;
          const isExpanded = expandedStat === stat.id;
          
          return (
            <div 
              key={stat.id}
              className="flex flex-col gap-4 p-4 bg-card-secondary rounded-lg cursor-pointer hover:bg-card-hover transition-colors"
              onClick={() => setExpandedStat(isExpanded ? null : stat.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-${stat.color}/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-content-secondary">{stat.label}</p>
                    <Info className="w-4 h-4 text-content-secondary" />
                  </div>
                  <p className="text-xl font-bold text-content">{stat.value}</p>
                  <p className={`text-sm text-${stat.color} flex items-center gap-1`}>
                    {stat.change.startsWith('+') && <ArrowUpRight className="w-4 h-4" />}
                    {stat.change}
                  </p>
                </div>
              </div>
              {isExpanded && (
                <div className="text-sm text-content-secondary border-t border-border pt-4">
                  {stat.details}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-content-secondary">Asset Allocation</h3>
          <p className="text-xs text-content-secondary">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2 h-4 rounded-full overflow-hidden">
          {allocation.map((asset) => (
            <div
              key={asset.name}
              className={`${asset.color}`}
              style={{ width: `${asset.percentage}%` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {allocation.map((asset) => (
            <div key={asset.name} className="flex items-center justify-between p-4 bg-card-secondary rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${asset.color}`} />
                <span className="text-content">{asset.name}</span>
              </div>
              <p className="text-content font-medium">{asset.percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
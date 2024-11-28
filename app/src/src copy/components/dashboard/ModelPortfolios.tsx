import React from 'react';
import { Briefcase, TrendingUp, Shield, Rocket, Plus } from 'lucide-react';
import { PortfolioCard } from './PortfolioCard';

interface ModelPortfoliosProps {
  onCreatePortfolio: () => void;
}

export function ModelPortfolios({ onCreatePortfolio }: ModelPortfoliosProps) {
  const portfolios = [
    {
      id: 'growth',
      name: 'Growth Portfolio',
      description: 'High-potential assets targeting maximum returns',
      performance: '+18.5%',
      risk: 'High',
      assets: 8,
      icon: Rocket,
      color: 'accent',
    },
    {
      id: 'balanced',
      name: 'Balanced Portfolio',
      description: 'Mix of stable and growth assets for steady returns',
      performance: '+12.3%',
      risk: 'Medium',
      assets: 6,
      icon: TrendingUp,
      color: 'accent',
    },
    {
      id: 'stable',
      name: 'Stable Portfolio',
      description: 'Focus on established cryptocurrencies with lower volatility',
      performance: '+8.7%',
      risk: 'Low',
      assets: 4,
      icon: Shield,
      color: 'accent',
    },
  ];

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-content">Model Portfolios</h2>
          <p className="text-sm text-content-secondary mt-1">Expert-curated investment strategies</p>
        </div>
        <button 
          onClick={onCreatePortfolio}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent-secondary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Custom Portfolio
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {portfolios.map((portfolio) => (
          <PortfolioCard key={portfolio.id} portfolio={portfolio} />
        ))}
      </div>
    </div>
  );
}
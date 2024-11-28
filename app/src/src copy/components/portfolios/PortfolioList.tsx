import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, TrendingUp, Shield, Search } from 'lucide-react';
import { PortfolioCard } from './PortfolioCard';

export function PortfolioList() {
  const navigate = useNavigate();
  
  const portfolios = [
    {
      id: 'growth',
      name: 'Growth Portfolio',
      description: 'High-potential assets targeting maximum returns',
      performance: {
        current: '+18.5%',
        threeMonth: '+32.4%',
        sixMonth: '+67.8%'
      },
      risk: 'High',
      assets: 8,
      icon: Rocket,
      color: 'accent',
      lastUpdated: '2024-03-15'
    },
    {
      id: 'balanced',
      name: 'Balanced Portfolio',
      description: 'Mix of stable and growth assets for steady returns',
      performance: {
        current: '+12.3%',
        threeMonth: '+24.6%',
        sixMonth: '+41.2%'
      },
      risk: 'Medium',
      assets: 6,
      icon: TrendingUp,
      color: 'accent',
      lastUpdated: '2024-03-15'
    },
    {
      id: 'stable',
      name: 'Stable Portfolio',
      description: 'Focus on established cryptocurrencies with lower volatility',
      performance: {
        current: '+8.7%',
        threeMonth: '+16.5%',
        sixMonth: '+28.9%'
      },
      risk: 'Low',
      assets: 4,
      icon: Shield,
      color: 'accent',
      lastUpdated: '2024-03-15'
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content">Model Portfolios</h1>
          <p className="text-content-secondary mt-1">Expert-curated investment strategies for every risk profile</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-secondary" />
            <input
              type="text"
              placeholder="Search portfolios"
              className="w-full bg-card text-content pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:border-accent"
            />
          </div>
          <button className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent-secondary transition-colors">
            Create Custom Portfolio
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            onClick={() => navigate(`/portfolios/${portfolio.id}`)}
            className="cursor-pointer"
          >
            <PortfolioCard portfolio={portfolio} />
          </div>
        ))}
      </div>
    </div>
  );
}
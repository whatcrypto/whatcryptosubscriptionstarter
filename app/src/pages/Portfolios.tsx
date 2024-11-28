import React, { useState } from 'react';
import { Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight, Filter, Search, Shield, Rocket, Sparkles, Zap, DollarSign, Wallet, Target, AlertTriangle } from 'lucide-react';
import CryptoTable from '../components/CryptoTable';
import { categorizedCoins } from '../data/categoryData';

interface Props {
  isDarkMode: boolean;
}

const Portfolios: React.FC<Props> = ({ isDarkMode }) => {
  const [activePortfolio, setActivePortfolio] = useState('growth');

  const portfolios = [
    {
      id: 'growth',
      name: 'Growth Portfolio',
      icon: Rocket,
      description: 'High-growth potential assets with strong fundamentals',
      performance: '+45.2%',
      risk: 'High',
      timeHorizon: '2-5 years'
    },
    {
      id: 'income',
      name: 'Income Portfolio',
      icon: DollarSign,
      description: 'Focus on staking and yield generation',
      performance: '+18.5%',
      risk: 'Medium',
      timeHorizon: '1-3 years'
    },
    {
      id: 'innovation',
      name: 'Innovation Portfolio',
      icon: Sparkles,
      description: 'Cutting-edge projects and new technologies',
      performance: '+62.8%',
      risk: 'Very High',
      timeHorizon: '3-7 years'
    },
    {
      id: 'balanced',
      name: 'Balanced Portfolio',
      icon: Shield,
      description: 'Mix of established and growth assets',
      performance: '+28.4%',
      risk: 'Medium',
      timeHorizon: '2-4 years'
    },
    {
      id: 'moonshots',
      name: 'Moonshots Portfolio',
      icon: Rocket,
      description: 'High-risk, high-reward opportunities',
      performance: '+156.7%',
      risk: 'Very High',
      timeHorizon: '1-3 years'
    }
  ];

  const getPortfolioCoins = (portfolioId: string) => {
    // Filter coins based on portfolio type
    switch (portfolioId) {
      case 'growth':
        return categorizedCoins.filter(coin => 
          coin.rating >= 4.0 && 
          coin.insights.devActivity.trend === 'up' &&
          coin.longTermPhase === 'Markup'
        ).slice(0, 10);
      case 'income':
        return categorizedCoins.filter(coin => 
          coin.category.includes('Staking') || 
          coin.category === 'DeFi'
        ).slice(0, 10);
      case 'innovation':
        return categorizedCoins.filter(coin => 
          coin.insights.devActivity.score >= 85 &&
          coin.insights.ecosystemGrowth.trend === 'up'
        ).slice(0, 10);
      case 'balanced':
        return categorizedCoins.filter(coin => 
          coin.rating >= 4.2 &&
          coin.grade === 'buy'
        ).slice(0, 10);
      case 'moonshots':
        return categorizedCoins.filter(coin => 
          coin.percentChange > 10 &&
          coin.insights.socialSentiment.trend === 'up'
        ).slice(0, 10);
      default:
        return categorizedCoins.slice(0, 10);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Investment Portfolios
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Curated portfolios optimized for different investment strategies
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-gray-400' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Search portfolios"
              className={`w-64 pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-slate-200 focus:ring-indigo-500'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          <button className={`p-2 rounded-lg ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'
          }`}>
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`} />
          </button>
        </div>
      </div>

      {/* Portfolio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <button
            key={portfolio.id}
            onClick={() => setActivePortfolio(portfolio.id)}
            className={`p-6 rounded-xl transition-all ${
              activePortfolio === portfolio.id
                ? isDarkMode
                  ? 'bg-indigo-900 ring-2 ring-indigo-500'
                  : 'bg-indigo-50 ring-2 ring-indigo-500'
                : isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  activePortfolio === portfolio.id
                    ? 'bg-indigo-500/20'
                    : isDarkMode
                    ? 'bg-gray-700'
                    : 'bg-slate-100'
                }`}>
                  <portfolio.icon className={`w-6 h-6 ${
                    activePortfolio === portfolio.id
                      ? 'text-indigo-400'
                      : isDarkMode
                      ? 'text-gray-400'
                      : 'text-slate-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h3 className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {portfolio.name}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {portfolio.risk} Risk · {portfolio.timeHorizon}
                  </p>
                </div>
              </div>
              <div className={`flex items-center ${
                portfolio.performance.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {portfolio.performance.startsWith('+') ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="font-medium">{portfolio.performance}</span>
              </div>
            </div>
            <p className={`mt-4 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
              {portfolio.description}
            </p>
          </button>
        ))}
      </div>

      {/* Active Portfolio Details */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {portfolios.find(p => p.id === activePortfolio)?.name} Assets
          </h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Copy Portfolio
          </button>
        </div>

        <CryptoTable 
          data={getPortfolioCoins(activePortfolio)}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Portfolios;
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Shield, AlertTriangle, Activity } from 'lucide-react';
import { categorizedCoins } from '../data/categoryData';
import CategoryBadge from '../components/CategoryBadge';
import PhaseIndicator from '../components/PhaseIndicator';

const PortfolioDetails: React.FC = () => {
  const { id } = useParams();

  // Define portfolios based on categorizedCoins data
  const portfolios = {
    'wc20': {
      name: 'WC20 Portfolio',
      description: 'Top 20 cryptocurrencies by WhatCrypto score',
      riskLevel: 'Medium',
      rebalancingPeriod: 'Monthly',
      strategy: 'Focus on established cryptocurrencies with strong fundamentals',
      coins: categorizedCoins.filter(coin => coin.rating >= 4.5).slice(0, 20)
    },
    'sector-leaders': {
      name: 'Sector Leaders Portfolio',
      description: 'Leading projects in their respective sectors',
      riskLevel: 'Medium',
      rebalancingPeriod: 'Quarterly',
      strategy: 'Diversified exposure to sector-leading cryptocurrencies',
      coins: categorizedCoins.filter(coin => coin.grade === 'buy' && coin.rating >= 4.0).slice(0, 20)
    },
    '100x': {
      name: '100x Portfolio',
      description: 'High-growth potential projects with strong fundamentals',
      riskLevel: 'High',
      rebalancingPeriod: 'Weekly',
      strategy: 'Focus on early-stage projects with significant upside potential',
      coins: categorizedCoins
        .filter(coin => 
          coin.shortTermPhase === 'Accumulation' && 
          coin.longTermPhase === 'Markup'
        ).slice(0, 20)
    },
    'moonshots': {
      name: 'Moonshots Portfolio',
      description: 'Early-stage projects with massive potential',
      riskLevel: 'Very High',
      rebalancingPeriod: 'Weekly',
      strategy: 'High-risk, high-reward opportunities in emerging projects',
      coins: categorizedCoins
        .filter(coin => coin.rating >= 3.5 && coin.percentChange > 5)
        .slice(0, 20)
    },
    'innovators': {
      name: 'Innovation Portfolio',
      description: 'Projects pushing technological boundaries',
      riskLevel: 'High',
      rebalancingPeriod: 'Monthly',
      strategy: 'Focus on projects with strong technical innovation',
      coins: categorizedCoins
        .filter(coin => coin.insights.devActivity.score >= 85)
        .slice(0, 20)
    },
    'income': {
      name: 'Income Portfolio',
      description: 'Best staking and yield opportunities',
      riskLevel: 'Medium',
      rebalancingPeriod: 'Quarterly',
      strategy: 'Focus on generating passive income through staking and yield',
      coins: categorizedCoins
        .filter(coin => coin.category === 'DeFi' || coin.category === 'Layer 1')
        .slice(0, 20)
    },
    'buyhold': {
      name: 'Buy & Hold Portfolio',
      description: 'Long-term investment opportunities',
      riskLevel: 'Medium-Low',
      rebalancingPeriod: 'Quarterly',
      strategy: 'Long-term value accumulation in established projects',
      coins: categorizedCoins
        .filter(coin => 
          coin.grade === 'buy' && 
          coin.longTermPhase === 'Accumulation'
        ).slice(0, 20)
    },
    'potential': {
      name: 'High Potential Portfolio',
      description: 'Projects showing strong growth signals',
      riskLevel: 'High',
      rebalancingPeriod: 'Monthly',
      strategy: 'Focus on projects with strong growth indicators',
      coins: categorizedCoins
        .filter(coin => 
          coin.insights.socialSentiment.trend === 'up' && 
          coin.insights.devActivity.trend === 'up'
        ).slice(0, 20)
    },
    'risk-reward': {
      name: 'High Risk/Reward Portfolio',
      description: 'Higher risk projects with potential for significant returns',
      riskLevel: 'Very High',
      rebalancingPeriod: 'Weekly',
      strategy: 'Aggressive growth strategy focusing on emerging opportunities',
      coins: categorizedCoins
        .filter(coin => coin.rating < 4.0 && coin.percentChange > 10)
        .slice(0, 20)
    }
  };

  const portfolio = portfolios[id as keyof typeof portfolios];

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Portfolio Not Found</h2>
        <p className="text-slate-400 mb-6">The portfolio you're looking for doesn't exist.</p>
        <Link 
          to="/portfolios" 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Portfolios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link 
            to="/portfolios" 
            className="inline-flex items-center text-slate-400 hover:text-slate-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolios
          </Link>
          <h1 className="text-2xl font-bold text-white">{portfolio.name}</h1>
          <p className="text-slate-400 mt-1">{portfolio.description}</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
          Copy Portfolio
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="bg-[#151C2C] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-slate-400">Risk Level</h3>
            </div>
            <p className="text-white">{portfolio.riskLevel}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-slate-400">Rebalancing</h3>
            </div>
            <p className="text-white">{portfolio.rebalancingPeriod}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-medium text-slate-400">Strategy</h3>
            </div>
            <p className="text-white text-sm">{portfolio.strategy}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Assets */}
      <div className="bg-[#151C2C] p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-white mb-6">Portfolio Assets</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Short Term</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Long Term</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {portfolio.coins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${coin.symbol.toLowerCase()}.png`}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/generic.png';
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{coin.name}</div>
                          <div className="text-sm text-slate-400">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">
                      {coin.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <CategoryBadge grade={coin.grade} color={coin.badgeColor} isDarkMode={true} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className={`flex items-center justify-end ${
                        coin.percentChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {coin.percentChange >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span>{Math.abs(coin.percentChange)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <PhaseIndicator phase={coin.shortTermPhase} isDarkMode={true} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <PhaseIndicator phase={coin.longTermPhase} isDarkMode={true} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        {(100 / portfolio.coins.length).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;
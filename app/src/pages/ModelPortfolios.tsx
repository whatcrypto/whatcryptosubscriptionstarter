import React, { useState } from 'react';
import { ArrowRight, TrendingUp, TrendingDown, Trophy, Shield, Rocket, Sparkles, Zap, DollarSign, Wallet, Target, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categorizedCoins } from '../data/categoryData';

const ModelPortfolios: React.FC = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState('wc20');

  const portfolios = [
    {
      id: 'wc20',
      name: 'WC20 Portfolio',
      icon: Trophy,
      description: 'Top 20 cryptocurrencies by WhatCrypto score',
      performance: '+32.5%',
      risk: 'Medium',
      timeHorizon: '1-3 years',
      allocation: categorizedCoins
        .filter(coin => coin.rating >= 4.5)
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: 'sector-leaders',
      name: 'Sector Leaders',
      icon: Shield,
      description: 'Leading projects in their respective sectors',
      performance: '+28.4%',
      risk: 'Medium',
      timeHorizon: '2-4 years',
      allocation: categorizedCoins
        .filter(coin => coin.grade === 'buy' && coin.rating >= 4.0)
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: '100x',
      name: '100x Portfolio',
      icon: Rocket,
      description: 'High-growth potential projects with strong fundamentals',
      performance: '+156.7%',
      risk: 'Very High',
      timeHorizon: '3-5 years',
      allocation: categorizedCoins
        .filter(coin => 
          coin.shortTermPhase === 'Accumulation' && 
          coin.longTermPhase === 'Markup'
        )
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: 'moonshots',
      name: 'Moonshots',
      icon: Sparkles,
      description: 'Early-stage projects with massive potential',
      performance: '+218.3%',
      risk: 'Extreme',
      timeHorizon: '2-5 years',
      allocation: categorizedCoins
        .filter(coin => 
          coin.rating >= 3.5 && 
          coin.percentChange > 5
        )
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: 'innovators',
      name: 'Innovation Portfolio',
      icon: Zap,
      description: 'Projects pushing technological boundaries',
      performance: '+84.6%',
      risk: 'High',
      timeHorizon: '3-7 years',
      allocation: categorizedCoins
        .filter(coin => coin.insights.devActivity.score >= 85)
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: 'income',
      name: 'Income Portfolio',
      icon: DollarSign,
      description: 'Best staking and yield opportunities',
      performance: '+42.1%',
      risk: 'Medium',
      timeHorizon: '1-3 years',
      allocation: categorizedCoins
        .filter(coin => coin.category === 'Income')
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: 'buyhold',
      name: 'Buy & Hold',
      icon: Wallet,
      description: 'Long-term investment opportunities',
      performance: '+67.8%',
      risk: 'Medium-Low',
      timeHorizon: '4+ years',
      allocation: categorizedCoins
        .filter(coin => 
          coin.grade === 'buy' && 
          coin.longTermPhase === 'Accumulation'
        )
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: 'potential',
      name: 'High Potential',
      icon: Target,
      description: 'Projects showing strong growth signals',
      performance: '+92.4%',
      risk: 'High',
      timeHorizon: '2-4 years',
      allocation: categorizedCoins
        .filter(coin => 
          coin.insights.socialSentiment.trend === 'up' && 
          coin.insights.devActivity.trend === 'up'
        )
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    },
    {
      id: 'risk-reward',
      name: 'High Risk/Reward',
      icon: AlertTriangle,
      description: 'Higher risk projects with potential for significant returns',
      performance: '+124.5%',
      risk: 'Very High',
      timeHorizon: '1-3 years',
      allocation: categorizedCoins
        .filter(coin => 
          coin.rating < 4.0 && 
          coin.percentChange > 10
        )
        .slice(0, 3)
        .map(coin => ({
          asset: coin.symbol,
          weight: coin.rating * 20,
          change: coin.percentChange
        }))
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Model Portfolios</h1>
          <p className="text-slate-400 mt-1">Pre-built portfolios based on different investment strategies</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
          Create Custom Portfolio
        </button>
      </div>

      <div className="space-y-4">
        {portfolios.map((portfolio) => {
          const Icon = portfolio.icon;
          const isSelected = selectedPortfolio === portfolio.id;
          
          return (
            <button
              key={portfolio.id}
              onClick={() => setSelectedPortfolio(portfolio.id)}
              className={`w-full p-6 rounded-lg transition-all ${
                isSelected 
                  ? 'bg-[#151C2C] ring-2 ring-blue-500'
                  : 'bg-[#151C2C] hover:bg-[#1A2235]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-500/20' : 'bg-slate-800'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isSelected ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{portfolio.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-400">{portfolio.risk} Risk</span>
                      <span className="text-sm text-slate-400">·</span>
                      <span className="text-sm text-slate-400">{portfolio.timeHorizon}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center ${
                  portfolio.performance.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {portfolio.performance.startsWith('+') ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="font-medium">{portfolio.performance}</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400 text-left">
                {portfolio.description}
              </p>

              {isSelected && (
                <div className="mt-6 space-y-4">
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    {portfolio.allocation.map((asset, index) => (
                      <div
                        key={asset.asset}
                        className={`h-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-purple-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${asset.weight}%`, float: 'left' }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {portfolio.allocation.map((asset) => (
                      <div key={asset.asset} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{asset.asset}</span>
                          <span className="text-slate-400">{Math.round(asset.weight)}%</span>
                        </div>
                        <div className={`flex items-center ${
                          asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {asset.change >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          <span>{Math.abs(asset.change)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/portfolio/${portfolio.id}`}
                    className="mt-4 w-full px-4 py-3 bg-slate-800 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    View Full Portfolio
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModelPortfolios;
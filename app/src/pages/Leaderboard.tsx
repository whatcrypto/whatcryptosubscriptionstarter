import React, { useState } from 'react';
import {
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Rocket,
  Trophy,
  Wallet,
  Shield,
  Target,
  Zap,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import CryptoTable from '../components/CryptoTable';
import { categorizedCoins } from '../data/categoryData';

const ModelPortfolliosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wc20');

  const categories = [
    {
      id: 'wc20',
      label: 'WC20',
      icon: Trophy,
      description: 'Top 20 cryptocurrencies by WhatCrypto score',
    },
    {
      id: 'sector-leaders',
      label: 'Sector Leaders',
      icon: Shield,
      description: 'Leading projects in their respective sectors',
    },
    {
      id: '100x',
      label: '100x Opportunities',
      icon: Rocket,
      description: 'High-growth potential projects with strong fundamentals',
    },
    {
      id: 'moonshots',
      label: 'Moonshots',
      icon: Sparkles,
      description: 'Early-stage projects with massive potential',
    },
    {
      id: 'innovators',
      label: 'Innovators',
      icon: Zap,
      description: 'Projects pushing technological boundaries',
    },
    {
      id: 'income',
      label: 'Income Generators',
      icon: DollarSign,
      description: 'Best staking and yield opportunities',
    },
    {
      id: 'buyhold',
      label: 'Buy & Hold',
      icon: Wallet,
      description: 'Long-term investment opportunities',
    },
    {
      id: 'potential',
      label: 'High Potential',
      icon: Target,
      description: 'Projects showing strong growth signals',
    },
    {
      id: 'risk-reward',
      label: 'High Risk/Reward',
      icon: AlertTriangle,
      description:
        'Higher risk projects with potential for significant returns',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-slate-400 mt-1">
          Detailed analysis and signals for top cryptocurrencies
        </p>
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === category.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-400 hover:bg-[#1A2235]'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="bg-[#151C2C] p-4 rounded-lg">
          <p className="text-sm text-slate-400">
            {categories.find((c) => c.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Coin Table */}
      <div className="bg-[#151C2C] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {categories.find((c) => c.id === activeTab)?.label}
          </h2>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0B1222] text-slate-400 border-slate-700 border">
              <option>Sort by WC Score</option>
              <option>Sort by Market Cap</option>
              <option>Sort by Growth Potential</option>
              <option>Sort by Risk Level</option>
            </select>
            <button className="p-2 rounded-lg hover:bg-[#1A2235] transition-colors">
              <Filter className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Premium Alert for certain categories */}
        {['100x', 'moonshots', 'potential'].includes(activeTab) && (
          <div className="mb-6 p-4 rounded-lg bg-[#1A2235]">
            <p className="text-sm text-slate-400">
              🔒 Unlock detailed analysis and real-time alerts for
              high-potential opportunities with WhatCrypto Premium
            </p>
          </div>
        )}

        <CryptoTable data={categorizedCoins} isDarkMode={true} />
      </div>
    </div>
  );
};

export default ModelPortfolliosPage;

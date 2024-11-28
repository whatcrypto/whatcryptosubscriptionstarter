import React from 'react';
import { TrendingUp, TrendingDown, Minus, Code, Users, Activity, Building2, Network } from 'lucide-react';
import type { MarketInsight } from '../data/mockData';

interface Props {
  insights: MarketInsight;
  isDarkMode?: boolean;
}

const CoinInsights: React.FC<Props> = ({ insights, isDarkMode }) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Developer Activity */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-indigo-500" />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Developer Activity
            </h3>
          </div>
          {getTrendIcon(insights.devActivity.trend)}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Active Developers
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {insights.devActivity.activeDevs}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Monthly Commits
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {insights.devActivity.commits}
            </span>
          </div>
        </div>
      </div>

      {/* Social Sentiment */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Social Sentiment
            </h3>
          </div>
          {getTrendIcon(insights.socialSentiment.trend)}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Mentions
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {formatNumber(insights.socialSentiment.mentions)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Sentiment
            </span>
            <span className={`font-medium capitalize ${
              insights.socialSentiment.sentiment === 'positive' ? 'text-green-500' :
              insights.socialSentiment.sentiment === 'negative' ? 'text-red-500' :
              'text-yellow-500'
            }`}>
              {insights.socialSentiment.sentiment}
            </span>
          </div>
        </div>
      </div>

      {/* Network Activity */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-indigo-500" />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Network Activity
            </h3>
          </div>
          {getTrendIcon(insights.walletActivity.trend)}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Active Wallets
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {formatNumber(insights.walletActivity.activeWallets)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Daily Transactions
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {formatNumber(insights.networkMetrics.transactionsPerDay)}
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Interest */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-indigo-500" />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Institutional Interest
            </h3>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Major Holders
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {insights.institutionalInterest.majorHolders}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Recent Investments
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {insights.institutionalInterest.recentInvestments}
            </span>
          </div>
        </div>
      </div>

      {/* Ecosystem Growth */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Ecosystem Growth
            </h3>
          </div>
          {getTrendIcon(insights.ecosystemGrowth.trend)}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Partnerships
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {insights.ecosystemGrowth.partnerships}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Integrations
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {insights.ecosystemGrowth.integrations}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinInsights;
import React from 'react';
import { Rocket, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

interface PortfolioHeaderProps {
  portfolio: {
    name: string;
    description: string;
    performance: {
      total: string;
      daily: string;
      weekly: string;
      monthly: string;
    };
    risk: string;
    lastUpdated: string;
  };
}

export function PortfolioHeader({ portfolio }: PortfolioHeaderProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{portfolio.name}</h1>
              <p className="text-slate-400">{portfolio.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              {portfolio.risk} Risk
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-4 h-4" />
              Updated {portfolio.lastUpdated}
            </div>
          </div>
        </div>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Follow Portfolio
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-slate-400 mb-1">Total Return</p>
          <p className="text-2xl font-bold text-emerald-400">{portfolio.performance.total}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Daily</p>
          <p className="text-2xl font-bold text-white">{portfolio.performance.daily}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Weekly</p>
          <p className="text-2xl font-bold text-white">{portfolio.performance.weekly}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Monthly</p>
          <p className="text-2xl font-bold text-white">{portfolio.performance.monthly}</p>
        </div>
      </div>
    </div>
  );
}
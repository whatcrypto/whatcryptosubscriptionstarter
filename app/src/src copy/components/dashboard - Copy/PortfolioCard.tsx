import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface PortfolioCardProps {
  portfolio: {
    id: string;
    name: string;
    description: string;
    performance: string;
    risk: string;
    assets: number;
    icon: LucideIcon;
    color: string;
  };
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const { icon: Icon, color, name, description, performance, risk, assets } = portfolio;

  return (
    <div className="bg-slate-700/50 rounded-lg p-6 hover:bg-slate-700/70 transition-colors cursor-pointer group">
      <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
      <p className="text-sm text-slate-300 mb-4">{description}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-slate-400">Return</p>
          <p className="text-lg font-semibold text-emerald-400">{performance}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Risk</p>
          <p className="text-lg font-semibold text-white">{risk}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Assets</p>
          <p className="text-lg font-semibold text-white">{assets}</p>
        </div>
      </div>

      <button className="w-full px-4 py-2 text-sm text-slate-300 hover:text-white flex items-center justify-center gap-2 group-hover:text-blue-400 transition-colors">
        View Portfolio
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
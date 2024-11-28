import React from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { PortfolioHeader } from './PortfolioHeader';
import { PortfolioComposition } from './PortfolioComposition';
import { PortfolioMetrics } from './PortfolioMetrics';
import { PortfolioActions } from './PortfolioActions';
import { PortfolioHistory } from './PortfolioHistory';

export function ModelPortfolioDetail() {
  const portfolio = {
    id: 'growth',
    name: 'Growth Portfolio',
    description: 'High-potential assets targeting maximum returns',
    performance: {
      total: '+18.5%',
      daily: '+2.3%',
      weekly: '+8.7%',
      monthly: '+15.2%',
    },
    risk: 'High',
    assets: 8,
    value: 24500,
    lastUpdated: '2024-03-15',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Portfolios
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>
      </div>

      <PortfolioHeader portfolio={portfolio} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PortfolioComposition />
          <PortfolioHistory />
        </div>
        <div className="space-y-8">
          <PortfolioMetrics />
          <PortfolioActions />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { ArrowRight, LucideIcon, Calendar, TrendingUp } from 'lucide-react';

interface PortfolioCardProps {
  portfolio: {
    id: string;
    name: string;
    description: string;
    performance: {
      current: string;
      threeMonth: string;
      sixMonth: string;
    };
    risk: string;
    assets: number;
    icon: LucideIcon;
    color: string;
    lastUpdated: string;
  };
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const { icon: Icon, color, name, description, performance, risk, assets, lastUpdated } = portfolio;

  return (
    <div className="bg-card rounded-lg p-6 hover:bg-card-hover transition-colors">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-content">{name}</h3>
            <p className="text-sm text-content-secondary mt-1">{description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-4 bg-card-secondary rounded-lg">
            <p className="text-sm text-content-secondary">Current Performance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-semibold text-success">{performance.current}</p>
              <div className="flex flex-col text-xs">
                <span className="text-content-secondary">3M: {performance.threeMonth}</span>
                <span className="text-content-secondary">6M: {performance.sixMonth}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card-secondary rounded-lg">
              <p className="text-sm text-content-secondary">Risk Level</p>
              <p className="text-lg font-semibold text-content mt-1">{risk}</p>
            </div>
            <div className="p-4 bg-card-secondary rounded-lg">
              <p className="text-sm text-content-secondary">Assets</p>
              <p className="text-lg font-semibold text-content mt-1">{assets}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-content-secondary">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Last updated: {lastUpdated}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Daily rebalanced
            </div>
          </div>
          
          <button className="w-full px-4 py-3 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors flex items-center justify-center gap-2">
            View Portfolio Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
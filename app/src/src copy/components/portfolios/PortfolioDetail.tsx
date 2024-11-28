import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PortfolioHeader } from '../dashboard/portfolio/PortfolioHeader';
import { PortfolioComposition } from '../dashboard/portfolio/PortfolioComposition';
import { PortfolioMetrics } from '../dashboard/portfolio/PortfolioMetrics';
import { PortfolioActions } from '../dashboard/portfolio/PortfolioActions';
import { PortfolioHistory } from '../dashboard/portfolio/PortfolioHistory';

export function PortfolioDetail() {
  const { id } = useParams();

  const portfolio = {
    id,
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
    <div className="flex flex-col gap-8">
      <Link 
        to="/portfolios"
        className="inline-flex items-center gap-2 text-content-secondary hover:text-content transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Portfolios
      </Link>

      <PortfolioHeader portfolio={portfolio} />
      <PortfolioComposition />
      <PortfolioMetrics />
      <PortfolioActions />
      <PortfolioHistory />
    </div>
  );
}
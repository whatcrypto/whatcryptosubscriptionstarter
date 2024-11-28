import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';

interface CoinPortfoliosProps {
  coin: {
    portfolios: string[];
  };
}

export function CoinPortfolios({ coin }: CoinPortfoliosProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Featured In Portfolios</h2>
      
      <div className="space-y-4">
        {coin.portfolios.map((portfolio) => (
          <Link
            key={portfolio}
            to={`/portfolios/${portfolio.toLowerCase()}`}
            className="block p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{portfolio} Portfolio</h3>
                  <p className="text-sm text-slate-400">View allocation details</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
        View All Portfolios
      </button>
    </div>
  );
}
import React from 'react';
import { ChevronRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
        Make Smarter Crypto Investment Decisions
      </h1>
      <p className="text-lg lg:text-xl text-slate-300 mb-12">
        Access professional model portfolios and in-depth coin analysis to build your crypto investment strategy with confidence.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          Explore Portfolios
          <ChevronRight className="w-5 h-5" />
        </button>
        <button className="border border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg font-medium transition-colors">
          View Coin Analysis
        </button>
      </div>
    </div>
  );
}
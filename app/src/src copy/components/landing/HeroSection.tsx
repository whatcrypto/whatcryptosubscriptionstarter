import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const stats = [
    { value: '24', label: 'Active Signals' },
    { value: '8', label: 'Buy Signals Today' },
    { value: '+31.2%', label: 'Avg. Signal Gain' },
    { value: '82%', label: 'Win Rate' },
  ];

  return (
    <div className="flex flex-col gap-8 py-16 px-4">
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Simplified Crypto Investing: Model Portfolios and Expert Insights
        </h1>
        <p className="text-lg text-slate-300">
          Follow curated portfolios and get actionable buy/sell signals without the noise.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/portfolios"
          className="w-full px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          View Model Portfolios
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-slate-800 rounded-lg text-center">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
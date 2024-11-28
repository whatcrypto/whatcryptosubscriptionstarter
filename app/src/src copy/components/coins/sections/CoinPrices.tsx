import React from 'react';
import { ArrowUpRight, ArrowDownRight, Target, AlertTriangle, HelpCircle } from 'lucide-react';

interface CoinPricesProps {
  coin: {
    prices: {
      current: number;
      entry: number;
      target: number;
      nextEntry: number;
      stopLoss: number;
    };
  };
}

interface TooltipProps {
  content: string;
}

function Tooltip({ content }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-400 transition-colors cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
}

export function CoinPrices({ coin }: CoinPricesProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Key Price Levels</h2>
      
      <div className="grid gap-4">
        <div className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-400">Entry Price</p>
                <Tooltip content="Recommended price point to enter or add to your position" />
              </div>
              <p className="text-xl font-semibold text-white mt-1">
                ${coin.prices.entry.toLocaleString()}
              </p>
            </div>
            <ArrowDownRight className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 bg-emerald-500/5 rounded-lg hover:bg-emerald-500/10 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-400">Target Price</p>
                <Tooltip content="Projected price target for taking profits" />
              </div>
              <p className="text-2xl font-semibold text-emerald-400 mt-1">
                ${coin.prices.target.toLocaleString()}
              </p>
            </div>
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 bg-blue-500/5 rounded-lg hover:bg-blue-500/10 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-400">Next Entry Zone</p>
                <Tooltip content="Optimal price level for your next purchase" />
              </div>
              <p className="text-xl font-semibold text-blue-400 mt-1">
                ${coin.prices.nextEntry.toLocaleString()}
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="p-4 bg-red-500/5 rounded-lg hover:bg-red-500/10 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-400">Stop Loss</p>
                <Tooltip content="Recommended exit point to minimize potential losses" />
              </div>
              <p className="text-xl font-semibold text-red-400 mt-1">
                ${coin.prices.stopLoss.toLocaleString()}
              </p>
            </div>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
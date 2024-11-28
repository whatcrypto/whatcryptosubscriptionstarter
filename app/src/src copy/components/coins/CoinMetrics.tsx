import React from 'react';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

interface CoinMetricsProps {
  coin: {
    metrics: {
      rsi: number;
      macd: string;
      ma: string;
    };
  };
}

export function CoinMetrics({ coin }: CoinMetricsProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Technical Metrics</h2>
      
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">RSI (14)</p>
            <p className="text-lg font-semibold text-white">{coin.metrics.rsi}</p>
            <p className="text-sm text-slate-400">
              {coin.metrics.rsi > 70 ? 'Overbought' : coin.metrics.rsi < 30 ? 'Oversold' : 'Neutral'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">MACD</p>
            <p className="text-lg font-semibold text-white">{coin.metrics.macd}</p>
            <p className="text-sm text-slate-400">Signal Line Cross</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Moving Average</p>
            <p className="text-lg font-semibold text-white">{coin.metrics.ma}</p>
            <p className="text-sm text-slate-400">200-day trend</p>
          </div>
        </div>
      </div>
    </div>
  );
}
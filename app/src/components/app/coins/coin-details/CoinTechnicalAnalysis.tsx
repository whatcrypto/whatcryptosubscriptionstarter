import React from 'react';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

interface CoinTechnicalAnalysisProps {
  trend: string;
  rsi: number;
  accumulation: string;
  macd: string;
  movingAverage: string;
}

export function CoinTechnicalAnalysis({ trend, rsi, accumulation, macd, movingAverage }: CoinTechnicalAnalysisProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Trend</p>
            <p className="text-lg font-semibold text-white">{trend}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">MACD</p>
          <p className="text-emerald-400">{macd}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">RSI</p>
            <p className="text-lg font-semibold text-white">{rsi}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Moving Average</p>
          <p className="text-emerald-400">{movingAverage}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Accumulation</p>
            <p className="text-lg font-semibold text-white">{accumulation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
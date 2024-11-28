import React from 'react';
import { TrendingUp, Activity, BarChart2, Code, Users } from 'lucide-react';

interface CoinAnalysisProps {
  coin: {
    analysis: {
      technical: {
        trend: string;
        macd: string;
        rsi: number;
        movingAverage: string;
        accumulation: string;
      };
      fundamental: {
        networkGrowth: string;
        developerActivity: string;
        institutionalInterest: string;
      };
    };
  };
}

export function CoinAnalysis({ coin }: CoinAnalysisProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Analysis</h2>
      
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-4">Technical Analysis</h3>
          <div className="grid gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Trend</p>
                    <p className="text-lg font-semibold text-white">{coin.analysis.technical.trend}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400">MACD</p>
                  <p className="text-right text-emerald-400">{coin.analysis.technical.macd}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">RSI</p>
                    <p className="text-lg font-semibold text-white">{coin.analysis.technical.rsi}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Moving Average</p>
                  <p className="text-right text-emerald-400">{coin.analysis.technical.movingAverage}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Accumulation</p>
                    <p className="text-lg font-semibold text-white">{coin.analysis.technical.accumulation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-4">Fundamental Analysis</h3>
          <div className="grid gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Network Growth</p>
                    <p className="text-lg font-semibold text-white">{coin.analysis.fundamental.networkGrowth}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Developer Activity</p>
                    <p className="text-lg font-semibold text-white">{coin.analysis.fundamental.developerActivity}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Institutional Interest</p>
                    <p className="text-lg font-semibold text-white">{coin.analysis.fundamental.institutionalInterest}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
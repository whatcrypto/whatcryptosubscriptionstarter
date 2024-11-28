import React from 'react';
import { Activity, Code, Users } from 'lucide-react';

interface CoinFundamentalAnalysisProps {
  networkGrowth: string;
  developerActivity: string;
  institutionalInterest: string;
}

export function CoinFundamentalAnalysis({ 
  networkGrowth, 
  developerActivity, 
  institutionalInterest 
}: CoinFundamentalAnalysisProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Network Growth</p>
            <p className="text-lg font-semibold text-white">{networkGrowth}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Developer Activity</p>
            <p className="text-lg font-semibold text-white">{developerActivity}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Institutional Interest</p>
            <p className="text-lg font-semibold text-white">{institutionalInterest}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
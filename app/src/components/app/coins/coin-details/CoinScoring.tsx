import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface Score {
  score: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  [key: string]: any;
}

interface Props {
  scores: {
    developerActivity: Score;
    socialSentiment: Score;
    walletActivity: Score;
    networkMetrics: Score;
    institutionalInterest: Score;
    ecosystemGrowth: Score;
    liquidityDepth: Score;
    protocolHealth: Score;
  };
}

const tooltips = {
  developerActivity: "High developer activity indicates project growth and innovation. Score considers commits, active developers, and repositories.",
  socialSentiment: "Social sentiment reflects market perception and potential price movements. Based on mentions, engagement, and sentiment analysis.",
  walletActivity: "Wallet activity shows adoption and usage. Tracks active wallets, new wallets, and transaction patterns.",
  networkMetrics: "Network health indicators including validators, transactions, and growth metrics.",
  institutionalInterest: "Measures institutional adoption through major holders and investments.",
  ecosystemGrowth: "Tracks ecosystem expansion through partnerships, integrations, and new projects.",
  liquidityDepth: "Assesses trading volume, market depth, and price stability.",
  protocolHealth: "Evaluates protocol security, decentralization, and reliability."
};

export function CoinScoring({ scores }: Props) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatMetricName = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="bg-[#151C2C] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Scoring Metrics</h2>
      
      <div className="grid gap-4">
        {Object.entries(scores).map(([key, data]) => (
          <div key={key} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Info className="h-4 w-4 text-slate-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#0B1222] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 w-64">
                    {tooltips[key as keyof typeof tooltips]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#0B1222]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium capitalize">
                    {formatMetricName(key)}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                      {data.score}
                    </span>
                    {getTrendIcon(data.trend)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">
                  {Object.entries(data)
                    .filter(([k]) => !['score', 'trend', 'description'].includes(k))
                    .map(([k, v]) => (
                      <div key={k} className="capitalize">
                        {formatMetricName(k)}: {' '}
                        <span className="text-white">{typeof v === 'number' ? v.toLocaleString() : v}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';

import {
  AlertCircle,
  ArrowRight,
  Shield,
  TrendingUp,
} from 'lucide-react';

const Actions: React.FC = () => {
  // These would be managed through a CMS or admin panel in a real app
  const currentActions = [
    {
      type: 'high',
      title: 'Accumulate Layer 1s',
      description: 'BTC and ETH consolidation suggests capital flow into Layer 1s. Focus on SOL, AVAX, and ADA.',
      timing: 'Next 2-3 weeks',
      risk: 'Medium'
    },
    {
      type: 'medium',
      title: 'Scale into Layer 2s',
      description: 'Layer 2 tokens showing strength. Consider positions in MATIC, ARB, and OP.',
      timing: 'Next 1-2 weeks',
      risk: 'Medium-High'
    },
    {
      type: 'low',
      title: 'Avoid Small Caps',
      description: 'Current market cycle suggests avoiding small cap alts. Wait for better conditions.',
      timing: 'Until further notice',
      risk: 'High'
    }
  ];

  const getActionColor = (type: string) => {
    switch (type) {
      case 'high':
        return 'bg-green-500/10 text-green-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'low':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-blue-500/10 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Current Actions</h1>
        <p className="text-slate-400 mt-1">Priority actions based on market conditions</p>
      </div>

      <div className="grid gap-4">
        {currentActions.map((action, index) => (
          <div key={index} className="bg-[#151C2C] rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getActionColor(action.type)}`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getActionColor(action.type)}`}>
                      {action.timing}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-400">{action.description}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Risk: {action.risk}</span>
                  </div>
                </div>
              </div>

              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#151C2C] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Market Context</h2>
        </div>
        <p className="text-slate-400">
          BTC and ETH are in consolidation phase, suggesting capital rotation into Layer 1s and Layer 2s. 
          Small cap alts remain risky until market shows clear direction. Focus on quality projects with 
          strong fundamentals and avoid chasing short-term pumps.
        </p>
      </div>
    </div>
  );
};

export default Actions;
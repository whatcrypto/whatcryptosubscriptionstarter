import React from 'react';
import { ArrowRight, Rocket, Target, Shield } from 'lucide-react';

interface CoinActionsProps {
  coin: {
    signal: string;
    prices: {
      current: number;
      entry: number;
      target: number;
    };
    investorProfiles: {
      aggressive: {
        action: string;
        allocation: number;
        strategy: string;
      };
      moderate: {
        action: string;
        allocation: number;
        strategy: string;
      };
      conservative: {
        action: string;
        allocation: number;
        strategy: string;
      };
    };
  };
}

function AllocationBadge({ allocation }: { allocation: number }) {
  let bgColor = '';
  let textColor = '';

  if (allocation > 25) {
    bgColor = 'bg-yellow-500/20';
    textColor = 'text-yellow-400';
  } else if (allocation >= 10 && allocation <= 20) {
    bgColor = 'bg-slate-400/20';
    textColor = 'text-slate-400';
  } else if (allocation > 20) {
    bgColor = 'bg-slate-800';
    textColor = 'text-white';
  } else {
    bgColor = 'bg-slate-800';
    textColor = 'text-slate-400';
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {allocation}% Allocation
    </span>
  );
}

export function CoinActions({ coin }: CoinActionsProps) {
  const profiles = [
    {
      type: 'aggressive',
      title: 'Aggressive',
      icon: Rocket,
      color: 'blue',
      data: coin.investorProfiles.aggressive
    },
    {
      type: 'moderate',
      title: 'Moderate',
      icon: Target,
      color: 'purple',
      data: coin.investorProfiles.moderate
    },
    {
      type: 'conservative',
      title: 'Conservative',
      icon: Shield,
      color: 'emerald',
      data: coin.investorProfiles.conservative
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Investment Strategies</h2>
      
      <div className="flex flex-col gap-4">
        {profiles.map((profile) => {
          const Icon = profile.icon;
          const actionColor = profile.data.action === 'Buy' ? 'emerald' : 'yellow';
          
          return (
            <div
              key={profile.type}
              className={`p-4 bg-${profile.color}-500/10 rounded-lg`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${profile.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${profile.color}-400`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{profile.title} Investor</h3>
                        <AllocationBadge allocation={profile.data.allocation} />
                      </div>
                      <span className={`inline-block px-2 py-1 text-sm rounded-lg bg-${actionColor}-500/20 text-${actionColor}-400 mt-2`}>
                        {profile.data.action}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300">{profile.data.strategy}</p>

                <button className="w-full px-4 py-3 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                  View {profile.title} Portfolio
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
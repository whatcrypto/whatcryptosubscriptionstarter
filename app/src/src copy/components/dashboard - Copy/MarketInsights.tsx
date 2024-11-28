import React, { useState } from 'react';
import { Code, Users, Wallet, Activity, Zap, Network, MessageCircle, Building, Lock, Blocks } from 'lucide-react';

export function MarketInsights() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const insights = [
    {
      id: 'developer',
      type: 'activity',
      icon: Code,
      title: 'Developer Activity Surge',
      description: 'DOT ecosystem development spikes',
      details: 'GitHub commits up 47% MoM. 12 new parachains in development. Core protocol improvements accelerating. Historical correlation suggests price appreciation follows development spikes.',
      action: 'View Developer Stats',
      color: 'accent',
    },
    {
      id: 'institutional',
      type: 'investment',
      icon: Building,
      title: 'Institutional Accumulation',
      description: 'Large firms increasing positions',
      details: 'Three major investment firms added $450M in BTC last week. OTC desk volume up 85%. Institutional-grade custody solutions seeing increased demand.',
      action: 'Track Big Money',
      color: 'success',
    },
    {
      id: 'innovation',
      type: 'technology',
      icon: Zap,
      title: 'Protocol Innovation',
      description: 'New scaling solution breakthrough',
      details: 'Novel ZK-rollup implementation shows 10x throughput improvement. Major L2s planning integration. Potential market impact within 3 months.',
      action: 'Research Tech',
      color: 'warning',
    },
    {
      id: 'network',
      type: 'growth',
      icon: Network,
      title: 'Network Expansion',
      description: 'SOL ecosystem growing rapidly',
      details: 'Daily active addresses up 85% WoW. New dApp launches doubled. Transaction count at ATH. Strong organic growth across all metrics.',
      action: 'View Network Data',
      color: 'accent',
    },
    {
      id: 'staking',
      type: 'validators',
      icon: Lock,
      title: 'Staking Participation',
      description: 'ETH staking ratio hits new high',
      details: 'Total ETH staked reaches 25% of supply. Validator count up 15%. Staking yields stabilizing at 4.8%. Reduced selling pressure expected.',
      action: 'View Staking Stats',
      color: 'success',
    },
    {
      id: 'ecosystem',
      type: 'integration',
      icon: Blocks,
      title: 'Ecosystem Integration',
      description: 'Major partnership announced',
      details: 'Fortune 500 company integrating LINK oracles. Similar integrations historically led to 30%+ price appreciation. Enterprise adoption accelerating.',
      action: 'Track Partnerships',
      color: 'warning',
    },
  ];

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-content mb-6">Investment Opportunities</h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const isExpanded = expandedSection === insight.id;

          return (
            <div
              key={insight.id}
              className="flex flex-col bg-card-secondary rounded-lg overflow-hidden"
            >
              <div 
                className="flex items-start gap-3 p-4 cursor-pointer hover:bg-card-hover transition-colors"
                onClick={() => setExpandedSection(isExpanded ? null : insight.id)}
              >
                <div className={`w-10 h-10 bg-${insight.color}/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${insight.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-content">{insight.title}</h3>
                      <p className="text-sm text-content-secondary mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-border">
                  <p className="text-sm text-content-secondary mb-4">{insight.details}</p>
                  <button className={`w-full px-4 py-2 bg-${insight.color}/20 text-${insight.color} rounded-lg hover:bg-${insight.color}/30 transition-colors text-sm`}>
                    {insight.action}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
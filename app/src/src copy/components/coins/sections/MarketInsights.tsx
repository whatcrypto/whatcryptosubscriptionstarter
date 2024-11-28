import React from 'react';
import { Code, Users, Wallet, Activity, Zap } from 'lucide-react';

interface MarketInsightsProps {
  insights: {
    developer: {
      activity: string;
      commits: string;
      contributors: string;
      repositories: string;
      description: string;
    };
    social: {
      sentiment: string;
      mentions: string;
      engagement: string;
      trending: boolean;
      description: string;
    };
    network: {
      growth: string;
      transactions: string;
      activeAddresses: string;
      newWallets: string;
      description: string;
    };
    institutional: {
      interest: string;
      holdings: string;
      entities: string;
      description: string;
    };
    innovation: {
      score: string;
      updates: string;
      partnerships: string;
      description: string;
    };
  };
}

export function MarketInsights({ insights }: MarketInsightsProps) {
  const metrics = [
    {
      title: 'Developer Activity',
      icon: Code,
      color: 'accent',
      primary: insights.developer.activity,
      secondary: insights.developer.commits,
      detail: insights.developer.contributors,
      description: insights.developer.description,
    },
    {
      title: 'Social Sentiment',
      icon: Users,
      color: 'success',
      primary: insights.social.sentiment,
      secondary: insights.social.mentions,
      detail: insights.social.engagement,
      description: insights.social.description,
    },
    {
      title: 'Network Growth',
      icon: Activity,
      color: 'warning',
      primary: insights.network.growth,
      secondary: insights.network.transactions,
      detail: insights.network.activeAddresses,
      description: insights.network.description,
    },
    {
      title: 'Institutional Interest',
      icon: Wallet,
      color: 'accent',
      primary: insights.institutional.interest,
      secondary: insights.institutional.holdings,
      detail: insights.institutional.entities,
      description: insights.institutional.description,
    },
    {
      title: 'Innovation Score',
      icon: Zap,
      color: 'success',
      primary: insights.innovation.score,
      secondary: insights.innovation.updates,
      detail: insights.innovation.partnerships,
      description: insights.innovation.description,
    },
  ];

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-lg font-semibold text-content mb-6">Market Insights</h2>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="p-4 bg-card-secondary rounded-lg hover:bg-card-hover transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-${metric.color}/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${metric.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-content">{metric.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-${metric.color} font-semibold`}>{metric.primary}</span>
                    <span className="text-sm text-content-secondary">{metric.secondary}</span>
                  </div>
                  <p className="text-sm text-content-secondary mt-2">{metric.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
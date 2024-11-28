import React from 'react';
import { Briefcase, Target, Bell } from 'lucide-react';

export function FeatureList() {
  const features = [
    {
      icon: Briefcase,
      title: 'Model Portfolios',
      description: 'Follow expert-created portfolios designed to maximize growth, stability, or high-risk rewards',
    },
    {
      icon: Target,
      title: 'Buy/Sell Signals',
      description: 'Stay ahead with clear buy, hold, and sell signals for each asset in your portfolio',
    },
    {
      icon: Bell,
      title: 'Personalized Alerts',
      description: 'Receive timely alerts for assets and portfolios you follow, never miss an opportunity',
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-16 px-4 bg-card">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-content mb-2">
          Everything you need to invest with confidence
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div 
              key={feature.title}
              className="flex flex-col gap-4 p-6 bg-card-secondary rounded-lg"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-content mb-2">
                  {feature.title}
                </h3>
                <p className="text-content-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
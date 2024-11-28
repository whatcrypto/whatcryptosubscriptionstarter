import React from 'react';
import { BarChart3, Lightbulb, Wallet } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function Features() {
  const features = [
    {
      icon: BarChart3,
      title: 'Model Portfolios',
      description: 'Follow professionally curated portfolios designed for different investment strategies and risk profiles.',
      iconColor: 'text-blue-400',
      iconBgColor: 'bg-blue-500/20',
    },
    {
      icon: Lightbulb,
      title: 'Coin Analysis',
      description: 'Get detailed insights into each coin\'s lifecycle stage, market position, and investment signals.',
      iconColor: 'text-purple-400',
      iconBgColor: 'bg-purple-500/20',
    },
    {
      icon: Wallet,
      title: 'Custom Portfolios',
      description: 'Build your own portfolio using our curated selection of cryptocurrencies and expert insights.',
      iconColor: 'text-green-400',
      iconBgColor: 'bg-green-500/20',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  );
}
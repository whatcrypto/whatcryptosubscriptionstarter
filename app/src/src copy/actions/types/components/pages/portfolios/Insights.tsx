'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Lock, Code, Users, Activity, Building2, Network } from 'lucide-react';
import { MarketMetrics } from './MarketMetrics';
import { TrendAnalysis } from './TrendAnalysis';
import { SectorDistribution } from './SectorDistribution';
import { PremiumInsights } from './PremiumInsights';
import { InsightCard } from './InsightCard';

interface Props {
  isDarkMode: boolean;
}

export function Insights({ isDarkMode }: Props) {
  const [selectedMetric, setSelectedMetric] = useState('sentiment');

  const marketData = [
    { date: 'Jan', sentiment: 75, volume: 45, devActivity: 82, socialEngagement: 65, walletActivity: 55 },
    { date: 'Feb', sentiment: 65, volume: 55, devActivity: 88, socialEngagement: 70, walletActivity: 62 },
    { date: 'Mar', sentiment: 80, volume: 65, devActivity: 92, socialEngagement: 85, walletActivity: 78 },
    { date: 'Apr', sentiment: 70, volume: 50, devActivity: 95, socialEngagement: 78, walletActivity: 85 },
    { date: 'May', sentiment: 85, volume: 70, devActivity: 98, socialEngagement: 88, walletActivity: 92 },
  ];

  const insightCards = [
    {
      icon: Code,
      title: 'Developer Activity',
      value: '+47%',
      description: 'Increase in GitHub commits across major protocols',
      trend: 'up'
    },
    {
      icon: Users,
      title: 'Social Sentiment',
      value: '78%',
      description: 'Positive mentions across social platforms',
      trend: 'up'
    },
    {
      icon: Activity,
      title: 'Network Activity',
      value: '2.1M',
      description: 'Daily active addresses',
      trend: 'up'
    },
    {
      icon: Building2,
      title: 'Institutional Interest',
      value: '324',
      description: 'New institutional investments this month',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Market Insights
        </h1>
        <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          Advanced analytics and market intelligence
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insightCards.map((card) => (
          <InsightCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            value={card.value}
            description={card.description}
            trend={card.trend}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Market Metrics */}
      <MarketMetrics isDarkMode={isDarkMode} />

      {/* Trend Analysis */}
      <TrendAnalysis data={marketData} isDarkMode={isDarkMode} />

      {/* Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectorDistribution isDarkMode={isDarkMode} />
        <PremiumInsights isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
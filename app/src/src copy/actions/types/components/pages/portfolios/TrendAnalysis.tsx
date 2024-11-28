import React from 'react';
import { Line, ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Props {
  data: {
    date: string;
    sentiment: number;
    volume: number;
    devActivity: number;
    socialEngagement: number;
    walletActivity: number;
  }[];
  isDarkMode: boolean;
}

export function TrendAnalysis({ data, isDarkMode }: Props) {
  return (
    <div className={`${isDarkMode ? 'bg-[#151C2C]' : 'bg-white'} rounded-xl p-6`}>
      <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        Trend Analysis
      </h2>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
            <XAxis 
              dataKey="date" 
              stroke={isDarkMode ? '#9ca3af' : '#64748b'}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#64748b'}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : 'white',
                border: 'none',
                borderRadius: '0.5rem',
                color: isDarkMode ? 'white' : 'black'
              }}
            />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="devActivity"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="socialEngagement"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ fill: '#ec4899', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
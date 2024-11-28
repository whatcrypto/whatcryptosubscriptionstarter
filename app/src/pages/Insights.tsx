import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lock, Code, Users, Activity, MessageCircle, Zap, TrendingUp, Wallet } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
  name: any;
  date:any;
  sentiment:any;
  volume:any;
  devActivity:any;
  socialEngagement:any;
  walletActivity:any;
  icon:any;
  title:any;
  value:any;
  description:any;
  trend:any;
  key:any;
  label:any;
}

const Insights: React.FC<Props> = ({ isDarkMode }) => {
  const [selectedMetric, setSelectedMetric] = useState('sentiment');

  const marketData = [
    { date: 'Jan', sentiment: 75, volume: 45, devActivity: 82, socialEngagement: 65, walletActivity: 55 },
    { date: 'Feb', sentiment: 65, volume: 55, devActivity: 88, socialEngagement: 70, walletActivity: 62 },
    { date: 'Mar', sentiment: 80, volume: 65, devActivity: 92, socialEngagement: 85, walletActivity: 78 },
    { date: 'Apr', sentiment: 70, volume: 50, devActivity: 95, socialEngagement: 78, walletActivity: 85 },
    { date: 'May', sentiment: 85, volume: 70, devActivity: 98, socialEngagement: 88, walletActivity: 92 },
  ];

  const innovatorData = [
    { name: 'DeFi', value: 35 },
    { name: 'NFTs', value: 25 },
    { name: 'Layer 2', value: 20 },
    { name: 'GameFi', value: 15 },
    { name: 'Others', value: 5 },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

  const metrics = [
    { key: 'sentiment', label: 'Market Sentiment', icon: MessageCircle },
    { key: 'devActivity', label: 'Developer Activity', icon: Code },
    { key: 'socialEngagement', label: 'Social Engagement', icon: Users },
    { key: 'walletActivity', label: 'Wallet Activity', icon: Wallet },
  ];

  const insightCards = [
    {
      icon: Code,
      title: 'Developer Activity',
      value: '',
      description: '',
      trend: '',
    },
    {
      icon: MessageCircle,
      title: '',
      value: '78%',
      description: 'Positive mentions across social platforms',
      trend: 'up'
    },
    {
      icon: Zap,
      title: 'New Innovators',
      value: '324',
      description: 'New projects launched this month',
      trend: 'up'
    },
    {
      icon: Activity,
      title: 'Network Activity',
      value: '2.1M',
      description: 'Daily active addresses',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold  'text-white' : 'text-slate-800'}`}>
          Market Insights
        </h1>
        <div className="flex space-x-2">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedMetric === metric.key
                  ? isDarkMode
                    ? 'bg-indigo-900 text-indigo-400'
                    : 'bg-indigo-50 text-indigo-600'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <metric.icon className="h-4 w-4" />
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insightCards.map((card) => (
          <div
            key={card.title}
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-sm p-6 transition-transform duration-200 hover:scale-105`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className={`font-semibold  'text-white' : 'text-slate-800'}`}>
                {card.title}
              </h3>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold  'text-white' : 'text-slate-800'}`}>
                {card.value}
              </span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className={`mt-2 text-sm  'text-gray-400' : 'text-slate-500'}`}>
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className={` 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
        <h2 className={`text-xl font-semibold mb-6  'text-white' : 'text-slate-800'}`}>
          Trend Analysis
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
              <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#64748b'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#64748b'} />
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
                dataKey={selectedMetric}
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Innovation Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={` 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
          <h2 className={`text-xl font-semibold mb-6  'text-white' : 'text-slate-800'}`}>
            Innovation Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={innovatorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {innovatorData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Premium Insights */}
        <div className={` 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold  'text-white' : 'text-slate-800'}`}>
              Advanced Analytics
            </h2>
            <Lock className="h-5 w-5 text-indigo-600" />
          </div>
          <div className={`p-8 text-center  'bg-gray-700' : 'bg-slate-50'} rounded-lg`}>
            <p className={`text-lg mb-4  'text-gray-300' : 'text-slate-600'}`}>
              Get access to advanced metrics, AI predictions, and expert analysis
            </p>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
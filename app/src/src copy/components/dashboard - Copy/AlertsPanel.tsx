import React from 'react';
import { Bell, TrendingUp, AlertTriangle, Target } from 'lucide-react';

export function AlertsPanel() {
  const alerts = [
    {
      type: 'signal',
      icon: TrendingUp,
      title: 'BTC Signal Change',
      message: 'Bitcoin signal changed to BUY',
      time: '5m ago',
      priority: 'high',
    },
    {
      type: 'portfolio',
      icon: Target,
      title: 'Portfolio Alert',
      message: 'Portfolio deviation detected',
      time: '15m ago',
      priority: 'medium',
    },
    {
      type: 'market',
      icon: AlertTriangle,
      title: 'Market Volatility',
      message: 'Increased market volatility detected',
      time: '1h ago',
      priority: 'low',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const priorityColors = {
            high: 'bg-red-500/10 text-red-400',
            medium: 'bg-yellow-500/10 text-yellow-400',
            low: 'bg-blue-500/10 text-blue-400',
          };

          return (
            <div
              key={alert.title}
              className={`flex items-start gap-3 p-4 rounded-lg ${priorityColors[alert.priority]}`}
            >
              <Icon className="w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{alert.title}</h3>
                  <span className="text-xs text-slate-400">{alert.time}</span>
                </div>
                <p className="text-sm text-slate-300 mt-1">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
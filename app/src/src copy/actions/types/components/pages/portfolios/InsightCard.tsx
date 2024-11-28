import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down';
  isDarkMode: boolean;
}

export function InsightCard({ icon: Icon, title, value, description, trend, isDarkMode }: Props) {
  return (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#151C2C]' : 'bg-white'} transition-transform duration-200 hover:scale-105`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {title}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {value}
          </span>
          {trend && (
            <div className={`flex items-center ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
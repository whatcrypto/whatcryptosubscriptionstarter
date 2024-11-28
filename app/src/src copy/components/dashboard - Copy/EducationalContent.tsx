import React from 'react';
import { BookOpen, PlayCircle, TrendingUp, Target } from 'lucide-react';

export function EducationalContent() {
  const content = [
    {
      type: 'article',
      icon: BookOpen,
      title: 'Understanding Market Cycles',
      duration: '5 min read',
      category: 'Market Analysis',
      color: 'blue',
    },
    {
      type: 'video',
      icon: PlayCircle,
      title: 'Portfolio Rebalancing Guide',
      duration: '10 min video',
      category: 'Portfolio Management',
      color: 'purple',
    },
    {
      type: 'course',
      icon: Target,
      title: 'Technical Analysis Basics',
      duration: '4/8 lessons',
      category: 'Trading',
      color: 'emerald',
    },
    {
      type: 'article',
      icon: TrendingUp,
      title: 'DeFi Investment Strategies',
      duration: '8 min read',
      category: 'DeFi',
      color: 'yellow',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Learn & Grow</h2>
        <button className="text-sm text-slate-400 hover:text-white transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {content.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="group cursor-pointer">
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg group-hover:bg-slate-700/70 transition-colors">
                <div className={`w-10 h-10 bg-${item.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${item.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <span className="text-xs text-slate-400">{item.category}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{item.duration}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
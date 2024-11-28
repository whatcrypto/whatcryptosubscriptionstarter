import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, LineChart, Wallet, BookOpen, Lock } from 'lucide-react';

interface Props {
  onItemClick?: () => void;
}

export function DashboardNav({ onItemClick }: Props) {
  const location = useLocation();
  
  const navItems = [
    { icon: BarChart2, label: 'Overview', path: '/' },
    { icon: LineChart, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Wallet, label: 'Portfolios', path: '/portfolios' },
    { icon: BookOpen, label: 'Insights', path: '/insights' },
    { icon: Lock, label: 'Premium', path: '/premium' },
  ];

  return (
    <nav className="py-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 relative transition-colors duration-200 ${
              isActive 
                ? 'text-blue-400 bg-blue-500/10' 
                : 'text-slate-400 hover:bg-[#1A2235]'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-l-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
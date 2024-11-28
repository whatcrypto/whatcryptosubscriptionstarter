import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, TrendingUp, Bell, Settings } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#151C2C] border-b border-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5 text-slate-400" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-bold text-white">WhatCrypto</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-slate-400" />
          </button>
          
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Settings className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
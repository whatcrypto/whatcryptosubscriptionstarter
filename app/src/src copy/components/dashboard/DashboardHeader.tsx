import React from 'react';
import Link from 'next/link';
import { TrendingUp, Bell, Settings } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { MainNav } from '../navigation/MainNav';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-content">WhatCrypto</span>
          </Link>

          <div className="flex items-center gap-4">
            <MainNav />
            <ThemeToggle />
            <button className="p-2 text-content-secondary hover:text-content transition-colors rounded-lg hover:bg-card">
              <Bell className="w-5 h-5" />
            </button>
            <Link 
              href="/settings"
              className="p-2 text-content-secondary hover:text-content transition-colors rounded-lg hover:bg-card"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
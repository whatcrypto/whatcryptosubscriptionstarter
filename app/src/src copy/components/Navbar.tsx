import React from 'react';
import { TrendingUp } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="flex justify-between items-center mb-16">
      <div className="flex items-center gap-2 text-xl font-bold">
        <TrendingUp className="w-8 h-8 text-blue-400" />
        <span>WhatCrypto</span>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium transition-colors">
        Get Started
      </button>
    </nav>
  );
}
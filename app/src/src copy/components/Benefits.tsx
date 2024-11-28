import React from 'react';
import { Shield, Target } from 'lucide-react';

export function Benefits() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose WhatCrypto</h2>
      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Professional Guidance</h3>
            <p className="text-slate-300">
              Make investment decisions backed by expert analysis and strategic portfolio management.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Clear Investment Signals</h3>
            <p className="text-slate-300">
              Know when to buy, hold, or sell with our lifecycle analysis and market indicators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
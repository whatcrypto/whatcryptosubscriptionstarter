import React from 'react';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 lg:p-12 text-center border border-slate-700">
      <h2 className="text-3xl lg:text-4xl font-bold mb-6">
        Start Building Your Crypto Portfolio Today
      </h2>
      <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
        Join WhatCrypto and get access to professional portfolio strategies, detailed coin analysis, and expert investment guidance.
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
        Get Started Now
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
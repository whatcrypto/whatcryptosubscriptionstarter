import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  const benefits = [
    'Access to all model portfolios',
    'Real-time buy/sell signals',
    'Portfolio tracking & alerts',
    'Expert market analysis',
  ];

  return (
    <div className="flex flex-col gap-8 py-16 px-4 text-center">
      <h2 className="text-2xl font-bold text-white">
        Ready to start investing smarter?
      </h2>
      <p className="text-slate-300">
        Join thousands of investors who trust our signals and portfolios
      </p>

      <div className="flex flex-col gap-4 bg-slate-800 p-6 rounded-lg">
        <div className="flex flex-col gap-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 text-left">
              <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-slate-400">
          14-day free trial • No credit card required
        </p>
      </div>
    </div>
  );
}
import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';

interface Props {
  isDarkMode: boolean;
}

export function PremiumInsights({ isDarkMode }: Props) {
  return (
    <div className={`${isDarkMode ? 'bg-[#151C2C]' : 'bg-white'} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Advanced Analytics
        </h2>
        <Lock className="h-5 w-5 text-indigo-600" />
      </div>
      
      <div className={`p-8 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-slate-50'} rounded-lg`}>
        <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
          Get access to advanced metrics, AI predictions, and expert analysis
        </p>
        <Link
          href="/premium"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
}
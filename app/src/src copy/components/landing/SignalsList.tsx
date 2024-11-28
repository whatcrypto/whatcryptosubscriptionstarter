import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export function SignalsList() {
  const signals = [
    {
      coin: 'Bitcoin',
      symbol: 'BTC',
      type: 'buy',
      time: '2h ago',
      entry: 42850,
      target: 48200,
      stopLoss: 41200,
    },
    {
      coin: 'Ethereum',
      symbol: 'ETH',
      type: 'sell',
      time: '4h ago',
      entry: 2350,
      target: 2180,
      stopLoss: 2420,
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-16 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Latest Signals</h2>
        <p className="text-slate-400">Real-Time Trading Opportunities</p>
      </div>

      <div className="flex flex-col gap-4">
        {signals.map((signal) => (
          <div key={signal.symbol} className="p-6 bg-slate-800 rounded-lg">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    signal.type === 'buy' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  }`}>
                    {signal.type === 'buy' ? (
                      <TrendingUp className={`w-5 h-5 ${
                        signal.type === 'buy' ? 'text-emerald-400' : 'text-red-400'
                      }`} />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{signal.coin} ({signal.symbol})</h3>
                    <p className="text-sm text-slate-400">
                      {signal.type === 'buy' ? 'Buy' : 'Sell'} Signal • {signal.time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Entry Price</p>
                  <p className="text-lg font-semibold text-white">${signal.entry.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Target</p>
                  <p className="text-lg font-semibold text-emerald-400">${signal.target.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Stop Loss</p>
                  <p className="text-lg font-semibold text-red-400">${signal.stopLoss.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link 
        href="/dashboard"
        className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        View All Signals
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
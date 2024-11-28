import React from 'react';
import { Circle, TrendingUp, TrendingDown } from 'lucide-react';

export function PortfolioComposition() {
  const assets = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      allocation: 45,
      value: 11025,
      price: 45000,
      change: '+2.5%',
      signal: 'buy',
      stage: 'Accumulation',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      allocation: 35,
      value: 8575,
      price: 2800,
      change: '-1.2%',
      signal: 'hold',
      stage: 'Distribution',
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      allocation: 12,
      value: 2940,
      price: 1.25,
      change: '+5.8%',
      signal: 'buy',
      stage: 'Accumulation',
    },
    {
      name: 'Polkadot',
      symbol: 'DOT',
      allocation: 8,
      value: 1960,
      price: 15.80,
      change: '+3.2%',
      signal: 'hold',
      stage: 'Accumulation',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Portfolio Composition</h2>
        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Rebalance
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-400">
              <th className="pb-4 font-medium">Asset</th>
              <th className="pb-4 font-medium text-right">Allocation</th>
              <th className="pb-4 font-medium text-right">Value</th>
              <th className="pb-4 font-medium text-right">Price</th>
              <th className="pb-4 font-medium text-right">24h Change</th>
              <th className="pb-4 font-medium">Signal</th>
              <th className="pb-4 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.symbol} className="border-t border-slate-700">
                <td className="py-4">
                  <div>
                    <p className="font-medium text-white">{asset.name}</p>
                    <p className="text-sm text-slate-400">{asset.symbol}</p>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <p className="font-medium text-white">{asset.allocation}%</p>
                </td>
                <td className="py-4 text-right">
                  <p className="font-medium text-white">${asset.value.toLocaleString()}</p>
                </td>
                <td className="py-4 text-right">
                  <p className="font-medium text-white">${asset.price.toLocaleString()}</p>
                </td>
                <td className="py-4 text-right">
                  <p className={`flex items-center justify-end gap-1 ${
                    asset.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {asset.change.startsWith('+') ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {asset.change}
                  </p>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1">
                    <Circle className={`w-2 h-2 ${
                      asset.signal === 'buy' ? 'text-emerald-400' : 'text-yellow-400'
                    }`} />
                    <span className="text-white font-medium">
                      {asset.signal.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-slate-300">{asset.stage}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
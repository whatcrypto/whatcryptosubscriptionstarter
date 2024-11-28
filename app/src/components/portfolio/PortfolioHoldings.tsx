import React from 'react';
import { TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import type { PortfolioHolding } from '../../context/PortfolioContext';

interface Props {
  holdings: PortfolioHolding[];
  onEditHolding: (holding: PortfolioHolding) => void;
  onRemoveHolding: (holdingId: string) => void;
}

export function PortfolioHoldings({ holdings, onEditHolding, onRemoveHolding }: Props) {
  return (
    <div className="bg-[#151C2C] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Holdings</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">24h</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">P/L</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Allocation</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {holdings.map((holding) => (
              <tr key={holding.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${holding.symbol.toLowerCase()}.png`}
                      alt={holding.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/generic.png';
                      }}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{holding.name}</div>
                      <div className="text-sm text-slate-400">{holding.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                  {holding.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                  ${holding.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                  ${holding.value.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`flex items-center justify-end text-sm ${
                    holding.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {holding.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(holding.change24h)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm ${
                    holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${Math.abs(holding.profitLoss).toLocaleString()}
                    <span className="text-xs ml-1">
                      ({holding.profitLossPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                    {holding.allocation.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="relative group">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-1 invisible group-hover:visible">
                      <button
                        onClick={() => onEditHolding(holding)}
                        className="w-full px-4 py-2 text-sm text-white hover:bg-slate-700 text-left"
                      >
                        Edit Holding
                      </button>
                      <button
                        onClick={() => onRemoveHolding(holding.id)}
                        className="w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700 text-left"
                      >
                        Remove Holding
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
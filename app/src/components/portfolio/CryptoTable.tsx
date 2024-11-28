import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { WatchlistButton } from './WatchlistButton';
import type { CategorizedCoin } from '../data/categoryData';

interface Props {
  data: CategorizedCoin[];
  isDarkMode?: boolean;
}

type SortKey = 'rating' | 'marketCap' | 'change' | 'name';

const CryptoTable: React.FC<Props> = ({ data, isDarkMode }) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case 'rating':
        comparison = b.rating - a.rating;
        break;
      case 'change':
        comparison = b.percentChange - a.percentChange;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }
    return sortDirection === 'asc' ? -comparison : comparison;
  });

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end">
        <select
          onChange={(e) => handleSort(e.target.value as SortKey)}
          value={sortKey}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0B1222] text-slate-400 border-slate-700 border"
        >
          <option value="rating">Sort by WC Score</option>
          <option value="marketCap">Sort by Market Cap</option>
          <option value="change">Sort by Change</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Asset</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Grade</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Short Term</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Long Term</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {sortedData.map((coin) => (
            <tr 
              key={coin.id} 
              className="hover:bg-slate-800/50 cursor-pointer"
              onClick={(e) => {
                // Prevent navigation when clicking the watchlist button
                if ((e.target as HTMLElement).closest('.watchlist-btn')) return;
                navigate(`/coins/${coin.id.toLowerCase()}`);
              }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${coin.symbol.toLowerCase()}.png`}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/generic.png';
                    }}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">{coin.name}</div>
                    <div className="text-sm text-slate-400">{coin.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">
                {coin.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  coin.grade === 'buy' 
                    ? 'bg-green-500/10 text-green-400'
                    : coin.grade === 'sell'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {coin.grade.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className={`flex items-center justify-end ${
                  coin.percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coin.percentChange >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(coin.percentChange)}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">
                {coin.shortTermPhase}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">
                {coin.longTermPhase}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="watchlist-btn inline-block" onClick={e => e.stopPropagation()}>
                  <WatchlistButton coin={{
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    price: 0, // Add actual price data
                    change24h: coin.percentChange,
                    signal: coin.grade
                  }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
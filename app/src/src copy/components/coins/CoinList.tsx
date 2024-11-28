import React from 'react';
import Link from 'next/link';
import { Search, Star, TrendingUp, TrendingDown, Circle } from 'lucide-react';

export function CoinList() {
  const coins = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 45000,
      change: 2.5,
      signal: 'buy',
      stage: 'Accumulation',
      marketCap: '857.2B',
      volume: '24.5B',
      portfolios: ['Growth', 'Balanced'],
    },
    // ... rest of the coins data
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content">Coin Analysis</h1>
          <p className="text-content-secondary mt-1">Detailed analysis and signals for top cryptocurrencies</p>
        </div>
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-secondary" />
          <input
            type="text"
            placeholder="Search coins"
            className="w-full sm:w-64 bg-card text-content pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-content-secondary border-b border-border">
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">24h Change</th>
                <th className="p-4 font-medium">Signal</th>
                <th className="p-4 font-medium">Stage</th>
                <th className="p-4 font-medium">Market Cap</th>
                <th className="p-4 font-medium">Volume</th>
                <th className="p-4 font-medium">Portfolios</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <Link
                  key={coin.id}
                  href={`/coins/${coin.id}`}
                  className="block border-b border-border hover:bg-card-hover cursor-pointer transition-colors"
                >
                  <tr>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Toggle watchlist
                          }}
                          className="text-content-secondary hover:text-warning transition-colors"
                        >
                          <Star className="w-5 h-5" />
                        </button>
                        <div>
                          <p className="font-medium text-content">{coin.name}</p>
                          <p className="text-sm text-content-secondary">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-content">${coin.price.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className={`flex items-center gap-1 ${
                        coin.change > 0 ? 'text-success' : 'text-danger'
                      }`}>
                        {coin.change > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(coin.change)}%
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Circle className={`w-2 h-2 ${
                          coin.signal === 'buy' ? 'text-success' : 'text-warning'
                        }`} />
                        <span className="text-content font-medium">
                          {coin.signal.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-content-secondary">{coin.stage}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-content">${coin.marketCap}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-content">${coin.volume}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {coin.portfolios.map((portfolio) => (
                          <span
                            key={portfolio}
                            className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent"
                          >
                            {portfolio}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
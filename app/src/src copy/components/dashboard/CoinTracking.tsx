import React, { useState } from 'react';
import { Circle, Star, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface CoinTrackingProps {
  onAddToPortfolio: (coinId: string) => void;
}

export function CoinTracking({ onAddToPortfolio }: CoinTrackingProps) {
  const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  const coins = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 45000,
      change: 2.5,
      signal: 'buy',
      stage: 'Accumulation',
      target: 52000,
      stopLoss: 41000,
      analysis: 'Strong institutional buying and positive market sentiment indicate potential upward movement.',
      grade: 'A',
      metrics: {
        volume: '24.5B',
        marketCap: '857.2B',
      }
    },
    // ... other coins
  ];

  const toggleWatchlist = (coinId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(coinId)) {
        newWatchlist.delete(coinId);
      } else {
        newWatchlist.add(coinId);
      }
      return newWatchlist;
    });
  };

  const handleAddToPortfolio = (coinId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onAddToPortfolio(coinId);
  };

  return (
    <div className="bg-card rounded-xl p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-content">Coin Tracking</h2>
          <button className="flex items-center gap-2 text-sm text-accent hover:text-accent-secondary transition-colors">
            <Plus className="w-4 h-4" />
            Add Coin
          </button>
        </div>
        <p className="text-sm text-content-secondary">Track and analyze your selected cryptocurrencies</p>
      </div>

      <div className="flex flex-col gap-4">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="flex flex-col bg-card-secondary rounded-lg overflow-hidden"
          >
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-card-hover transition-colors"
              onClick={() => setExpandedCoin(expandedCoin === coin.id ? null : coin.id)}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => toggleWatchlist(coin.id, e)}
                  className="text-content-secondary hover:text-warning transition-colors"
                >
                  <Star className={`w-5 h-5 ${watchlist.has(coin.id) ? 'fill-current text-warning' : ''}`} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-content">{coin.name}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                      Grade {coin.grade}
                    </span>
                  </div>
                  <p className="text-sm text-content-secondary">{coin.symbol}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-medium text-content">${coin.price.toLocaleString()}</p>
                  <p className={`flex items-center justify-end gap-1 text-sm ${
                    coin.change > 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {coin.change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(coin.change)}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className={`w-2 h-2 ${
                    coin.signal === 'buy' ? 'text-success' : 'text-warning'
                  }`} />
                  <span className="text-content font-medium">
                    {coin.signal.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={(e) => handleAddToPortfolio(coin.id, e)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                {expandedCoin === coin.id ? (
                  <ChevronUp className="w-5 h-5 text-content-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-content-secondary" />
                )}
              </div>
            </div>
            
            {expandedCoin === coin.id && (
              <div className="p-4 border-t border-border">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-card rounded-lg">
                      <p className="text-sm text-content-secondary">Target Price</p>
                      <p className="text-lg font-semibold text-success">
                        ${coin.target.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-card rounded-lg">
                      <p className="text-sm text-content-secondary">Stop Loss</p>
                      <p className="text-lg font-semibold text-danger">
                        ${coin.stopLoss.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-card rounded-lg">
                    <p className="text-sm text-content-secondary mb-2">Analysis</p>
                    <p className="text-sm text-content">{coin.analysis}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-content-secondary">
                    <span>Volume: ${coin.metrics.volume}</span>
                    <span>Market Cap: ${coin.metrics.marketCap}</span>
                  </div>

                  <button className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent-secondary transition-colors">
                    View Full Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
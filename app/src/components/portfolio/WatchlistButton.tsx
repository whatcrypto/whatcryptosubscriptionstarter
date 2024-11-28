import React from 'react';
import { Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

interface WatchlistButtonProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    signal: string;
  };
}

export function WatchlistButton({ coin }: WatchlistButtonProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isWatched = isInWatchlist(coin.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    if (isWatched) {
      removeFromWatchlist(coin.id);
    } else {
      addToWatchlist(coin);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg transition-colors ${
        isWatched 
          ? 'text-yellow-400 hover:bg-yellow-500/10' 
          : 'text-slate-400 hover:bg-slate-700'
      }`}
      title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      <Star className="w-5 h-5" fill={isWatched ? 'currentColor' : 'none'} />
    </button>
  );
}
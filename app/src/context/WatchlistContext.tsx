import React, { createContext, useContext, useState, useEffect } from 'react';

interface WatchlistCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  signal: string;
  category?: string;
  alerts?: {
    price?: { above?: number; below?: number };
    change?: { above?: number; below?: number };
  };
  addedAt: Date;
}

interface WatchlistContextType {
  watchlist: WatchlistCoin[];
  categories: string[];
  addToWatchlist: (coin: Omit<WatchlistCoin, 'addedAt' | 'alerts'>) => void;
  removeFromWatchlist: (coinId: string) => void;
  isInWatchlist: (coinId: string) => boolean;
  addAlert: (coinId: string, type: 'price' | 'change', condition: 'above' | 'below', value: number) => void;
  removeAlert: (coinId: string, type: 'price' | 'change', condition: 'above' | 'below') => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  setCoinCategory: (coinId: string, category: string | null) => void;
  getWatchlistByCategory: (category: string | null) => WatchlistCoin[];
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistCoin[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'addedAt') return new Date(value);
      return value;
    }) : [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('watchlistCategories');
    return saved ? JSON.parse(saved) : ['Favorites', 'Research', 'High Potential'];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('watchlistCategories', JSON.stringify(categories));
  }, [categories]);

  const addToWatchlist = (coin: Omit<WatchlistCoin, 'addedAt' | 'alerts'>) => {
    if (!isInWatchlist(coin.id)) {
      setWatchlist(prev => [...prev, { ...coin, addedAt: new Date(), alerts: {} }]);
    }
  };

  const removeFromWatchlist = (coinId: string) => {
    setWatchlist(prev => prev.filter(coin => coin.id !== coinId));
  };

  const isInWatchlist = (coinId: string) => {
    return watchlist.some(coin => coin.id === coinId);
  };

  const addAlert = (coinId: string, type: 'price' | 'change', condition: 'above' | 'below', value: number) => {
    setWatchlist(prev => prev.map(coin => {
      if (coin.id !== coinId) return coin;
      return {
        ...coin,
        alerts: {
          ...coin.alerts,
          [type]: { ...(coin.alerts?.[type] || {}), [condition]: value }
        }
      };
    }));
  };

  const removeAlert = (coinId: string, type: 'price' | 'change', condition: 'above' | 'below') => {
    setWatchlist(prev => prev.map(coin => {
      if (coin.id !== coinId) return coin;
      const alerts = { ...coin.alerts };
      if (alerts[type]) {
        delete alerts[type][condition];
        if (Object.keys(alerts[type]).length === 0) delete alerts[type];
      }
      return { ...coin, alerts };
    }));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const removeCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    setWatchlist(prev => prev.map(coin => 
      coin.category === category ? { ...coin, category: null } : coin
    ));
  };

  const setCoinCategory = (coinId: string, category: string | null) => {
    setWatchlist(prev => prev.map(coin => 
      coin.id === coinId ? { ...coin, category } : coin
    ));
  };

  const getWatchlistByCategory = (category: string | null) => {
    return watchlist.filter(coin => coin.category === category);
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      categories,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      addAlert,
      removeAlert,
      addCategory,
      removeCategory,
      setCoinCategory,
      getWatchlistByCategory
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
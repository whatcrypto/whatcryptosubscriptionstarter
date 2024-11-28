import React, { useState, useEffect } from 'react';
import { Plus, Percent, Save, X, TrendingUp, TrendingDown, BarChart2, Bell, AlertTriangle } from 'lucide-react';

interface CoinAllocation {
  id: string;
  name: string;
  symbol: string;
  allocation: number;
  price: number;
  change: number;
  previousPrice?: number;
  targetAllocation?: number;
}

interface PortfolioAlert {
  type: 'price' | 'rebalance';
  message: string;
  timestamp: Date;
}

interface PersonalPortfolioProps {
  coinIds: string[];
}

export function PersonalPortfolio({ coinIds }: PersonalPortfolioProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [allocations, setAllocations] = useState<CoinAllocation[]>([]);
  const [tempAllocation, setTempAllocation] = useState<number>(0);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<PortfolioAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  // Initialize portfolio with tracked coins
  useEffect(() => {
    const initialAllocations: CoinAllocation[] = coinIds.map((id, index) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      symbol: id.slice(0, 3).toUpperCase(),
      allocation: Math.floor(100 / coinIds.length),
      price: Math.random() * 1000,
      change: (Math.random() * 10) - 5,
      previousPrice: Math.random() * 1000,
      targetAllocation: Math.floor(100 / coinIds.length),
    }));
    setAllocations(initialAllocations);
  }, [coinIds]);

  // Monitor price changes and trigger alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setAllocations(prev => prev.map(coin => {
        const newPrice = coin.price * (1 + ((Math.random() * 0.02) - 0.01));
        const priceChange = ((newPrice - coin.price) / coin.price) * 100;
        
        // Alert if price change is significant
        if (Math.abs(priceChange) > 5) {
          const direction = priceChange > 0 ? 'increased' : 'decreased';
          setAlerts(prev => [{
            type: 'price',
            message: `${coin.name} has ${direction} by ${Math.abs(priceChange).toFixed(2)}%`,
            timestamp: new Date(),
          }, ...prev].slice(0, 5));
        }

        return {
          ...coin,
          previousPrice: coin.price,
          price: newPrice,
          change: priceChange,
        };
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const totalAllocation = allocations.reduce((sum, coin) => sum + coin.allocation, 0);
  const totalValue = allocations.reduce((sum, coin) => sum + (coin.price * coin.allocation / 100), 0);

  const handleSaveAllocation = () => {
    if (selectedCoin && tempAllocation > 0) {
      setAllocations(prev => prev.map(coin => 
        coin.id === selectedCoin ? { ...coin, allocation: tempAllocation } : coin
      ));
      setSelectedCoin(null);
      setTempAllocation(0);
    }
  };

  const handleRemoveAllocation = (coinId: string) => {
    setAllocations(prev => prev.filter(coin => coin.id !== coinId));
  };

  const calculateRebalanceTargets = () => {
    const totalDrift = allocations.reduce((sum, coin) => {
      const currentValue = (coin.price * coin.allocation) / 100;
      const targetValue = totalValue * (coin.targetAllocation || 0) / 100;
      return sum + Math.abs(currentValue - targetValue);
    }, 0);

    if (totalDrift / totalValue > 0.05) { // 5% threshold for rebalancing
      setAlerts(prev => [{
        type: 'rebalance',
        message: 'Portfolio requires rebalancing due to significant drift',
        timestamp: new Date(),
      }, ...prev].slice(0, 5));
    }
  };

  useEffect(() => {
    calculateRebalanceTargets();
  }, [allocations]);

  const handleRebalance = () => {
    setAllocations(prev => prev.map(coin => ({
      ...coin,
      allocation: coin.targetAllocation || coin.allocation,
    })));
    setIsRebalancing(false);
    setAlerts(prev => [{
      type: 'rebalance',
      message: 'Portfolio has been rebalanced successfully',
      timestamp: new Date(),
    }, ...prev].slice(0, 5));
  };

  return (
    <div className="bg-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-content">Your Portfolio</h2>
          <p className="text-sm text-content-secondary mt-1">
            Total Value: ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 text-content-secondary hover:text-content transition-colors"
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
            )}
          </button>
          <p className={`text-sm ${totalAllocation === 100 ? 'text-success' : 'text-warning'}`}>
            Total: {totalAllocation}%
          </p>
          <button
            onClick={() => setIsRebalancing(!isRebalancing)}
            className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
          >
            Rebalance
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      {showAlerts && alerts.length > 0 && (
        <div className="mb-6 p-4 bg-card-secondary rounded-lg">
          <h3 className="text-sm font-medium text-content mb-3">Recent Alerts</h3>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                {alert.type === 'price' ? (
                  <BarChart2 className="w-4 h-4 text-accent mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                )}
                <div>
                  <p className="text-content">{alert.message}</p>
                  <p className="text-content-secondary">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {allocations.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-4 bg-card-secondary rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-accent font-semibold">{coin.symbol[0]}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-content">{coin.name}</p>
                  <div className={`flex items-center gap-1 text-sm ${
                    coin.change > 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {coin.change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(coin.change).toFixed(2)}%
                  </div>
                </div>
                <p className="text-sm text-content-secondary">
                  ${coin.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isRebalancing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={coin.targetAllocation || coin.allocation}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, Number(e.target.value)));
                      setAllocations(prev => prev.map(c => 
                        c.id === coin.id ? { ...c, targetAllocation: value } : c
                      ));
                    }}
                    className="w-20 px-2 py-1 bg-background border border-border rounded-md text-content"
                  />
                  <span className="text-content-secondary">%</span>
                </div>
              ) : isEditing && selectedCoin === coin.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempAllocation}
                    onChange={(e) => setTempAllocation(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-20 px-2 py-1 bg-background border border-border rounded-md text-content"
                  />
                  <button
                    onClick={handleSaveAllocation}
                    className="p-1 bg-success/20 text-success rounded-md hover:bg-success/30 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCoin(null);
                      setTempAllocation(0);
                    }}
                    className="p-1 bg-danger/20 text-danger rounded-md hover:bg-danger/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-right">
                    <p className="font-medium text-content">{coin.allocation}%</p>
                    <p className="text-sm text-content-secondary">
                      ${((coin.price * coin.allocation) / 100).toLocaleString()}
                    </p>
                  </div>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCoin(coin.id);
                          setTempAllocation(coin.allocation);
                        }}
                        className="p-1 bg-accent/20 text-accent rounded-md hover:bg-accent/30 transition-colors"
                      >
                        <Percent className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveAllocation(coin.id)}
                        className="p-1 bg-danger/20 text-danger rounded-md hover:bg-danger/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isRebalancing && (
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={() => setIsRebalancing(false)}
            className="px-4 py-2 text-content-secondary hover:text-content transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRebalance}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent-secondary transition-colors"
          >
            Confirm Rebalance
          </button>
        </div>
      )}
    </div>
  );
}
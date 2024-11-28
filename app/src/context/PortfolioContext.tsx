import React, { createContext, useContext, useState, useEffect } from 'react';

interface PortfolioHolding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  value: number;
  allocation: number;
  change24h: number;
  buyPrice: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface Portfolio {
  id: string;
  name: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  change24h: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastUpdated: Date;
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  setActivePortfolio: (portfolioId: string) => void;
  addPortfolio: (name: string) => void;
  removePortfolio: (portfolioId: string) => void;
  addHolding: (
    portfolioId: string,
    holding: Omit<
      PortfolioHolding,
      'allocation' | 'value' | 'profitLoss' | 'profitLossPercentage'
    >
  ) => void;
  updateHolding: (
    portfolioId: string,
    holdingId: string,
    updates: Partial<PortfolioHolding>
  ) => void;
  removeHolding: (portfolioId: string, holdingId: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const saved = localStorage.getItem('portfolios');
    return saved ? JSON.parse(saved) : [];
  });

  const [activePortfolio, setActivePortfolioState] = useState<Portfolio | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  const calculatePortfolioMetrics = (
    holdings: PortfolioHolding[]
  ): Pick<
    Portfolio,
    'totalValue' | 'change24h' | 'profitLoss' | 'profitLossPercentage'
  > => {
    const totalValue = holdings.reduce(
      (sum, holding) => sum + holding.value,
      0
    );
    const totalCost = holdings.reduce(
      (sum, holding) => sum + holding.buyPrice * holding.amount,
      0
    );
    const profitLoss = totalValue - totalCost;
    const profitLossPercentage =
      totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

    // Calculate weighted average change
    const change24h = holdings.reduce((sum, holding) => {
      const weight = holding.value / totalValue;
      return sum + holding.change24h * weight;
    }, 0);

    return {
      totalValue,
      change24h,
      profitLoss,
      profitLossPercentage,
    };
  };

  const calculateHoldingAllocations = (
    holdings: PortfolioHolding[]
  ): PortfolioHolding[] => {
    const totalValue = holdings.reduce(
      (sum, holding) => sum + holding.value,
      0
    );
    return holdings.map((holding) => ({
      ...holding,
      allocation: totalValue > 0 ? (holding.value / totalValue) * 100 : 0,
    }));
  };

  const setActivePortfolio = (portfolioId: string) => {
    const portfolio = portfolios.find((p) => p.id === portfolioId) || null;
    setActivePortfolioState(portfolio);
  };

  const addPortfolio = (name: string) => {
    const newPortfolio: Portfolio = {
      id: Date.now().toString(),
      name,
      holdings: [],
      totalValue: 0,
      change24h: 0,
      profitLoss: 0,
      profitLossPercentage: 0,
      lastUpdated: new Date(),
    };

    setPortfolios((prev) => [...prev, newPortfolio]);
  };

  const removePortfolio = (portfolioId: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));
    if (activePortfolio?.id === portfolioId) {
      setActivePortfolioState(null);
    }
  };

  const addHolding = (
    portfolioId: string,
    holding: Omit<
      PortfolioHolding,
      'allocation' | 'value' | 'profitLoss' | 'profitLossPercentage'
    >
  ) => {
    setPortfolios((prev) => {
      return prev.map((portfolio) => {
        if (portfolio.id !== portfolioId) return portfolio;

        const value = holding.price * holding.amount;
        const profitLoss = value - holding.buyPrice * holding.amount;
        const profitLossPercentage =
          holding.buyPrice > 0
            ? (profitLoss / (holding.buyPrice * holding.amount)) * 100
            : 0;

        const newHolding: PortfolioHolding = {
          ...holding,
          value,
          profitLoss,
          profitLossPercentage,
          allocation: 0, // Will be calculated below
        };

        const updatedHoldings = [...portfolio.holdings, newHolding];
        const holdingsWithAllocations =
          calculateHoldingAllocations(updatedHoldings);
        const metrics = calculatePortfolioMetrics(holdingsWithAllocations);

        return {
          ...portfolio,
          holdings: holdingsWithAllocations,
          ...metrics,
          lastUpdated: new Date(),
        };
      });
    });
  };

  const updateHolding = (
    portfolioId: string,
    holdingId: string,
    updates: Partial<PortfolioHolding>
  ) => {
    setPortfolios((prev) => {
      return prev.map((portfolio) => {
        if (portfolio.id !== portfolioId) return portfolio;

        const updatedHoldings = portfolio.holdings.map((holding) => {
          if (holding.id !== holdingId) return holding;

          const updatedHolding = { ...holding, ...updates };
          updatedHolding.value = updatedHolding.price * updatedHolding.amount;
          updatedHolding.profitLoss =
            updatedHolding.value -
            updatedHolding.buyPrice * updatedHolding.amount;
          updatedHolding.profitLossPercentage =
            updatedHolding.buyPrice > 0
              ? (updatedHolding.profitLoss /
                  (updatedHolding.buyPrice * updatedHolding.amount)) *
                100
              : 0;

          return updatedHolding;
        });

        const holdingsWithAllocations =
          calculateHoldingAllocations(updatedHoldings);
        const metrics = calculatePortfolioMetrics(holdingsWithAllocations);

        return {
          ...portfolio,
          holdings: holdingsWithAllocations,
          ...metrics,
          lastUpdated: new Date(),
        };
      });
    });
  };

  const removeHolding = (portfolioId: string, holdingId: string) => {
    setPortfolios((prev) => {
      return prev.map((portfolio) => {
        if (portfolio.id !== portfolioId) return portfolio;

        const updatedHoldings = portfolio.holdings.filter(
          (h) => h.id !== holdingId
        );
        const holdingsWithAllocations =
          calculateHoldingAllocations(updatedHoldings);
        const metrics = calculatePortfolioMetrics(holdingsWithAllocations);

        return {
          ...portfolio,
          holdings: holdingsWithAllocations,
          ...metrics,
          lastUpdated: new Date(),
        };
      });
    });
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        activePortfolio,
        setActivePortfolio,
        addPortfolio,
        removePortfolio,
        addHolding,
        updateHolding,
        removeHolding,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

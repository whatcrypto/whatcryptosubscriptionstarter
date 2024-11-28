import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { PortfolioOverview } from './PortfolioOverview';
import { CoinTracking } from './CoinTracking';
import { MarketInsights } from './MarketInsights';
import { EducationalContent } from './EducationalContent';
import { AlertsPanel } from './AlertsPanel';
import { ModelPortfolios } from './ModelPortfolios';
import { PersonalPortfolio } from './PersonalPortfolio';
import { BottomNav } from './BottomNav';

export function DashboardLayout() {
  const [hasPersonalPortfolio, setHasPersonalPortfolio] = useState(false);
  const [trackedCoins, setTrackedCoins] = useState<string[]>([]);

  const handleAddToPortfolio = (coinId: string) => {
    if (!trackedCoins.includes(coinId)) {
      setTrackedCoins(prev => [...prev, coinId]);
      setHasPersonalPortfolio(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-3xl pb-24 xl:pb-8">
        {hasPersonalPortfolio ? (
          <PortfolioOverview />
        ) : (
          <ModelPortfolios onCreatePortfolio={() => setHasPersonalPortfolio(true)} />
        )}
        <AlertsPanel />
        {hasPersonalPortfolio && trackedCoins.length > 0 && (
          <PersonalPortfolio coinIds={trackedCoins} />
        )}
        <CoinTracking onAddToPortfolio={handleAddToPortfolio} />
        <MarketInsights />
        <EducationalContent />
      </main>
      <BottomNav />
    </div>
  );
}
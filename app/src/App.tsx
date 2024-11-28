import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { PremiumProvider } from './context/PremiumContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { PortfolioProvider } from './context/PortfolioContext';
import DashboardLayout from './components/dashboard/DashboardLayout';

function App() {
  return (
    <SubscriptionProvider>
      <PremiumProvider>
        <WatchlistProvider>
          <PortfolioProvider>
            <BrowserRouter>
              <DashboardLayout />
            </BrowserRouter>
          </PortfolioProvider>
        </WatchlistProvider>
      </PremiumProvider>
    </SubscriptionProvider>
  );
}

export default App;
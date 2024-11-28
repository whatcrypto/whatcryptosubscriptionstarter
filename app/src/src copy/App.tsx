import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { LandingLayout } from './components/landing/LandingLayout';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { PortfoliosLayout } from './components/portfolios/PortfoliosLayout';
import { PortfolioList } from './components/portfolios/PortfolioList';
import { PortfolioDetail } from './components/portfolios/PortfolioDetail';
import { CoinList } from './components/coins/CoinList';
import { CoinDetail } from './components/coins/CoinDetail';
import { PricingPage } from './components/pricing/PricingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { BottomNav } from './components/dashboard/BottomNav';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingLayout />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/portfolios" element={<PortfoliosLayout />}>
            <Route index element={<PortfolioList />} />
            <Route path=":id" element={<PortfolioDetail />} />
          </Route>
          <Route path="/coins" element={<PortfoliosLayout />}>
            <Route index element={<CoinList />} />
            <Route path=":id" element={<CoinDetail />} />
          </Route>
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signals" element={<Navigate to="/coins" replace />} />
          <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
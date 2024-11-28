import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';
import Dashboard from '../../pages/Dashboard';
import Leaderboard from '../../pages/Leaderboard';
import ModelPortfolios from '../../pages/ModelPortfolios';
import Actions from '../../pages/Actions';
import CoinDetails from '../../pages/CoinDetails';
import PortfolioDetails from '../../pages/PortfolioDetails';
import News from '../../pages/News';
import Insights from '../../pages/Insights';

export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1121] text-white">
      <DashboardHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)}>
          <div className="w-64 h-full bg-[#151C2C] p-4" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2">
              <a href="/" className="block px-4 py-2 text-white hover:bg-slate-700 rounded-lg">Dashboard</a>
              <a href="/Leaderboard" className="block px-4 py-2 text-white hover:bg-slate-700 rounded-lg">Leaderboard</a>
              <a href="/portfolios" className="block px-4 py-2 text-white hover:bg-slate-700 rounded-lg">Portfolios</a>
              <a href="/actions" className="block px-4 py-2 text-white hover:bg-slate-700 rounded-lg">Actions</a>
            </nav>
          </div>
        </div>
      )}
      
      <main className="flex-1 p-4 lg:p-6 w-full max-w-[1600px] mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/portfolios" element={<ModelPortfolios />} />
          <Route path="/portfolio/:id" element={<PortfolioDetails />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/coins/:id" element={<CoinDetails />} />
          <Route path="/news" element={<News />} />
          <Route path="/insights" element={<Insights isDarkMode={true} />} />
        </Routes>
      </main>
    </div>
  );
}

export default DashboardLayout;
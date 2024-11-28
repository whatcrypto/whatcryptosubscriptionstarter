import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface Props {
  portfolioId: string;
  onClose: () => void;
}

export function AddHoldingModal({ portfolioId, onClose }: Props) {
  const { addHolding } = usePortfolio();
  const [formData, setFormData] = useState({
    symbol: '',
    amount: '',
    price: '',
    buyPrice: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addHolding(portfolioId, {
      id: Date.now().toString(),
      name: formData.symbol.toUpperCase(),
      symbol: formData.symbol.toUpperCase(),
      amount: parseFloat(formData.amount),
      price: parseFloat(formData.price),
      buyPrice: parseFloat(formData.buyPrice),
      change24h: 0 // This would come from API in real app
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Holding</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Symbol
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={e => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="any"
              value={formData.amount}
              onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Current Price
            </label>
            <input
              type="number"
              step="any"
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Buy Price
            </label>
            <input
              type="number"
              step="any"
              value={formData.buyPrice}
              onChange={e => setFormData(prev => ({ ...prev, buyPrice: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Holding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
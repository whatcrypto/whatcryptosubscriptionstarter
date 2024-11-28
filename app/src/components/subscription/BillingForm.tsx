import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';

interface Props {
  onSubmit: (data: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    name: string;
  }) => void;
  isLoading?: boolean;
}

export function BillingForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.cardNumber}
            onChange={e => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="4242 4242 4242 4242"
            required
          />
          <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MM/YY"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            CVC
          </label>
          <input
            type="text"
            value={formData.cvc}
            onChange={e => setFormData(prev => ({ ...prev, cvc: e.target.value }))}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </form>
  );
}
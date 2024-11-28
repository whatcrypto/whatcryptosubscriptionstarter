import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface SubscriptionModalProps {
  onClose: () => void;
}

export function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const { subscribe } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'pro' | 'elite') => {
    try {
      setLoading(true);
      setError(null);
      await subscribe(plan);
      onClose();
    } catch (err) {
      setError('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#151C2C] rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Complete Subscription</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleSubscribe('pro')}
            disabled={loading}
            className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Subscribe to Pro Plan'}
          </button>
          
          <button
            onClick={() => handleSubscribe('elite')}
            disabled={loading}
            className="w-full p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Subscribe to Elite Plan'}
          </button>
        </div>

        <p className="mt-6 text-sm text-slate-400 text-center">
          By subscribing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
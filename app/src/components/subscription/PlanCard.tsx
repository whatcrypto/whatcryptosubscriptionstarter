import React from 'react';
import { Check } from 'lucide-react';
import type { SubscriptionPlan } from '../../context/SubscriptionContext';

interface Props {
  plan: SubscriptionPlan;
  isActive?: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
}

export function PlanCard({ plan, isActive, onSelect }: Props) {
  return (
    <div 
      className={`p-6 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-500/10 ring-2 ring-blue-500'
          : 'bg-[#151C2C] hover:bg-[#1A2235]'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">${plan.price}</span>
            <span className="text-slate-400">/{plan.interval}</span>
          </div>
        </div>

        <div className="flex-grow">
          <ul className="space-y-4">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500/20">
                  <Check className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onSelect(plan)}
          className={`w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors ${
            isActive
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {isActive ? 'Current Plan' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
}
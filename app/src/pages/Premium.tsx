import React, { useState } from 'react';
import { Shield, Zap, Trophy, Check, ArrowRight, Lock } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { SubscriptionModal } from '../components/subscription/SubscriptionModal';

const Premium: React.FC = () => {
  const { currentPlan } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Premium Analysis",
      description: "Access to advanced technical analysis, AI predictions, and expert insights"
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Instant notifications for price movements, pattern formations, and market opportunities"
    },
    {
      icon: Trophy,
      title: "Portfolio Management",
      description: "Advanced portfolio tracking, rebalancing suggestions, and performance analytics"
    }
  ];

  const plans = [
    {
      name: "Pro",
      price: 29,
      interval: "month",
      description: "Perfect for active traders",
      features: [
        "Real-time market alerts",
        "Advanced technical analysis",
        "Portfolio tracking",
        "Priority support"
      ]
    },
    {
      name: "Elite",
      price: 49,
      interval: "month",
      description: "For serious crypto investors",
      features: [
        "All Pro features",
        "AI-powered predictions",
        "Custom alerts",
        "API access",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Upgrade to Premium
        </h1>
        <p className="text-xl text-slate-400">
          Get access to exclusive features and premium content
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-[#151C2C] p-6 rounded-xl"
          >
            <div className="inline-flex p-3 rounded-full bg-blue-500/20 text-blue-400 mb-4">
              <feature.icon className="h-6 w-6" />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-[#151C2C] rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              {plan.name}
            </h3>
            <p className="text-slate-400 mb-4">
              {plan.description}
            </p>
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-white">
                ${plan.price}
              </span>
              <span className="ml-2 text-slate-400">
                /{plan.interval}
              </span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-[#151C2C] rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6">
          {[
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, debit cards, and cryptocurrency payments."
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
            },
            {
              question: "Is there a free trial?",
              answer: "We offer a 7-day free trial for new users to test our premium features."
            },
            {
              question: "What's included in the Elite plan?",
              answer: "The Elite plan includes all Pro features plus AI-powered predictions, custom alerts, API access, and a dedicated account manager."
            }
          ].map((item) => (
            <div key={item.question} className="p-6 bg-slate-800/50 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.question}
              </h3>
              <p className="text-slate-400">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#151C2C] rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex p-3 rounded-full bg-blue-500/20 text-blue-400">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Ready to unlock premium features?
          </h2>
          <p className="text-slate-400">
            Join thousands of traders who have already upgraded to premium for advanced insights and features.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Upgrade Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Subscription Modal */}
      {showModal && (
        <SubscriptionModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Premium;
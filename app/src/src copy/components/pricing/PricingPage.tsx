import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { BottomNav } from '../dashboard/BottomNav';

export function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: '$9',
      description: 'Essential tools for crypto investors',
      features: [
        'Basic portfolio tracking',
        'Market data & signals',
        'Limited coin analysis',
        'Email support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'Advanced features for serious traders',
      features: [
        'Everything in Basic',
        'Advanced technical analysis',
        'Real-time market insights',
        'Custom portfolio strategies',
        'Priority support',
        'API access',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      description: 'Custom solutions for institutions',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced API features',
        'Custom reporting',
        'SLA guarantees',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-16 max-w-6xl pb-24 xl:pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-content mb-4">
            Choose Your Plan
          </h1>
          <p className="text-content-secondary text-lg max-w-2xl mx-auto">
            Get access to professional portfolio strategies and expert market insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 bg-card rounded-xl border ${
                plan.popular ? 'border-accent' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-content mb-2">{plan.name}</h3>
                <p className="text-content-secondary mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-content">{plan.price}</span>
                  <span className="text-content-secondary">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-content-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  plan.popular
                    ? 'bg-accent text-accent-foreground hover:bg-accent-secondary'
                    : 'bg-card-secondary text-content hover:bg-card-hover'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-content-secondary mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="text-content-secondary hover:text-content transition-colors"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
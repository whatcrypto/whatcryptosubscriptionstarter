import React from 'react';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { HeroSection } from './HeroSection';
import { SignalsList } from './SignalsList';
import { FeatureList } from './FeatureList';
import { CTASection } from './CTASection';

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto max-w-2xl px-4 flex flex-col pb-24 xl:pb-8">
        <HeroSection />
        <SignalsList />
        <FeatureList />
        <CTASection />
      </main>
    </div>
  );
}
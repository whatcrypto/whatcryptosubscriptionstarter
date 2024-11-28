import React from 'react';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { BottomNav } from '../dashboard/BottomNav';

export function PortfoliosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-3xl pb-24 xl:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
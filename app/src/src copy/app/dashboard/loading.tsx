import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BottomNav } from '@/components/dashboard/BottomNav';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-3xl pb-24 xl:pb-8">
        <div className="bg-card rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-7 w-48 bg-card-secondary rounded-lg" />
              <div className="h-5 w-32 bg-card-secondary rounded-lg mt-2" />
            </div>
            <div className="h-10 w-24 bg-card-secondary rounded-lg" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-card-secondary rounded-lg" />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 animate-pulse">
          <div className="h-7 w-48 bg-card-secondary rounded-lg mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-card-secondary rounded-lg" />
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
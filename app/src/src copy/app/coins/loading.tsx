import React from 'react';
import { PortfoliosLayout } from '@/components/portfolios/PortfoliosLayout';

export default function CoinsLoading() {
  return (
    <PortfoliosLayout>
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-card-secondary rounded-lg" />
            <div className="h-4 w-64 bg-card-secondary rounded-lg mt-2" />
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <div className="h-10 w-full sm:w-64 bg-card-secondary rounded-lg" />
          </div>
        </div>

        <div className="bg-card rounded-xl overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-card-secondary rounded-lg" />
                  <div>
                    <div className="h-5 w-32 bg-card-secondary rounded-lg" />
                    <div className="h-4 w-24 bg-card-secondary rounded-lg mt-2" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-6 w-24 bg-card-secondary rounded-lg" />
                  <div className="h-6 w-20 bg-card-secondary rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortfoliosLayout>
  );
}
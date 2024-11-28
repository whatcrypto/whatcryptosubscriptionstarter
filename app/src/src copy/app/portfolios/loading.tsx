import React from 'react';
import { PortfoliosLayout } from '@/components/portfolios/PortfoliosLayout';

export default function PortfoliosLoading() {
  return (
    <PortfoliosLayout>
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col gap-4">
          <div>
            <div className="h-8 w-48 bg-card-secondary rounded-lg" />
            <div className="h-4 w-64 bg-card-secondary rounded-lg mt-2" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-12 w-full bg-card-secondary rounded-lg" />
            <div className="h-12 w-full bg-card-secondary rounded-lg" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-card-secondary rounded-lg" />
                  <div className="flex-1">
                    <div className="h-6 w-48 bg-card-secondary rounded-lg" />
                    <div className="h-4 w-64 bg-card-secondary rounded-lg mt-2" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-card-secondary rounded-lg" />
                  <div className="h-20 bg-card-secondary rounded-lg" />
                  <div className="h-20 bg-card-secondary rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortfoliosLayout>
  );
}
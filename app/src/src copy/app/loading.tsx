import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-content-secondary">Loading...</p>
      </div>
    </div>
  );
}
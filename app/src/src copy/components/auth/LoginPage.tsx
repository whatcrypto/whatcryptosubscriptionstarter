'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

export function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - replace with actual auth
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <TrendingUp className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-content">WhatCrypto</span>
          </Link>
          <h1 className="text-2xl font-bold text-content mb-2">Welcome back</h1>
          <p className="text-content-secondary">
            Log in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-content mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-content mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-border text-accent" />
              <span className="text-sm text-content-secondary">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-accent hover:text-accent-secondary">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent-secondary transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="mt-8 text-center text-content-secondary">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent hover:text-accent-secondary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
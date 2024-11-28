'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

export function SignupPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - replace with actual auth
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
          <h1 className="text-2xl font-bold text-content mb-2">Create your account</h1>
          <p className="text-content-secondary">
            Start your 14-day free trial, no credit card required
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-content mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                required
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-content mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                required
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-content mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="john@example.com"
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
              minLength={8}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Create a strong password"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 rounded border-border text-accent"
            />
            <label htmlFor="terms" className="text-sm text-content-secondary">
              I agree to the{' '}
              <Link href="/terms" className="text-accent hover:text-accent-secondary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-accent hover:text-accent-secondary">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent-secondary transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-content-secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent-secondary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
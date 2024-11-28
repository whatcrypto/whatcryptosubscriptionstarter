'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  CoinsIcon,
  Settings,
  Bell,
} from 'lucide-react';
import

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Model Portfolios', href: '/portfolios', icon: TrendingUp },
    { name: 'Coin Analysis', href: '/coins', icon: CoinsIcon },
    { name: 'Pricing', href: '/pricing', icon: Settings },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-content-secondary hover:text-content transition-colors xl:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } xl:block absolute right-0 top-12 w-64 xl:w-auto xl:static bg-card xl:bg-transparent rounded-lg shadow-lg xl:shadow-none z-50`}
      >
        <div className="p-4 xl:p-0 space-y-2 xl:space-y-0 xl:flex xl:items-center xl:space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-content bg-card-secondary xl:bg-card'
                    : 'text-content-secondary hover:text-content hover:bg-card-secondary xl:hover:bg-card'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="xl:ml-6 flex items-center gap-2 pt-4 xl:pt-0 border-t xl:border-t-0 border-border">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-content-secondary hover:text-content transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent-secondary transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

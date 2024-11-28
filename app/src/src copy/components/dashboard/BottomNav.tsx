import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, CoinsIcon, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Portfolios', href: '/portfolios', icon: TrendingUp },
    { name: 'Coins', href: '/coins', icon: CoinsIcon },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border xl:hidden z-50">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-3 ${
                isActive ? 'text-accent' : 'text-content-secondary hover:text-content'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
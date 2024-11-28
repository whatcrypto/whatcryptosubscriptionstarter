import { Metadata } from 'next';
import Footer from '@/app/components/ui/Footer';
import Navbar from '@/app/components/ui/Navbar';
import { Toaster } from '@/app/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/app/utils/helpers';
import 'styles/main.css';





export const metadata: Metadata = {
  title: 'WhatCrypto - Cryptocurrency Dashboard',
  description: 'Track and analyze cryptocurrency prices, trends, and your portfolio in real-time',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="relative min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container max-w-screen-2xl mx-auto px-4 py-6">
              {children}
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';



import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WhatCrypto - Crypto Portfolio & Analysis',
  description: 'Professional crypto portfolio management and market analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
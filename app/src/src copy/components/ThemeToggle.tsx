"use client";

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeContext } from '@/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-content-secondary hover:text-content transition-colors rounded-lg hover:bg-card"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
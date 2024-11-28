import React from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Here you would implement actual theme switching logic
  };

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-slate-400" />
      ) : (
        <Sun className="h-5 w-5 text-slate-400" />
      )}
    </button>
  );
}
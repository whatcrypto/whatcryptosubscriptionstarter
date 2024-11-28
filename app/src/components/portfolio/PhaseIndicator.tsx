import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  phase: string;
  isDarkMode?: boolean;
}

const PhaseIndicator: React.FC<Props> = ({ phase, isDarkMode }) => {
  const getPhaseColor = () => {
    switch (phase.toLowerCase()) {
      case 'accumulation':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'markup':
      case 'breakout':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'distribution':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'decline':
      case 'correction':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getPhaseIcon = () => {
    switch (phase.toLowerCase()) {
      case 'accumulation':
      case 'markup':
      case 'breakout':
        return <TrendingUp className="w-4 h-4" />;
      case 'distribution':
      case 'decline':
      case 'correction':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${getPhaseColor()}`}>
      {getPhaseIcon()}
      <span className="text-sm font-medium">{phase}</span>
    </div>
  );
};

export default PhaseIndicator;
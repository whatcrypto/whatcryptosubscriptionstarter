import React from 'react';

interface Props {
  grade: 'buy' | 'sell' | 'hold';
  color: 'green' | 'red' | 'yellow';
  isDarkMode?: boolean;
}

const CategoryBadge: React.FC<Props> = ({ grade, color, isDarkMode }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      case 'red':
        return isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      case 'yellow':
        return isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses()}`}>
      {grade.toUpperCase()}
    </span>
  );
};

export default CategoryBadge;
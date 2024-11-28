import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { PortfolioHolding } from '../../context/PortfolioContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  holdings: PortfolioHolding[];
}

export function PortfolioComposition({ holdings }: Props) {
  const colors = [
    'rgb(99, 102, 241)',   // Indigo
    'rgb(139, 92, 246)',   // Purple
    'rgb(236, 72, 153)',   // Pink
    'rgb(244, 63, 94)',    // Rose
    'rgb(249, 115, 22)',   // Orange
    'rgb(234, 179, 8)',    // Yellow
    'rgb(34, 197, 94)',    // Green
    'rgb(20, 184, 166)',   // Teal
    'rgb(6, 182, 212)',    // Cyan
    'rgb(59, 130, 246)',   // Blue
  ];

  const data = {
    labels: holdings.map(h => h.symbol),
    datasets: [
      {
        data: holdings.map(h => h.allocation),
        backgroundColor: colors,
        borderColor: 'transparent',
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#fff',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.label}: ${value.toFixed(2)}%`;
          }
        }
      }
    },
    cutout: '65%'
  };

  return (
    <div className="bg-[#151C2C] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Portfolio Composition</h2>
      <div className="h-[300px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
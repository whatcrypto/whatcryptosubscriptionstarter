import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: {
    date: string;
    value: number;
  }[];
}

export function PortfolioPerformance({ data }: Props) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Portfolio Value',
        data: data.map(d => d.value),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `$${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          callback: (value: number) => `$${value.toLocaleString()}`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="bg-[#151C2C] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Performance</h2>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
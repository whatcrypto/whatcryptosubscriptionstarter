import React from 'react';
import { determineMarketPhase } from '../utils/marketCycle';

const MoneyFlowCycle: React.FC = () => {
  const currentPhase = determineMarketPhase();
  
  const phases = [
    {
      name: "Accumulation",
      color: "bg-green-500",
      active: true,
    },
    {
      name: "Mark Up",
      color: "bg-blue-500",
      active: false,
    },
    {
      name: "Distribution",
      color: "bg-yellow-500",
      active: false,
    },
    {
      name: "Mark Down",
      color: "bg-red-500",
      active: false,
    },
  ];
  
  return (
    <div className="bg-[#151C2C] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Money Flow Cycle</h2>
      <div className="relative">
        <div className="w-full max-w-[400px] h-[400px] mx-auto relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1E293B"
              strokeWidth="10"
            />
            
            {/* Active segment */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="10"
              strokeDasharray="94.2477796076938 188.49555921538757"
              strokeDashoffset={-94.2477796076938 * getPhaseIndex()}
            />

            {/* Phase markers */}
            {phases.map((phase, index) => {
              const angle = (index * 120) * (Math.PI / 180);
              const x = 50 + 45 * Math.cos(angle);
              const y = 50 + 45 * Math.sin(angle);
              
              return (
                <g key={phase.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    className={currentPhase === phase.id ? 'fill-blue-500' : 'fill-slate-600'}
                  />
                  <text
                    x={x}
                    y={y}
                    dy={-15}
                    fill={currentPhase === phase.id ? '#60A5FA' : '#64748B'}
                    fontSize="4"
                    textAnchor="middle"
                    className="font-medium"
                  >
                    {phase.label}
                  </text>
                </g>
              );
            })}

            {/* Center text */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dy="2"
              fill="#60A5FA"
              fontSize="6"
              className="font-bold"
            >
              Current Phase
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MoneyFlowCycle;
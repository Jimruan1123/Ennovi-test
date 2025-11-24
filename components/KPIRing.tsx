
import React from 'react';
import { KPI } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface KPIRingProps {
  kpi: KPI;
  onClick: (id: string) => void;
  isActive: boolean;
}

export const KPIRing: React.FC<KPIRingProps> = ({ kpi, onClick, isActive }) => {
  const data = [
    { name: 'Value', value: kpi.value },
    { name: 'Remaining', value: 100 - kpi.value },
  ];

  const getColor = () => {
    switch (kpi.status) {
      case 'critical': return '#ef4444'; // red
      case 'warning': return '#f97316'; // orange
      default: return '#22c55e'; // green
    }
  };

  const color = getColor();

  return (
    <div 
      onClick={() => onClick(kpi.id)}
      className={`
        glass-panel relative flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-300 rounded-xl border
        ${isActive 
          ? 'bg-yellow-400/5 border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]' 
          : 'border-white/10 hover:border-white/30 hover:bg-white/5'
        }
      `}
    >
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              cornerRadius={3}
              paddingAngle={2}
            >
              <Cell fill={color} />
              <Cell fill="rgba(255,255,255,0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-xl md:text-2xl font-bold font-mono tracking-tighter ${kpi.status === 'critical' ? 'text-neon-red animate-pulse' : 'text-white'}`}>
            {kpi.value}<span className="text-[10px] align-top opacity-70 ml-0.5">{kpi.unit}</span>
          </span>
        </div>
      </div>

      {/* Status Footer */}
      <div className="flex flex-col items-center mt-1 gap-1 text-center w-full">
        <span className="text-[10px] text-gray-200 font-bold uppercase tracking-wider truncate px-1 max-w-full">{kpi.label}</span>
        <div className="flex items-center gap-1 opacity-70">
           {kpi.responsible && <img src={kpi.responsible} alt="Owner" className="w-4 h-4 rounded-full border border-gray-500" />}
           {!kpi.responsible && <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-600"></div>}
           <span className="text-[8px] text-gray-400 font-mono">OWNER</span>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { ProductionLine, Status } from '../types';
import { AlertTriangle, Wrench, CheckCircle, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FactoryMapProps {
  lines: ProductionLine[];
  onLineClick: (id: string) => void;
  activeLineId: string | null;
}

// Simple Wireframe Reuse for Main Dashboard
const MiniWireframe = () => (
   <svg viewBox="0 0 50 30" className="w-full h-full opacity-50" fill="none" stroke="#facc15" strokeWidth="1">
      <path d="M5 15 L45 15" />
      <rect x="15" y="10" width="20" height="10" />
      <circle cx="10" cy="15" r="2" />
      <circle cx="40" cy="15" r="2" />
   </svg>
);

export const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onLineClick, activeLineId }) => {
  const { t } = useLanguage();
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);

  const getStatusVisuals = (status: Status, isSelected: boolean) => {
    let classes = "relative flex flex-col items-center justify-center p-4 border transition-all duration-300 w-full h-full ";
    if (status === 'critical') {
      classes += "bg-neon-red/10 border-neon-red text-neon-red ";
      if (!isSelected) classes += "opacity-90 ";
    } else if (status === 'warning') {
      classes += "bg-neon-orange/10 border-neon-orange text-neon-orange ";
    } else {
      classes += "bg-neon-green/5 border-neon-green/30 text-neon-green hover:bg-neon-green/10 ";
    }
    if (isSelected) {
      classes += "ring-2 ring-white shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20 scale-[1.02] ";
    } else if (activeLineId && activeLineId !== null) {
      classes += "opacity-40 grayscale blur-[1px] scale-95 "; 
    }
    return classes;
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-[#080b12] rounded-lg border border-white/10 p-0 shadow-inner group/map">
      
      {/* LAYER 1: Background (Clipped) */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }} 
        />
        {/* Map Header */}
        <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
          <span className="text-[10px] font-mono text-neon-cyan/80 tracking-widest border border-neon-cyan/30 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">{t('digitalTwin')}</span>
          <span className="text-xs text-gray-500 font-mono mt-1">{t('northWing')}</span>
        </div>
      </div>

      {/* LAYER 2: Content (Visible Overflow) */}
      <div className="absolute inset-0 overflow-visible p-4 pt-12">
        <div className="w-full h-full grid grid-cols-2 gap-6">
        {lines.map((line) => {
          const isSelected = activeLineId === line.id;
          const isHovered = hoveredLineId === line.id;

          return (
            <div 
              key={line.id} 
              className="relative w-full h-full"
              onMouseEnter={() => setHoveredLineId(line.id)}
              onMouseLeave={() => setHoveredLineId(null)}
            >
              <button
                onClick={() => onLineClick(line.id)}
                className={`rounded-xl group ${getStatusVisuals(line.status, isSelected)}`}
              >
                {/* Animated Strip for Critical */}
                {line.status === 'critical' && (
                  <div className="absolute inset-0 w-full h-full opacity-10 rounded-xl overflow-hidden" 
                       style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ef4444 10px, #ef4444 20px)'}} 
                  />
                )}

                <div className="flex items-center gap-3 mb-2 z-10">
                  {line.status === 'critical' ? <AlertTriangle size={24} className="animate-bounce" /> : 
                   line.status === 'warning' ? <Wrench size={24} className="animate-pulse" /> : 
                   <CheckCircle size={24} />}
                  <span className="text-lg font-bold tracking-tight">{line.name}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-3xl font-mono font-light tracking-tighter">{line.oee}%</span>
                  <span className="text-[10px] uppercase opacity-70 tracking-widest">{t('efficiency')}</span>
                </div>
                
                {line.issue && (
                  <div className="absolute -bottom-3 z-20 px-4 py-1.5 bg-gray-900 border border-current rounded-full text-xs font-bold whitespace-nowrap shadow-xl flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"/>
                     {line.issue}
                  </div>
                )}
              </button>

              {/* Enhanced Hover Tooltip - Z-100 to escape everything */}
              {isHovered && line.currentProduct && (
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] w-64 bg-[#0B1120] border border-yellow-400/30 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,1)] overflow-hidden pointer-events-none animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ring-1 ring-white/10">
                    {/* Header Image replaced with Wireframe */}
                    <div className="h-24 relative bg-gray-900 border-b border-white/5">
                       <MiniWireframe />
                       <div className="absolute bottom-2 left-3 z-10">
                           <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1">
                             <Activity size={10} className="animate-pulse" /> {t('manufacturing')}
                           </div>
                           <div className="text-sm font-bold text-white leading-none mt-0.5 text-shadow">{line.currentProduct.name}</div>
                       </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="p-3 bg-[#0B1120]/95 backdrop-blur-md">
                       <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                           <span className="text-[10px] text-gray-400 font-mono uppercase">{t('partNo')}</span>
                           <span className="text-[10px] text-white font-mono">{line.currentProduct.partNumber}</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                         <div className="bg-white/5 p-2 rounded">
                           <span className="text-[9px] text-gray-500 block uppercase tracking-wide">Eff</span>
                           <span className={`text-lg font-mono font-bold ${line.currentProduct.efficiency >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                               {line.currentProduct.efficiency}%
                           </span>
                         </div>
                         
                         <div className="bg-white/5 p-2 rounded">
                           <span className="text-[9px] text-gray-500 block uppercase tracking-wide">{t('output')}</span>
                           <div className="flex items-baseline gap-1">
                             <span className="text-lg font-mono font-bold text-white">
                                 {line.currentProduct.actualOutput > 1000 ? `${(line.currentProduct.actualOutput/1000).toFixed(1)}k` : line.currentProduct.actualOutput}
                             </span>
                           </div>
                         </div>
                       </div>
                    </div>
                 </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

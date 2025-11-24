import React, { useState } from 'react';
import { ProductionLine, Status } from '../types';
import { AlertTriangle, Settings, CheckCircle, Wrench, Activity } from 'lucide-react';

interface FactoryMapProps {
  lines: ProductionLine[];
  onLineClick: (id: string) => void;
  activeLineId: string | null;
}

export const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onLineClick, activeLineId }) => {
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);

  const getStatusVisuals = (status: Status, isSelected: boolean) => {
    // Base classes
    let classes = "relative flex flex-col items-center justify-center p-4 border transition-all duration-300 w-full h-full ";
    
    // Status specific styling
    if (status === 'critical') {
      classes += "bg-neon-red/10 border-neon-red text-neon-red ";
      // Add striped background for critical errors to look like hazard tape
      if (!isSelected) classes += "opacity-90 ";
    } else if (status === 'warning') {
      classes += "bg-neon-orange/10 border-neon-orange text-neon-orange ";
    } else {
      classes += "bg-neon-green/5 border-neon-green/30 text-neon-green hover:bg-neon-green/10 ";
    }

    // Selection styling
    if (isSelected) {
      classes += "ring-2 ring-white shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20 scale-[1.02] ";
    } else if (activeLineId && activeLineId !== null) {
      classes += "opacity-40 grayscale blur-[1px] scale-95 "; // Dim others if one is selected
    }

    return classes;
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-[#080b12] rounded-lg border border-white/10 p-4 shadow-inner group/map">
      {/* Grid Background - using a separate container with overflow hidden to clip the grid but allow tooltips */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }} 
        />
      </div>

      {/* Map Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
        <span className="text-[10px] font-mono text-neon-cyan/80 tracking-widest border border-neon-cyan/30 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">DIGITAL TWIN // LVL 1</span>
        <span className="text-xs text-gray-500 font-mono mt-1">NORTH WING ASSEMBLY</span>
      </div>

      {/* Layout Container */}
      <div className="relative w-full h-full grid grid-cols-2 gap-6 pt-8 pb-2">
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
                {/* Animated Hazard Strip for Critical */}
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
                  <span className="text-[10px] uppercase opacity-70 tracking-widest">Efficiency (OEE)</span>
                </div>
                
                {line.issue && (
                  <div className="absolute -bottom-3 z-20 px-4 py-1.5 bg-gray-900 border border-current rounded-full text-xs font-bold whitespace-nowrap shadow-xl flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"/>
                     {line.issue}
                  </div>
                )}

                {/* Data Owner Avatar */}
                <div className="absolute top-3 right-3 z-10">
                   <img 
                      src={`https://picsum.photos/seed/${line.id}manager/50`} 
                      alt="Manager" 
                      className="w-8 h-8 rounded-full border-2 border-black/50 opacity-60 group-hover:opacity-100 transition-opacity"
                   />
                </div>
              </button>

              {/* Enhanced Hover Tooltip - Positioned relative to the grid cell */}
              {isHovered && line.currentProduct && (
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-64 bg-[#0B1120] border border-yellow-400/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-none animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ring-1 ring-white/10">
                    {/* Header Image */}
                    <div className="h-24 relative">
                       <img src={line.currentProduct.image} className="w-full h-full object-cover opacity-80" alt="Product" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent" />
                       <div className="absolute bottom-2 left-3 z-10">
                           <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1">
                             <Activity size={10} className="animate-pulse" /> Manufacturing
                           </div>
                           <div className="text-sm font-bold text-white leading-none mt-0.5 text-shadow">{line.currentProduct.name}</div>
                       </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="p-3 bg-[#0B1120]/95 backdrop-blur-md">
                       <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                           <span className="text-[10px] text-gray-400 font-mono uppercase">Part No.</span>
                           <span className="text-[10px] text-white font-mono">{line.currentProduct.partNumber}</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                         <div className="bg-white/5 p-2 rounded">
                           <span className="text-[9px] text-gray-500 block uppercase tracking-wide">Efficiency</span>
                           <span className={`text-lg font-mono font-bold ${line.currentProduct.efficiency >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                               {line.currentProduct.efficiency}%
                           </span>
                         </div>
                         
                         <div className="bg-white/5 p-2 rounded">
                           <span className="text-[9px] text-gray-500 block uppercase tracking-wide">Output</span>
                           <div className="flex items-baseline gap-1">
                             <span className="text-lg font-mono font-bold text-white">
                                 {line.currentProduct.actualOutput > 1000 ? `${(line.currentProduct.actualOutput/1000).toFixed(1)}k` : line.currentProduct.actualOutput}
                             </span>
                             <span className="text-[9px] text-gray-600">/ {line.currentProduct.targetOutput > 1000 ? `${(line.currentProduct.targetOutput/1000).toFixed(1)}k` : line.currentProduct.targetOutput}</span>
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
  );
};
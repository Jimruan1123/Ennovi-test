import React, { useState } from 'react';
import { ProductionLine, Status } from '../types';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_ASSETS } from '../data/staticAssets';

interface FactoryMapProps {
  lines: ProductionLine[];
  onLineClick: (id: string) => void;
  activeLineId: string | null;
}

const ProductWireframe = ({ type = 'connector' }: { type?: string }) => {
  const assetKey = `global_product_auto_v7_${type}`;
  // @ts-ignore
  const aiAsset = STATIC_ASSETS[assetKey];

  if (aiAsset) {
    return (
      <div className="w-full h-full bg-[#0B1120] relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '12px 12px'}}></div>
         <img src={aiAsset} alt={type} className="w-[75%] h-[75%] object-contain relative z-10 drop-shadow-2xl animate-in fade-in duration-500" />
      </div>
    );
  }
  return <div className="w-full h-full bg-slate-900" />;
};

const MachineSVG = ({ type, status }: { type: string, status: Status }) => {
  const commonClasses = "absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 opacity-60 group-hover:opacity-100";
  const ACCENT = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f97316' : '#22c55e';

  return (
    <svg viewBox="0 0 200 200" className={commonClasses} fill="none">
      <circle cx="100" cy="110" r="50" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="100" cy="110" r="5" fill={ACCENT} className={status !== 'normal' ? 'animate-pulse' : ''} />
      <text x="100" y="150" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold" className="uppercase font-mono">{type}</text>
    </svg>
  );
}

export const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onLineClick, activeLineId }) => {
  const { t } = useLanguage();
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);

  const getAlertStyle = (status: Status, isSelected: boolean) => {
     if (isSelected) return 'ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] z-10 bg-yellow-900/40 border-yellow-400/50';
     if (status === 'critical') return 'bg-red-950/40 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-900/50';
     if (status === 'warning') return 'bg-orange-950/40 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:bg-orange-900/50';
     return 'bg-white/5 border-white/10 hover:border-white/20';
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-[#080b12] rounded-xl border border-white/5 shadow-inner overflow-visible">
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none opacity-20">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="relative z-10 p-6 pt-14 overflow-visible">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lines.map((line, index) => {
          const isSelected = activeLineId === line.id;
          const isHovered = hoveredLineId === line.id;
          
          const assetKey = `global_asset_v7_${line.processType}`;
          // @ts-ignore
          const customImg = STATIC_ASSETS[assetKey];

          return (
            <div 
              key={line.id} 
              className="relative w-full h-44 group"
              onMouseEnter={() => setHoveredLineId(line.id)}
              onMouseLeave={() => setHoveredLineId(null)}
            >
              <button
                onClick={() => onLineClick(line.id)}
                className={`
                  w-full h-full relative rounded-2xl border transition-all duration-300 overflow-hidden
                  ${getAlertStyle(line.status, isSelected)}
                `}
              >
                {customImg ? (
                  <div className="absolute inset-0 w-full h-full p-4">
                    <img src={customImg} alt="Machine" className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <MachineSVG type={line.processType} status={line.status} />
                )}

                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-tighter ${line.status === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                     {line.id}
                   </span>
                   {line.status === 'critical' && <AlertTriangle size={14} className="text-red-500 animate-bounce" />}
                </div>

                <div className="absolute bottom-3 w-full text-center z-20">
                  <div className={`text-2xl font-mono font-black ${line.status === 'critical' ? 'text-red-500' : 'text-white'}`}>
                    {line.oee}%
                  </div>
                  <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Efficiency</div>
                </div>
              </button>

              {isHovered && line.currentProduct && (
                 <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-[100] w-56 bg-[#0B1120] border border-white/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="h-28 relative bg-gray-950 border-b border-white/5">
                       <ProductWireframe type={line.currentProduct.name} />
                    </div>
                    <div className="p-4 bg-[#0B1120]">
                       <div className="text-[10px] font-black text-white mb-1 uppercase tracking-tight truncate">{line.currentProduct.name}</div>
                       <div className="flex justify-between items-end">
                         <div className="flex flex-col">
                            <span className="text-[8px] text-gray-500 uppercase font-bold">Part No</span>
                            <span className="text-[10px] text-gray-300 font-mono">{line.currentProduct.partNumber}</span>
                         </div>
                         <div className="text-right">
                           <span className={`text-xs font-black font-mono ${line.currentProduct.efficiency >= 85 ? 'text-green-400' : 'text-red-400'}`}>
                               {line.currentProduct.efficiency}%
                           </span>
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
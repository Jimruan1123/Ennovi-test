
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

// --- 1. High-Fidelity 2.5D Product Wireframe ---
const ProductWireframe = ({ type = 'connector' }: { type?: string }) => {
  // Use STATIC_ASSETS directly for reliability
  // Key format: global_product_auto_v7_${type}
  const assetKey = `global_product_auto_v7_${type}`;
  // @ts-ignore
  const aiAsset = STATIC_ASSETS[assetKey];

  // If AI Asset exists, render image instead of SVG
  if (aiAsset) {
    return (
      <div className="w-full h-full bg-[#0B1120] relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
         <img src={aiAsset} alt={type} className="w-[80%] h-[80%] object-contain relative z-10 drop-shadow-2xl animate-in fade-in zoom-in-95 duration-500" />
         <div className="absolute top-1 right-1 px-1 py-0.5 bg-purple-500/30 border border-purple-500/50 rounded text-[8px] text-purple-200 font-bold backdrop-blur-sm">AI TWIN V7</div>
      </div>
    );
  }

  // Fallback SVG Wireframe
  const PLASTIC_TOP = "#60a5fa";
  const PLASTIC_LEFT = "#2563eb";
  const PLASTIC_RIGHT = "#1e40af";
  const GOLD_TOP = "#fef08a";
  const GOLD_LEFT = "#eab308";
  
  return (
    <div className="w-full h-full bg-[#0B1120] relative overflow-hidden group">
      <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
      <svg viewBox="0 0 200 120" className="w-full h-full p-4 drop-shadow-2xl">
         <g transform="translate(100, 75)">
            <path d="M-45 -25 L0 -45 L45 -25 L0 -5 Z" fill={PLASTIC_TOP} stroke={PLASTIC_LEFT} strokeWidth="0.5" />
            <path d="M-45 -25 L-45 25 L0 45 L0 -5 Z" fill={PLASTIC_LEFT} stroke={PLASTIC_RIGHT} strokeWidth="0.5" />
            <path d="M0 -5 L0 45 L45 25 L45 -25 Z" fill={PLASTIC_RIGHT} stroke={PLASTIC_RIGHT} strokeWidth="0.5" />
         </g>
      </svg>
    </div>
  );
};

// --- 2. High-Fidelity 2.5D Machine SVG ---
const MachineSVG = ({ type, status }: { type: string, status: Status }) => {
  const commonClasses = "absolute inset-0 w-full h-full pointer-events-none transition-all duration-500";
  const FACE_TOP = "#475569";
  const FACE_LEFT = "#334155";
  const FACE_RIGHT = "#1e293b";
  const STROKE = "#64748b";
  const ACCENT = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f97316' : '#22c55e';

  return (
    <svg viewBox="0 0 200 200" className={commonClasses} fill="none" strokeWidth="0.5">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Centering transform */}
      <g transform="translate(100, 110) scale(0.9)">
         
         {/* Common Base Platform */}
         <g transform="translate(0, 10)">
            <path d="M-60 40 L0 70 L60 40 L0 10 Z" fill={FACE_TOP} stroke={STROKE} />
            <path d="M-60 40 L-60 60 L0 90 L0 70 Z" fill={FACE_LEFT} stroke={STROKE} />
            <path d="M0 90 L60 60 L60 40 L0 70 Z" fill={FACE_RIGHT} stroke={STROKE} />
         </g>

         {/* Machine Body Fallback - simplified for brevity as usually image loads */}
         <g transform="translate(0, -10)">
             <path d="M-50 25 L-30 35 L-30 -60 L-50 -70 Z" fill={FACE_LEFT} stroke={STROKE} />
             <path d="M30 35 L50 25 L50 -70 L30 -60 Z" fill={FACE_RIGHT} stroke={STROKE} />
             <circle cx="0" cy="-85" r="5" fill={ACCENT} className={status !== 'normal' ? 'animate-pulse' : ''} filter="url(#glow)" />
         </g>
      </g>
    </svg>
  );
}

export const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onLineClick, activeLineId }) => {
  const { t } = useLanguage();
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);

  // Helper to determine strong background color for alerts
  const getAlertStyle = (status: Status, isSelected: boolean) => {
     if (isSelected) return 'ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] z-10 bg-yellow-900/40';
     if (status === 'critical') return 'bg-red-900/30 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-900/50';
     if (status === 'warning') return 'bg-orange-900/30 border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:bg-orange-900/50';
     return 'bg-white/5 border-white/10 hover:border-white/30';
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-[#080b12] rounded-lg border border-white/10 shadow-inner group/map">
      
      {/* LAYER 1: Background - Absolute & Clipped */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }} 
        />
        <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
          <span className="text-[10px] font-mono text-neon-cyan/80 tracking-widest border border-neon-cyan/30 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">{t('digitalTwin')}</span>
          <span className="text-xs text-gray-500 font-mono mt-1">{t('northWing')}</span>
        </div>
      </div>

      {/* LAYER 2: Content - Relative & Overflow Visible */}
      <div className="relative z-10 p-4 pt-12 overflow-visible">
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lines.map((line, index) => {
          const isSelected = activeLineId === line.id;
          const isHovered = hoveredLineId === line.id;
          const isTopRow = index < 4; 
          
          // Use Direct Static Asset Lookup
          const assetKey = `global_asset_v7_${line.processType}`;
          // @ts-ignore
          const customImg = STATIC_ASSETS[assetKey];

          return (
            <div 
              key={line.id} 
              className="relative w-full h-40 group"
              onMouseEnter={() => setHoveredLineId(line.id)}
              onMouseLeave={() => setHoveredLineId(null)}
            >
              <button
                onClick={() => onLineClick(line.id)}
                className={`
                  w-full h-full relative rounded-xl border transition-all duration-300 overflow-hidden
                  ${getAlertStyle(line.status, isSelected)}
                `}
              >
                {/* Isometric Machine Icon OR AI Custom Asset */}
                {customImg ? (
                  <div className="absolute inset-0 w-full h-full p-2 animate-in fade-in duration-700">
                    <img src={customImg} alt="AI Twin" className="w-full h-full object-contain drop-shadow-2xl" />
                    <div className="absolute top-1 right-1 px-1 py-0.5 bg-purple-500/30 border border-purple-500/50 rounded text-[8px] text-purple-200 font-bold backdrop-blur-sm">AI V7</div>
                  </div>
                ) : (
                  <MachineSVG type={line.processType} status={line.status} />
                )}

                {/* Overlay Info */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${line.status === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                     {line.id}
                   </span>
                   {line.status === 'critical' && <AlertTriangle size={14} className="text-red-500 animate-bounce" />}
                </div>

                <div className="absolute bottom-2 w-full text-center z-20">
                  <div className={`text-2xl font-mono font-black leading-none ${line.status === 'critical' ? 'text-red-500' : line.status === 'warning' ? 'text-orange-400' : 'text-white'}`}>
                    {line.oee}%
                  </div>
                  <div className="text-[8px] text-gray-500 uppercase tracking-widest">OEE</div>
                </div>
              </button>

              {/* Hover Tooltip - Z-index 100 ensures it floats above everything */}
              {isHovered && line.currentProduct && (
                 <div 
                   className={`
                     absolute left-1/2 -translate-x-1/2 z-[100] w-48 bg-[#0B1120] border border-white/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,1)] overflow-hidden pointer-events-none animate-in fade-in zoom-in-95 duration-200
                     ${isTopRow ? 'top-full mt-2' : 'bottom-full mb-2'}
                   `}
                 >
                    {/* 3D Product Header */}
                    <div className="h-24 relative bg-gray-900 border-b border-white/5">
                       <ProductWireframe type={line.currentProduct.name} />
                    </div>

                    {/* DETECTED ISSUE ALERT INSIDE TOOLTIP */}
                    {line.status !== 'normal' && line.issue && (
                       <div className={`p-2 mb-1 mx-2 mt-2 rounded border flex items-start gap-2 ${
                          line.status === 'critical' ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-orange-900/50 border-orange-500 text-orange-200'
                       }`}>
                          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                             <span className="text-[8px] uppercase font-bold opacity-70">{t('detectedIssue')}</span>
                             <span className="text-xs font-bold leading-tight">{line.issue}</span>
                          </div>
                       </div>
                    )}
                    
                    {/* Stats */}
                    <div className="p-3 pt-1 bg-[#0B1120] relative">
                       <div className="text-xs font-bold text-white mb-1 truncate">{line.currentProduct.name}</div>
                       <div className="flex justify-between items-end">
                         <div className="flex flex-col">
                            <span className="text-[8px] text-gray-500 uppercase">{t('partNo')}</span>
                            <span className="text-[10px] text-gray-300 font-mono">{line.currentProduct.partNumber}</span>
                         </div>
                         <div className="text-right">
                           <span className={`text-sm font-mono font-bold ${line.currentProduct.efficiency >= 85 ? 'text-green-400' : 'text-red-400'}`}>
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

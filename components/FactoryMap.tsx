
import React, { useState, useEffect } from 'react';
import { ProductionLine, Status } from '../types';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FactoryMapProps {
  lines: ProductionLine[];
  onLineClick: (id: string) => void;
  activeLineId: string | null;
}

// --- 1. High-Fidelity 2.5D Product Wireframe (Synced with ProductionShopView) ---
const ProductWireframe = ({ type = 'connector' }: { type?: string }) => {
  // Material Colors
  const PLASTIC_TOP = "#60a5fa";
  const PLASTIC_LEFT = "#2563eb";
  const PLASTIC_RIGHT = "#1e40af";
  const GOLD_TOP = "#fef08a";
  const GOLD_LEFT = "#eab308";
  
  // Copper
  const COPPER_TOP = "#fcd34d";
  const COPPER_LEFT = "#d97706";
  const COPPER_RIGHT = "#92400e";

  // Silver
  const SILVER_TOP = "#e2e8f0";
  const SILVER_LEFT = "#94a3b8";
  const SILVER_RIGHT = "#475569";

  return (
    <div className="w-full h-full bg-[#0B1120] relative overflow-hidden group">
      <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
      <div className="absolute top-2 left-2 border-l border-t border-white/10 w-3 h-3"></div>
      <div className="absolute bottom-2 right-2 border-r border-b border-white/10 w-3 h-3"></div>
      
      <svg viewBox="0 0 200 120" className="w-full h-full p-4 drop-shadow-2xl">
        {type.includes('connector') || type.includes('Hsg') ? (
           <g transform="translate(100, 75)">
              <path d="M-45 -25 L0 -45 L45 -25 L0 -5 Z" fill={PLASTIC_TOP} stroke={PLASTIC_LEFT} strokeWidth="0.5" />
              <path d="M-45 -25 L-45 25 L0 45 L0 -5 Z" fill={PLASTIC_LEFT} stroke={PLASTIC_RIGHT} strokeWidth="0.5" />
              <path d="M0 -5 L0 45 L45 25 L45 -25 Z" fill={PLASTIC_RIGHT} stroke={PLASTIC_RIGHT} strokeWidth="0.5" />
              <path d="M-35 -20 L0 -35 L35 -20 L0 -5 Z" fill="#0f172a" opacity="0.6" />
              <g transform="translate(-12, -15)">
                 <rect x="0" y="0" width="4" height="12" fill={GOLD_LEFT} transform="skewY(26.5)" />
                 <path d="M0 0 L4 -2 L4 0 L0 2 Z" fill={GOLD_TOP} />
              </g>
           </g>
        ) : type.includes('Busbar') ? (
           <g transform="translate(90, 60)">
              <path d="M0 10 L40 -10 L70 5 L30 25 Z" fill={COPPER_TOP} />
              <path d="M0 10 L0 18 L30 33 L30 25 Z" fill={COPPER_LEFT} />
              <path d="M30 25 L70 5 L70 13 L30 33 Z" fill={COPPER_RIGHT} />
              <path d="M0 10 L-20 0 L-20 -50 L0 -40 Z" fill={COPPER_LEFT} />
              <path d="M-20 -50 L0 -40 L40 -60 L20 -70 Z" fill={COPPER_TOP} />
              <path d="M0 10 L40 -10 L40 -60 L0 -40 Z" fill={COPPER_RIGHT} />
           </g>
        ) : (
           <g transform="translate(100, 70)">
              <path d="M-50 -10 L-30 0 L-30 20 L-50 10 Z" fill={SILVER_LEFT} />
              <path d="M-50 -10 L-30 0 L-10 -10 L-30 -20 Z" fill={SILVER_TOP} />
              <path d="M-30 0 L-10 -10 L-10 10 L-30 20 Z" fill={SILVER_RIGHT} />
              <path d="M50 -20 L80 -5 L80 5 L50 0 Z" fill={GOLD_TOP} />
              <path d="M50 -20 L50 0 L10 0 L10 -10 Z" fill={SILVER_LEFT} /> 
           </g>
        )}
      </svg>
    </div>
  );
};

// --- 2. High-Fidelity 2.5D Machine SVG (Synced with ProductionShopView) ---
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

         {/* Machine Body */}
         {type === 'stamping' ? (
           <g transform="translate(0, -10)">
             {/* Columns */}
             <path d="M-50 25 L-30 35 L-30 -60 L-50 -70 Z" fill={FACE_LEFT} stroke={STROKE} />
             <path d="M30 35 L50 25 L50 -70 L30 -60 Z" fill={FACE_RIGHT} stroke={STROKE} />
             {/* Crown */}
             <path d="M-55 -70 L0 -95 L55 -70 L0 -45 Z" fill={FACE_TOP} stroke={STROKE} />
             <path d="M-55 -70 L-55 -40 L0 -15 L0 -45 Z" fill={FACE_LEFT} stroke={STROKE} />
             <path d="M0 -15 L55 -40 L55 -70 L0 -45 Z" fill={FACE_RIGHT} stroke={STROKE} />
             {/* Slide */}
             <path d="M-25 -40 L0 -52 L25 -40 L0 -28 Z" fill={FACE_TOP} />
             <path d="M-25 -40 L-25 0 L0 12 L0 -28 Z" fill={FACE_LEFT} stroke={STROKE} />
             <path d="M0 12 L25 0 L25 -40 L0 -28 Z" fill={FACE_RIGHT} stroke={STROKE} />
             {/* Status Light */}
             <circle cx="0" cy="-85" r="5" fill={ACCENT} className={status !== 'normal' ? 'animate-pulse' : ''} filter="url(#glow)" />
           </g>
         ) : type === 'molding' ? (
           <g transform="translate(0, 0)">
             {/* Clamping */}
             <path d="M-70 0 L-30 20 L-30 -40 L-70 -60 Z" fill={FACE_LEFT} stroke={STROKE} />
             <path d="M-70 -60 L-30 -40 L0 -55 L-40 -75 Z" fill={FACE_TOP} stroke={STROKE} />
             {/* Injection */}
             <path d="M20 -10 L70 -35 L70 -15 L20 10 Z" fill={FACE_RIGHT} stroke={STROKE} />
             {/* Hopper */}
             <path d="M40 -30 L50 -60 L65 -65 L55 -35 Z" fill={ACCENT} fillOpacity="0.8" />
             {/* Status Light */}
             <circle cx="-35" cy="-65" r="5" fill={ACCENT} className={status !== 'normal' ? 'animate-pulse' : ''} filter="url(#glow)" />
           </g>
         ) : type === 'plating' ? (
            <g transform="translate(0, -10)">
               {/* Tanks */}
               {[-30, 0, 30].map((offset, i) => (
                  <path key={i} d={`M${offset-20} ${offset*0.5+15} L${offset} ${offset*0.5+25} L${offset+20} ${offset*0.5+15} L${offset} ${offset*0.5+5} Z`} fill={i===1? ACCENT : FACE_TOP} fillOpacity={i===1?0.5:1} stroke={STROKE} />
               ))}
               {/* Gantry */}
               <path d="M-60 -40 L60 20" stroke={STROKE} strokeWidth="4" />
               <path d="M-60 60 L-60 -40" stroke={STROKE} strokeWidth="2" />
               <path d="M60 120 L60 20" stroke={STROKE} strokeWidth="2" />
               <circle cx="0" cy="-10" r="5" fill={ACCENT} className={status !== 'normal' ? 'animate-pulse' : ''} />
            </g>
         ) : (
           <g transform="translate(0, -10)">
              {/* Assembly Robot */}
              <ellipse cx="0" cy="20" rx="20" ry="10" fill={FACE_RIGHT} stroke={STROKE} />
              <path d="M0 20 L0 -30" stroke="#94a3b8" strokeWidth="6" />
              <circle cx="0" cy="-30" r="6" fill={ACCENT} />
              <path d="M0 -30 L40 -50" stroke="#94a3b8" strokeWidth="4" />
              <circle cx="40" cy="-50" r="4" fill={ACCENT} className={status !== 'normal' ? 'animate-pulse' : ''} filter="url(#glow)" />
           </g>
         )}
      </g>
    </svg>
  );
}

export const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onLineClick, activeLineId }) => {
  const { t } = useLanguage();
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [globalAssets, setGlobalAssets] = useState<Record<string, string>>({});

  // LOAD ASSETS: Check LOCAL STORAGE for GLOBAL AI ASSETS by PROCESS TYPE
  const loadAssets = () => {
    const assets: Record<string, string> = {};
    
    // Define the process types we care about
    const types = ['stamping', 'molding', 'plating', 'assembly'];
    
    types.forEach(type => {
      const cached = localStorage.getItem(`global_asset_${type}`);
      if (cached) {
        assets[type] = cached;
      }
    });
    setGlobalAssets(assets);
  };

  useEffect(() => {
    loadAssets();
    
    // Listen for Asset Updates from ProcessDrillDown
    const handleAssetUpdate = () => loadAssets();
    window.addEventListener('assetUpdated', handleAssetUpdate);
    return () => window.removeEventListener('assetUpdated', handleAssetUpdate);
  }, []);

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
          const customImg = globalAssets[line.processType]; // Use Global Asset by Type

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
                    <div className="absolute top-1 right-1 px-1 py-0.5 bg-purple-500/30 border border-purple-500/50 rounded text-[8px] text-purple-200 font-bold backdrop-blur-sm">AI V2</div>
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


import React, { useState, useEffect } from 'react';
import { ProductionLine } from '../types';
import { X, Activity, Thermometer, Gauge, RefreshCw, AlertTriangle, FileText, Image as ImageIcon, Save, Package, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface ProcessDrillDownProps {
  line: ProductionLine;
  onClose: () => void;
}

// --- SVG GENERATOR LOGIC (Fallback / Blueprint) ---
const getSchematicSVG = (line: ProductionLine) => {
  const status = line.status;
  const processType = line.processType;
  const accent = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f97316' : '#22c55e';
  const strokeColor = '#60a5fa';
  
  let machineGeometry = '';
  
  if (processType === 'stamping') {
    machineGeometry = `
      <g transform="translate(400, 280) scale(1.2)">
        <path d="M-120 40 L0 100 L120 40 L0 -20 Z" fill="rgba(30, 58, 138, 0.5)" stroke="${strokeColor}" stroke-width="2" />
        <path d="M-100 50 L-60 70 L-60 -120 L-100 -140 Z" fill="none" stroke="${strokeColor}" stroke-width="2"/>
        <path d="M30 55 L70 75 L70 -115 L30 -135 Z" fill="none" stroke="${strokeColor}" stroke-width="2"/>
        <path d="M-110 -140 L0 -195 L110 -140 L0 -85 Z" fill="rgba(30,58,138,0.8)" stroke="${strokeColor}" stroke-width="2"/>
        <path d="M-50 -80 L0 -105 L50 -80 L0 -55 Z" fill="${accent}" fill-opacity="0.3" stroke="${accent}" stroke-width="2"></path>
      </g>
    `;
  } else if (processType === 'molding') {
    machineGeometry = `
      <g transform="translate(400, 250) scale(1.1)">
         <path d="M-200 60 L0 160 L200 60 L0 -40 Z" fill="rgba(30, 58, 138, 0.5)" stroke="${strokeColor}" stroke-width="2" />
         <path d="M-180 0 L-80 50 L-80 -80 L-180 -130 Z" fill="none" stroke="${strokeColor}" stroke-width="2" />
         <path d="M20 -20 L150 -85 L150 -35 L20 30 Z" fill="none" stroke="${strokeColor}" stroke-width="2" />
         <path d="M80 -60 L100 -120 L140 -130 L120 -80 Z" fill="${accent}" fill-opacity="0.2" stroke="${accent}" />
      </g>
    `;
  } else {
    machineGeometry = `
       <g transform="translate(400, 250) scale(1.3)">
          <path d="M-200 50 L200 -150" stroke="${strokeColor}" stroke-width="40" stroke-linecap="round" opacity="0.5"/>
          <ellipse cx="0" cy="50" rx="60" ry="30" fill="none" stroke="${strokeColor}" stroke-width="2" />
          <path d="M0 50 L0 -50" stroke="${strokeColor}" stroke-width="12" />
          <path d="M0 -50 L80 -100" stroke="${strokeColor}" stroke-width="8" />
       </g>
    `;
  }

  const svgContent = `
    <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="23" patternUnits="userSpaceOnUse">
           <path d="M 40 0 L 0 0 0 23" fill="none" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1"/>
        </pattern>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <rect width="100%" height="100%" fill="url(#grid)" transform="skewY(-15)" opacity="0.5" />
      ${machineGeometry}
      <text x="30" y="474" font-family="monospace" font-size="10" fill="${strokeColor}" font-weight="bold">SCHEMATIC BLUEPRINT // REV.A</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
};

export const ProcessDrillDown: React.FC<ProcessDrillDownProps> = ({ line, onClose }) => {
  const { t } = useLanguage();
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'schematic' | 'ai'>('schematic');

  // Load history/cache - CHECK FOR GLOBAL ASSET
  useEffect(() => {
    // Check for GLOBAL asset for this process type first
    const globalAsset = localStorage.getItem(`global_asset_${line.processType}`);
    
    if (globalAsset) {
      setDisplayImage(globalAsset);
      setViewMode('ai');
    } else {
      setDisplayImage(getSchematicSVG(line));
      setViewMode('schematic');
    }
  }, [line]);

  const historyData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.random() * 100
  }));

  const handleSwitchToSchematic = () => {
    setViewMode('schematic');
    setDisplayImage(getSchematicSVG(line));
  };

  const handleSwitchToAI = () => {
    const globalAsset = localStorage.getItem(`global_asset_${line.processType}`);
    if (globalAsset) {
        setDisplayImage(globalAsset);
        setViewMode('ai');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0B1120] border border-yellow-400/30 rounded-2xl shadow-[0_0_100px_rgba(250,204,21,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">{line.name}</h2>
               <span className="px-2 py-0.5 rounded border border-yellow-400/30 text-yellow-400 text-xs font-mono">
                 {line.processType.toUpperCase()}
               </span>
            </div>
            <p className="text-sm text-gray-400 font-mono mt-1">ASSET_ID: ENV-HZ-{line.id}-001</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Telemetry Grid */}
          <div className="grid grid-cols-2 gap-4">
            {line.telemetry.map((metric, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-yellow-400/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs text-gray-400 uppercase tracking-wider">{metric.name}</span>
                   {metric.name.includes("Temp") ? <Thermometer size={14} className="text-yellow-400"/> :
                    metric.name.includes("Pressure") ? <Gauge size={14} className="text-blue-400"/> :
                    <Activity size={14} className="text-green-400"/>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-mono font-bold text-white">{metric.value}</span>
                  <span className="text-xs text-gray-500">{metric.unit}</span>
                </div>
                <div className="w-full bg-gray-800 h-1 mt-3 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-transparent to-yellow-400 w-[70%]" />
                </div>
              </div>
            ))}
            
            {/* OEE Big Card */}
            <div className="col-span-2 bg-gradient-to-r from-yellow-400/10 to-transparent p-4 rounded-xl border border-yellow-400/20 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                 <div>
                   <span className="text-xs text-yellow-400 font-bold uppercase">{t('realtimeOee')}</span>
                   <div className="text-4xl font-black text-white mt-1">{line.oee}%</div>
                 </div>
                 {/* PRODUCT INFO */}
                 {line.currentProduct && (
                   <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded border border-white/10">
                        <Package size={12} className="text-gray-400"/>
                        <span className="text-[10px] text-gray-300">{line.currentProduct.name}</span>
                      </div>
                   </div>
                 )}
               </div>
               <div className="h-16 w-full mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={historyData}>
                     <Area type="monotone" dataKey="value" stroke="#facc15" fill="#facc15" fillOpacity={0.2} strokeWidth={2} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Machine Visualization Container */}
          <div className="bg-black relative rounded-xl overflow-hidden border border-white/20 min-h-[250px] flex flex-col group">
             
             {/* Status Badge */}
             <div className="absolute top-3 left-3 z-30 flex gap-2">
                <span className={`
                  ${viewMode === 'ai' ? 'bg-purple-600' : 'bg-blue-600'} 
                  text-white text-[9px] font-bold px-2 py-0.5 rounded animate-pulse shadow-lg
                `}>
                    {viewMode === 'ai' ? 'GEMINI DIGITAL TWIN' : 'SCHEMATIC BLUEPRINT'}
                </span>
             </div>
             
             {/* Main Viewport */}
             <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
               {displayImage ? (
                   <div className="w-full h-full relative group/img animate-in fade-in duration-500">
                       <img src={displayImage} alt="Machine Visualization" className="w-full h-full object-cover" />
                       
                       {/* Overlay Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                       
                       {/* Cached Indicator */}
                       {viewMode === 'ai' && (
                         <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/20 border border-green-500/50 text-green-400 px-2 py-1 rounded text-[9px] font-bold backdrop-blur-md">
                           <Save size={10} />
                           <span>GLOBAL ASSET ACTIVE</span>
                         </div>
                       )}

                       {/* Controls Overlay */}
                       <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm border-t border-white/10 flex justify-between items-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] text-gray-400 font-mono">RENDER: {viewMode === 'ai' ? 'AI_TWIN_V4' : 'CAD_WIRE_V1'}</span>
                       </div>
                   </div>
               ) : (
                   <div className="text-gray-500 text-xs font-mono">NO VISUAL DATA</div>
               )}
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex flex-wrap justify-end gap-3">
           
           {viewMode === 'ai' ? (
             <button 
               onClick={handleSwitchToSchematic}
               className="px-4 py-2 text-sm border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded transition-all flex items-center gap-2"
             >
               <FileText size={16} />
               SHOW BLUEPRINT
             </button>
           ) : localStorage.getItem(`global_asset_${line.processType}`) ? (
             <button 
               onClick={handleSwitchToAI}
               className="px-4 py-2 text-sm border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
             >
               <ImageIcon size={16} />
               SHOW DIGITAL TWIN
             </button>
           ) : null}
          
          <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded transition-colors shadow-lg shadow-yellow-400/20">
            {t('reqMaint')}
          </button>
        </div>
      </div>
    </div>
  );
};

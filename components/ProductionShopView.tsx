

import React, { useState } from 'react';
import { ProductionLine, WorkshopData } from '../types';
import { GlassCard } from './GlassCard';
import { Hammer, Box, FlaskConical, Wrench, AlertTriangle, CheckCircle2, User, Calendar } from 'lucide-react';

interface ProductionShopViewProps {
  workshops: WorkshopData[];
}

// 1. Technical Wireframes for Product Visualization (Replaces JPGs)
const ProductWireframe = ({ type = 'connector' }: { type?: string }) => {
  return (
    <div className="w-full h-full bg-[#0B1120] relative overflow-hidden">
      {/* BluePrint Grid Background */}
      <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
      
      <svg viewBox="0 0 100 60" className="w-full h-full p-2">
        {type.includes('connector') || type.includes('Hsg') ? (
          <g stroke="#3b82f6" fill="none" strokeWidth="1">
            {/* Connector Housing Body */}
            <path d="M10 10 L30 10 L35 15 L85 15 L90 20 L90 40 L85 45 L35 45 L30 50 L10 50 Z" fill="#3b82f6" fillOpacity="0.1" />
            <rect x="15" y="20" width="10" height="20" />
            {/* Pins */}
            <line x1="90" y1="25" x2="95" y2="25" stroke="#facc15" strokeWidth="2" />
            <line x1="90" y1="35" x2="95" y2="35" stroke="#facc15" strokeWidth="2" />
            {/* Internal Detail */}
            <rect x="40" y="22" width="40" height="16" strokeDasharray="2 2" strokeOpacity="0.5" />
          </g>
        ) : type.includes('Busbar') ? (
          <g stroke="#facc15" fill="none" strokeWidth="1.5">
            {/* Busbar Shape */}
            <path d="M5 45 L20 45 L30 20 L70 20 L80 45 L95 45" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="45" r="3" />
            <circle cx="88" cy="45" r="3" />
            {/* Dimensions */}
            <path d="M30 15 L70 15" stroke="white" strokeOpacity="0.3" strokeWidth="0.5" markerEnd="url(#arrow)" />
          </g>
        ) : (
          <g stroke="#22c55e" fill="none" strokeWidth="1">
            {/* Terminal Shape */}
            <path d="M10 30 L30 30 L40 20 L60 20 L70 30 L90 30" />
            <rect x="40" y="25" width="20" height="10" fill="#22c55e" fillOpacity="0.1" />
            {/* Crimps */}
            <path d="M15 25 L15 35 M25 25 L25 35" stroke="white" strokeOpacity="0.5" />
          </g>
        )}
      </svg>
      <div className="absolute bottom-1 right-2 text-[8px] font-mono text-blue-500/50">CAD-VIEW-04</div>
    </div>
  );
};

// 2. Machine SVG Paths - Technical Wireframe Style
const MachineSVG = ({ type }: { type: string }) => {
  const commonClasses = "absolute inset-0 w-full h-full text-white/10 pointer-events-none stroke-current";
  
  switch(type) {
    case 'stamping': 
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
          <path d="M25 85 L25 15 L75 15 L75 85" />
          <path d="M15 85 L85 85" strokeWidth="2" />
          <rect x="35" y="30" width="30" height="25" />
          <path d="M50 30 L50 15" />
          <path d="M35 85 L35 75 L65 75 L65 85" />
        </svg>
      );
    case 'molding': 
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
          <rect x="15" y="35" width="25" height="30" rx="2" />
          <path d="M40 40 L60 40 M40 60 L60 60" />
          <rect x="60" y="42" width="30" height="16" />
          <path d="M70 42 L65 25 L85 25 L80 42" />
          <path d="M15 65 L15 75 L90 75 L90 58" strokeOpacity="0.5" />
        </svg>
      );
    case 'plating': 
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
          <path d="M10 20 L90 20" strokeWidth="2" />
          <rect x="40" y="15" width="10" height="10" /> 
          <rect x="35" y="45" width="20" height="10" /> 
          <path d="M15 60 L15 80 L35 80 L35 60" />
          <path d="M40 60 L40 80 L60 80 L60 60" />
          <path d="M65 60 L65 80 L85 80 L85 60" />
        </svg>
      );
    default: 
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
           <path d="M10 75 L90 75" strokeWidth="2" />
           <rect x="35" y="75" width="30" height="10" />
           <path d="M50 75 L50 55 L70 40 L70 30" />
           <path d="M67 30 L73 30 M67 30 L65 35 M73 30 L75 35" />
        </svg>
      );
  }
};

export const ProductionShopView: React.FC<ProductionShopViewProps> = ({ workshops }) => {
  const [activeShopId, setActiveShopId] = useState(workshops[0].id);
  const currentShop = workshops.find(w => w.id === activeShopId) || workshops[0];
  const [hoveredLine, setHoveredLine] = useState<ProductionLine | null>(null);
  const [hoveredSQDCIP, setHoveredSQDCIP] = useState<{key: string, status: string} | null>(null);

  // SQDCIP Helpers
  const getSQDCIPInfo = (key: string, status: string) => {
    const map: any = {
      'S': { title: 'Safety', error: 'Minor hand injury reported', days: [1,1,1,1,1,1,0] },
      'Q': { title: 'Quality', error: 'FPY dropped below 98%', days: [1,1,0,0,1,1,1] },
      'D': { title: 'Delivery', error: 'Shipment delayed (Logistics)', days: [1,1,1,1,0,1,1] },
      'C': { title: 'Cost', error: 'Scrap cost exceeded budget', days: [1,0,1,1,1,1,1] },
      'I': { title: 'Inventory', error: 'Resin stock critical low', days: [1,1,1,1,1,0,0] },
      'P': { title: 'People', error: 'Unexpected absenteeism > 5%', days: [1,1,1,0,1,1,1] },
    };
    return map[key] || { title: key, error: 'Unknown', days: [] };
  };

  const SQDCIPBadge = ({ label, status }: { label: string, status: string }) => (
    <div 
      className={`
        relative flex flex-col items-center justify-center w-12 h-14 rounded-lg border transition-all duration-300 cursor-help group/badge
        ${status === 'normal' ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' :
          status === 'warning' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20' :
          'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:bg-red-500/30'}
      `}
      onMouseEnter={() => setHoveredSQDCIP({key: label, status})}
      onMouseLeave={() => setHoveredSQDCIP(null)}
    >
      <span className="text-lg font-black">{label}</span>
      <div className={`w-2 h-2 rounded-full mt-1 ${
        status === 'normal' ? 'bg-green-500' : status === 'warning' ? 'bg-orange-500' : 'bg-red-500 animate-pulse'
      }`} />
      
      {/* Absolute Tooltip - Z-index 100 to float above everything */}
      {hoveredSQDCIP?.key === label && (
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 bg-gray-900 border border-white/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 pointer-events-none animate-in fade-in zoom-in-95 duration-200 z-[100]">
           <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-l border-t border-white/20 rotate-45" />
           <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2 relative z-10">
              <span className={`font-bold text-sm ${status === 'normal' ? 'text-green-400' : 'text-red-400'}`}>
                 {getSQDCIPInfo(label, status).title} Status
              </span>
              <span className="ml-auto text-[10px] bg-white/10 px-1.5 rounded">{status.toUpperCase()}</span>
           </div>
           
           {status !== 'normal' ? (
             <div className="mb-3 relative z-10">
               <div className="text-xs text-red-300 flex items-start gap-1.5 bg-red-900/20 p-2 rounded border border-red-500/20">
                 <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                 {getSQDCIPInfo(label, status).error}
               </div>
             </div>
           ) : (
             <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 relative z-10">
               <CheckCircle2 size={12} className="text-green-500" /> System functioning normally.
             </div>
           )}

           <div className="relative z-10">
             <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
               <Calendar size={10} /> 7-Day History
             </div>
             <div className="flex justify-between gap-1">
                {getSQDCIPInfo(label, status).days.map((val: number, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                     <div className={`w-full h-1.5 rounded-full ${
                        status === 'normal' ? 'bg-green-500' : (val === 1 ? 'bg-green-500/50' : 'bg-red-500')
                     }`} />
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );

  const getIcon = (type: string) => {
    switch(type) {
      case 'stamping': return <Hammer size={20} />;
      case 'molding': return <Box size={20} />;
      case 'plating': return <FlaskConical size={20} />;
      default: return <Wrench size={20} />;
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-20 animate-in fade-in duration-500">
      
      {/* 1. Shop Selector Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2 border-b border-white/10">
        {workshops.map(shop => (
          <button
            key={shop.id}
            onClick={() => setActiveShopId(shop.id)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-t-lg transition-all border-b-2 whitespace-nowrap
              ${activeShopId === shop.id 
                ? 'bg-white/5 border-yellow-400 text-white' 
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'}
            `}
          >
            {getIcon(shop.type)}
            <span className="uppercase font-bold tracking-wider text-sm">{shop.name}</span>
            {shop.sqdcip.q === 'critical' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-full">
        
        {/* 2. Left Column: Status & Map (8 Cols) */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          
          {/* SQDCIP Dashboard - Explicitly visible overflow */}
          <GlassCard className="p-4 flex flex-wrap justify-between items-center gap-4 bg-black/40 !overflow-visible relative z-20">
             <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Shop Status</span>
                <span className="text-xl font-bold text-white uppercase">{currentShop.name} Performance</span>
             </div>
             <div className="flex gap-2 relative z-50">
                <SQDCIPBadge label="S" status={currentShop.sqdcip.s} />
                <SQDCIPBadge label="Q" status={currentShop.sqdcip.q} />
                <SQDCIPBadge label="D" status={currentShop.sqdcip.d} />
                <SQDCIPBadge label="C" status={currentShop.sqdcip.c} />
                <SQDCIPBadge label="I" status={currentShop.sqdcip.i} />
                <SQDCIPBadge label="P" status={currentShop.sqdcip.p} />
             </div>
          </GlassCard>

          {/* 2D Digital Twin Map - LAYERED STRUCTURE TO FIX CLIPPING */}
          <div className="relative flex-1 rounded-xl border border-white/10 min-h-[500px] shadow-inner group z-0 bg-[#0F131A]">
            
            {/* LAYER 1: Background (Clipped) */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute inset-0" 
                     style={{backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.2}} 
                />
                 {/* Simulated AGV Paths */}
                <svg className="absolute inset-0 opacity-20">
                    <path d="M 100 100 L 100 400 L 400 400" stroke="#facc15" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" />
                    <circle cx="100" cy="200" r="4" fill="#facc15" className="animate-pulse" />
                </svg>
            </div>

            {/* LAYER 2: Content (Visible Overflow) */}
            <div className="absolute inset-0 overflow-visible z-10 p-12">
               
               {/* Map Header */}
               <div className="absolute top-4 left-4 z-0 pointer-events-none">
                 <span className="text-[10px] text-yellow-400 font-mono border border-yellow-400 px-2 py-0.5 rounded">LIVE VIEW</span>
               </div>

               {/* Machines Grid */}
               <div className="grid grid-cols-4 gap-8 h-full">
               {currentShop.lines.map((line, index) => {
                 const isTopRow = index < 4; // Check if it's the first row
                 
                 return (
                 <div 
                   key={line.id}
                   className="relative group/machine"
                   onMouseEnter={() => setHoveredLine(line)}
                   onMouseLeave={() => setHoveredLine(null)}
                 >
                    {/* Machine Block */}
                    <div className={`
                      h-full w-full rounded-lg border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 relative overflow-hidden bg-black/40 backdrop-blur-sm
                      ${line.status === 'critical' ? 'bg-red-900/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                        line.status === 'warning' ? 'bg-orange-900/20 border-orange-500' :
                        'border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/10'}
                    `}>
                       {/* SVG Background */}
                       <MachineSVG type={currentShop.type} />
                       
                       {/* Info Badge */}
                       <div className="relative z-10 flex flex-col items-center">
                          {line.status === 'critical' && <AlertTriangle className="text-red-500 mb-2 animate-bounce drop-shadow-md" />}
                          {line.status === 'normal' && <div className="w-2 h-2 bg-green-500 rounded-full mb-2 shadow-[0_0_8px_#22c55e]" />}
                          
                          <span className="font-mono text-xs text-gray-300 bg-black/60 px-1 rounded backdrop-blur-md">{line.id}</span>
                          <span className="font-bold text-center text-sm text-white mt-1 drop-shadow-md">{line.name.replace(currentShop.type, '')}</span>
                          <div className="mt-2 text-xs font-mono bg-black/80 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                              OEE: <span className={line.oee < 85 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{line.oee}%</span>
                          </div>
                       </div>
                    </div>

                    {/* Hover Card (Product Info) - Z-INDEX 100 with Smart Positioning */}
                    {hoveredLine?.id === line.id && line.currentProduct && (
                       <div 
                        className={`
                          absolute left-1/2 -translate-x-1/2 z-[100] w-64 bg-gray-900 border border-white/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,1)] p-0 overflow-hidden pointer-events-none animate-in zoom-in-95 duration-200
                          ${isTopRow ? 'top-full mt-4' : '-top-36 bottom-full mb-3'}
                        `}
                       >
                          {/* Triangle indicator */}
                          {isTopRow ? (
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0B1120] border-l border-t border-white/20 rotate-45 z-20" />
                          ) : (
                             // Bottom indicator code could go here, but omitted for cleaner look on top flip
                             <div className="hidden" />
                          )}
                          
                          {/* Top: Wireframe View */}
                          <div className="h-24 bg-[#0B1120] border-b border-white/10 relative z-10">
                             <ProductWireframe type={line.currentProduct.name} />
                          </div>
                          
                          {/* Bottom: Info */}
                          <div className="p-3 bg-[#0B1120] relative z-10">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-sm">{line.currentProduct.name}</span>
                                <span className="text-[10px] text-blue-400 border border-blue-400/30 px-1 rounded">RUNNING</span>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                <div className="text-gray-500">PN: <span className="text-gray-300 font-mono">{line.currentProduct.partNumber}</span></div>
                                <div className="text-gray-500 text-right">Eff: <span className="text-green-400 font-mono">{line.currentProduct.efficiency}%</span></div>
                             </div>
                             
                             <div className="mt-2">
                                <div className="flex justify-between mb-1 text-[10px] text-gray-400 uppercase">
                                   <span>Batch Progress</span>
                                   <span>{Math.round((line.currentProduct.actualOutput / line.currentProduct.targetOutput) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                   <div className="bg-yellow-400 h-full shadow-[0_0_10px_#facc15]" style={{width: `${(line.currentProduct.actualOutput / line.currentProduct.targetOutput) * 100}%`}} />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
               )})}
               </div>
            </div>
          </div>
        </div>

        {/* 3. Right Column: Support Issues (4 Cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
           <div className="bg-[#0B1120] border-b border-yellow-400/50 p-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                 <AlertTriangle size={18} className="text-yellow-400" />
                 ISSUE TRACKER
              </h3>
              <p className="text-xs text-gray-500 mt-1">{currentShop.name} // Active Tickets</p>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[600px]">
              {currentShop.issues.length === 0 ? (
                 <div className="text-center text-gray-600 py-10">No active issues.</div>
              ) : (
                 currentShop.issues.map(issue => (
                    <div key={issue.id} className="p-3 rounded-lg bg-[#111827] border border-white/10 hover:border-yellow-400/50 transition-all shadow-lg">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider ${
                             issue.priority === 'high' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                             {issue.priority}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{issue.timeAgo}</span>
                       </div>
                       <h4 className="text-sm font-bold text-gray-100 mb-2 leading-snug">{issue.title}</h4>
                       <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <User size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-300 font-medium">{issue.owner}</span>
                          <span className="ml-auto text-[10px] font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">
                             {issue.status.toUpperCase()}
                          </span>
                       </div>
                    </div>
                 ))
              )}
           </div>
           
           <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-white">
              + Report New Incident
           </button>
        </div>
      </div>
    </div>
  );
};

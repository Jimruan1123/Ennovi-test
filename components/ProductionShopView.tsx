
import React, { useState } from 'react';
import { ProductionLine, WorkshopData, SQDCIP } from '../types';
import { GlassCard } from './GlassCard';
import { Hammer, Box, FlaskConical, Wrench, AlertTriangle, CheckCircle2, XCircle, Info, User, Calendar } from 'lucide-react';

interface ProductionShopViewProps {
  workshops: WorkshopData[];
}

// Machine SVG Paths - Technical Wireframe Style
const MachineSVG = ({ type }: { type: string }) => {
  const commonClasses = "absolute inset-0 w-full h-full text-white/10 pointer-events-none stroke-current";
  
  switch(type) {
    case 'stamping': // C-Frame Press Wireframe
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
          {/* Main Frame */}
          <path d="M25 85 L25 15 L75 15 L75 85" />
          <path d="M15 85 L85 85" strokeWidth="2" /> {/* Bed */}
          
          {/* Ram/Slide */}
          <rect x="35" y="30" width="30" height="25" />
          <path d="M50 30 L50 15" /> {/* Piston */}
          
          {/* Die Area */}
          <path d="M35 85 L35 75 L65 75 L65 85" />
          
          {/* Force Arrows */}
          <path d="M50 40 L50 50 M45 45 L50 50 L55 45" strokeOpacity="0.5" />
        </svg>
      );
    case 'molding': // Injection Machine Wireframe
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
          {/* Clamping Unit */}
          <rect x="15" y="35" width="25" height="30" rx="2" />
          <path d="M27.5 35 L27.5 65" strokeDasharray="2 2" />
          
          {/* Tie Bars */}
          <path d="M40 40 L60 40 M40 60 L60 60" />
          
          {/* Injection Unit */}
          <rect x="60" y="42" width="30" height="16" />
          <path d="M90 50 L95 50" />
          
          {/* Hopper */}
          <path d="M70 42 L65 25 L85 25 L80 42" />
          
          {/* Base */}
          <path d="M15 65 L15 75 L90 75 L90 58" strokeOpacity="0.5" />
        </svg>
      );
    case 'plating': // Tank Line Wireframe
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
          {/* Overhead Hoist/Crane */}
          <path d="M10 20 L90 20" strokeWidth="2" />
          <rect x="40" y="15" width="10" height="10" /> {/* Trolley */}
          <path d="M45 25 L45 45" strokeDasharray="2 2" /> {/* Cable */}
          <rect x="35" y="45" width="20" height="10" /> {/* Rack */}
          
          {/* Tanks */}
          <path d="M15 60 L15 80 L35 80 L35 60" />
          <path d="M40 60 L40 80 L60 80 L60 60" />
          <path d="M65 60 L65 80 L85 80 L85 60" />
          
          {/* Liquid Levels */}
          <path d="M18 68 L32 68" strokeOpacity="0.5" />
          <path d="M43 68 L57 68" strokeOpacity="0.5" />
          <path d="M68 68 L82 68" strokeOpacity="0.5" />
        </svg>
      );
    default: // Assembly Robot Wireframe
      return (
        <svg viewBox="0 0 100 100" className={commonClasses} fill="none" strokeWidth="1.5">
           {/* Conveyor Belt */}
           <path d="M10 75 L90 75" strokeWidth="2" />
           <circle cx="20" cy="75" r="3" />
           <circle cx="50" cy="75" r="3" />
           <circle cx="80" cy="75" r="3" />
           
           {/* Robot Base */}
           <rect x="35" y="75" width="30" height="10" />
           
           {/* Robot Arm Segments */}
           <path d="M50 75 L50 55" /> {/* Segment 1 */}
           <circle cx="50" cy="55" r="2" /> {/* Joint */}
           <path d="M50 55 L70 40" /> {/* Segment 2 */}
           <circle cx="70" cy="40" r="2" /> {/* Joint */}
           <path d="M70 40 L70 30" /> {/* End Effector */}
           
           {/* Gripper */}
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

  // Helper to get SQDCIP description and mock history
  const getSQDCIPInfo = (key: string, status: string) => {
    const map: any = {
      'S': { title: 'Safety', error: 'Minor hand injury reported', days: [1,1,1,1,1,1,0] }, // 1=Good, 0=Bad
      'Q': { title: 'Quality', error: 'FPY dropped below 98%', days: [1,1,0,0,1,1,1] },
      'D': { title: 'Delivery', error: 'Shipment delayed (Logistics)', days: [1,1,1,1,0,1,1] },
      'C': { title: 'Cost', error: 'Scrap cost exceeded budget', days: [1,0,1,1,1,1,1] },
      'I': { title: 'Inventory', error: 'Resin stock critical low', days: [1,1,1,1,1,0,0] },
      'P': { title: 'People', error: 'Unexpected absenteeism > 5%', days: [1,1,1,0,1,1,1] },
    };
    return map[key] || { title: key, error: 'Unknown', days: [] };
  };

  // Render SQDCIP Badge
  const SQDCIPBadge = ({ label, status }: { label: string, status: string }) => (
    <div 
      className={`
        relative flex flex-col items-center justify-center w-12 h-14 rounded-lg border transition-all duration-300 cursor-help group/badge z-10 hover:z-50
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
      
      {/* Tooltip Overlay */}
      {hoveredSQDCIP?.key === label && (
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 bg-gray-900 border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] p-4 pointer-events-none animate-in fade-in zoom-in-95 duration-200 z-[100]">
           {/* Arrow Tip */}
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
               <div className="text-[10px] text-gray-500 mt-1 text-right">Occurred: Today, 10:42 AM</div>
             </div>
           ) : (
             <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 relative z-10">
               <CheckCircle2 size={12} className="text-green-500" /> System functioning normally.
             </div>
           )}

           {/* Calendar Visual */}
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
                     <span className="text-[8px] text-gray-600 font-mono">D-{7-i}</span>
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
          
          {/* SQDCIP Dashboard - ADDED !overflow-visible to fix tooltip clipping */}
          <GlassCard className="p-4 flex flex-wrap justify-between items-center gap-4 bg-black/40 !overflow-visible relative z-20">
             <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Shop Status</span>
                <span className="text-xl font-bold text-white uppercase">{currentShop.name} Performance</span>
             </div>
             <div className="flex gap-2 relative">
                <SQDCIPBadge label="S" status={currentShop.sqdcip.s} />
                <SQDCIPBadge label="Q" status={currentShop.sqdcip.q} />
                <SQDCIPBadge label="D" status={currentShop.sqdcip.d} />
                <SQDCIPBadge label="C" status={currentShop.sqdcip.c} />
                <SQDCIPBadge label="I" status={currentShop.sqdcip.i} />
                <SQDCIPBadge label="P" status={currentShop.sqdcip.p} />
             </div>
          </GlassCard>

          {/* 2D Digital Twin Map */}
          <div className="relative flex-1 bg-[#0F131A] rounded-xl border border-white/10 overflow-hidden min-h-[500px] shadow-inner group z-0">
            {/* Grid Background */}
            <div className="absolute inset-0" 
                 style={{backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.2}} 
            />
            
            {/* Map Header */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="text-[10px] text-yellow-400 font-mono border border-yellow-400 px-2 py-0.5 rounded">LIVE VIEW</span>
            </div>

            {/* Machines Layout (Simulated Grid) */}
            <div className="absolute inset-0 p-12 grid grid-cols-4 gap-8">
               {currentShop.lines.map((line) => (
                 <div 
                   key={line.id}
                   className="relative group/machine"
                   onMouseEnter={() => setHoveredLine(line)}
                   onMouseLeave={() => setHoveredLine(null)}
                 >
                    {/* Machine Block */}
                    <div className={`
                      h-full w-full rounded-lg border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 relative overflow-hidden
                      ${line.status === 'critical' ? 'bg-red-900/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                        line.status === 'warning' ? 'bg-orange-900/20 border-orange-500' :
                        'bg-blue-900/10 border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/20'}
                    `}>
                       {/* SVG Background */}
                       <MachineSVG type={currentShop.type} />
                       
                       {/* Content Content - Elevated z-index */}
                       <div className="relative z-10 flex flex-col items-center">
                          {line.status === 'critical' && <AlertTriangle className="text-red-500 mb-2 animate-bounce drop-shadow-md" />}
                          {line.status === 'normal' && <div className="w-2 h-2 bg-green-500 rounded-full mb-2 shadow-[0_0_8px_#22c55e]" />}
                          
                          <span className="font-mono text-xs text-gray-300 bg-black/40 px-1 rounded backdrop-blur-sm">{line.id}</span>
                          <span className="font-bold text-center text-sm text-white mt-1 drop-shadow-md">{line.name.replace(currentShop.type, '')}</span>
                          <div className="mt-2 text-xs font-mono bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                              OEE: <span className={line.oee < 85 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{line.oee}%</span>
                          </div>
                       </div>
                    </div>

                    {/* Hover Card (Product Info) */}
                    {hoveredLine?.id === line.id && line.currentProduct && (
                       <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 w-64 bg-gray-900 border border-white/20 rounded-xl shadow-2xl p-0 overflow-hidden pointer-events-none animate-in zoom-in-95 duration-200">
                          <div className="h-20 bg-gray-800 relative">
                             <img src={line.currentProduct.image} className="w-full h-full object-cover opacity-60" alt="Part" />
                             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                             <div className="absolute bottom-2 left-3 font-bold text-white text-sm">{line.currentProduct.name}</div>
                          </div>
                          <div className="p-3 grid grid-cols-2 gap-2 text-xs">
                             <div className="text-gray-500">Part #: <span className="text-gray-300 font-mono block">{line.currentProduct.partNumber}</span></div>
                             <div className="text-gray-500">Efficiency: <span className="text-green-400 font-mono block">{line.currentProduct.efficiency}%</span></div>
                             <div className="col-span-2 mt-1">
                                <div className="flex justify-between mb-1 text-gray-400">
                                   <span>Progress</span>
                                   <span>{line.currentProduct.actualOutput} / {line.currentProduct.targetOutput}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                   <div className="bg-yellow-400 h-full" style={{width: `${(line.currentProduct.actualOutput / line.currentProduct.targetOutput) * 100}%`}} />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
               ))}
            </div>

            {/* Simulated AGV Paths */}
            <svg className="absolute inset-0 pointer-events-none opacity-20">
               <path d="M 100 100 L 100 400 L 400 400" stroke="#facc15" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" />
               <circle cx="100" cy="200" r="4" fill="#facc15" className="animate-pulse" />
            </svg>
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
                    <div key={issue.id} className="p-3 rounded-lg bg-black/60 border border-white/10 hover:border-white/30 transition-all shadow-lg">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider ${
                             issue.priority === 'high' ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-blue-600 text-white'
                          }`}>
                             {issue.priority}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{issue.timeAgo}</span>
                       </div>
                       <h4 className="text-sm font-bold text-white mb-2 leading-snug">{issue.title}</h4>
                       <div className="flex items-center gap-2 pt-2 border-t border-white/10">
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


import React, { useState } from 'react';
import { ProductionLine, WorkshopData } from '../types';
import { GlassCard } from './GlassCard';
import { Hammer, Box, FlaskConical, Wrench, AlertTriangle, CheckCircle2, User, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductionShopViewProps {
  workshops: WorkshopData[];
}

// 1. Technical Wireframes for Product Visualization (CAD Style)
// UPGRADED: High-Fidelity 2.5D Isometric View (No Animation)
const ProductWireframe = ({ type = 'connector' }: { type?: string }) => {
  
  // Material Color Palettes (Top / Left / Right Faces for Isometric 3D)
  
  // Engineering Plastic (Blue)
  const PLASTIC_TOP = "#60a5fa"; // blue-400
  const PLASTIC_LEFT = "#2563eb"; // blue-600
  const PLASTIC_RIGHT = "#1e40af"; // blue-800
  
  // Copper / Gold
  const COPPER_TOP = "#fcd34d"; // amber-300
  const COPPER_LEFT = "#d97706"; // amber-600
  const COPPER_RIGHT = "#92400e"; // amber-800

  // Tinned Metal / Silver
  const SILVER_TOP = "#e2e8f0"; // slate-200
  const SILVER_LEFT = "#94a3b8"; // slate-400
  const SILVER_RIGHT = "#475569"; // slate-600

  // Gold Contact
  const GOLD_TOP = "#fef08a"; // yellow-200
  const GOLD_LEFT = "#eab308"; // yellow-500

  return (
    <div className="w-full h-full bg-[#0B1120] relative overflow-hidden group">
      {/* Grid Background */}
      <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
      
      {/* Technical Decorators */}
      <div className="absolute top-2 left-2 border-l border-t border-white/10 w-3 h-3"></div>
      <div className="absolute bottom-2 right-2 border-r border-b border-white/10 w-3 h-3"></div>
      <div className="absolute top-2 right-2 text-[8px] font-mono text-gray-600">SCALE 1:1</div>

      <svg viewBox="0 0 200 120" className="w-full h-full p-4 drop-shadow-2xl">
        {type.includes('connector') || type.includes('Hsg') ? (
           <g transform="translate(100, 75)">
              {/* ISO Box: Connector Body */}
              {/* 1. Main Housing Block */}
              <path d="M-45 -25 L0 -45 L45 -25 L0 -5 Z" fill={PLASTIC_TOP} stroke={PLASTIC_LEFT} strokeWidth="0.5" /> {/* Top */}
              <path d="M-45 -25 L-45 25 L0 45 L0 -5 Z" fill={PLASTIC_LEFT} stroke={PLASTIC_RIGHT} strokeWidth="0.5" /> {/* Left */}
              <path d="M0 -5 L0 45 L45 25 L45 -25 Z" fill={PLASTIC_RIGHT} stroke={PLASTIC_RIGHT} strokeWidth="0.5" /> {/* Right */}
              
              {/* 2. Inner Cavity (Darker) */}
              <path d="M-35 -20 L0 -35 L35 -20 L0 -5 Z" fill="#0f172a" opacity="0.6" />
              
              {/* 3. Pins inside (Gold) */}
              <g transform="translate(-12, -15)">
                 <rect x="0" y="0" width="4" height="12" fill={GOLD_LEFT} transform="skewY(26.5)" />
                 <path d="M0 0 L4 -2 L4 0 L0 2 Z" fill={GOLD_TOP} />
              </g>
              <g transform="translate(8, -15)">
                 <rect x="0" y="0" width="4" height="12" fill={GOLD_LEFT} transform="skewY(26.5)" />
                 <path d="M0 0 L4 -2 L4 0 L0 2 Z" fill={GOLD_TOP} />
              </g>

              {/* 4. Mounting Flanges (Side Details) */}
              <path d="M-45 0 L-55 -5 L-55 15 L-45 20 Z" fill={PLASTIC_LEFT} />
              <path d="M-55 -5 L-45 -10 L-45 0 L-55 5 Z" fill={PLASTIC_TOP} />
              
              <path d="M45 0 L55 -5 L55 15 L45 20 Z" fill={PLASTIC_RIGHT} />
              <path d="M45 -10 L55 -5 L45 0 L35 -5 Z" fill={PLASTIC_TOP} />
           </g>
        ) : type.includes('Busbar') ? (
           <g transform="translate(90, 60)">
              {/* Copper Busbar - Bent Z-Shape */}
              {/* Segment 1 (Horizontal Bottom) */}
              <path d="M0 10 L40 -10 L70 5 L30 25 Z" fill={COPPER_TOP} />
              <path d="M0 10 L0 18 L30 33 L30 25 Z" fill={COPPER_LEFT} />
              <path d="M30 25 L70 5 L70 13 L30 33 Z" fill={COPPER_RIGHT} />

              {/* Segment 2 (Vertical Bend) */}
              <path d="M0 10 L-20 0 L-20 -50 L0 -40 Z" fill={COPPER_LEFT} />
              <path d="M-20 -50 L0 -40 L40 -60 L20 -70 Z" fill={COPPER_TOP} />
              <path d="M0 10 L40 -10 L40 -60 L0 -40 Z" fill={COPPER_RIGHT} />

              {/* Segment 3 (Top Tab) */}
              <path d="M-20 -50 L-50 -35 L-30 -25 L0 -40 Z" fill={COPPER_TOP} />
              <path d="M-50 -35 L-50 -27 L-30 -17 L-30 -25 Z" fill={COPPER_LEFT} />
              
              {/* Punched Hole */}
              <ellipse cx="50" cy="8" rx="6" ry="3.5" fill="#0f172a" transform="rotate(-26)" stroke={COPPER_RIGHT} strokeWidth="0.5" />
           </g>
        ) : (
           <g transform="translate(100, 70)">
              {/* Sensor Terminal - Complex Stamping */}
              
              {/* Rear Crimp Wings (U-Shape) */}
              <path d="M-50 -10 L-30 0 L-30 20 L-50 10 Z" fill={SILVER_LEFT} />
              <path d="M-50 -10 L-30 0 L-10 -10 L-30 -20 Z" fill={SILVER_TOP} />
              <path d="M-30 0 L-10 -10 L-10 10 L-30 20 Z" fill={SILVER_RIGHT} />

              {/* Middle Transition */}
              <path d="M-10 -10 L30 -30 L30 -10 L-10 10 Z" fill={SILVER_RIGHT} />
              <path d="M-10 -10 L30 -30 L50 -20 L10 0 Z" fill={SILVER_TOP} />
              
              {/* Front Contact (Pin) */}
              <path d="M50 -20 L80 -5 L80 5 L50 0 Z" fill={GOLD_TOP} /> {/* Gold Tip */}
              <path d="M50 -20 L50 0 L10 0 L10 -10 Z" fill={SILVER_LEFT} /> 
              <path d="M80 -5 L80 5 L50 0 Z" fill={GOLD_LEFT} /> {/* Tip Side */}

              {/* Locking Lance Detail */}
              <path d="M20 -15 L30 -10 L30 -5 L20 -10 Z" fill={SILVER_LEFT} />
           </g>
        )}
      </svg>
      <div className="absolute bottom-2 right-2 text-[8px] font-mono text-gray-500">
         {type.toUpperCase()} // REV.A
      </div>
    </div>
  );
};

// 2. Machine SVG Paths - Strict 2.5D Isometric
const MachineSVG = ({ type }: { type: string }) => {
  const commonClasses = "absolute inset-0 w-full h-full pointer-events-none transition-all duration-500";
  
  // Colors for faces to create 3D depth
  // Light direction: Top-Left
  const FACE_TOP = "#475569";   // Lightest
  const FACE_LEFT = "#334155";  // Medium
  const FACE_RIGHT = "#1e293b"; // Darkest
  const STROKE = "#64748b";
  const ACCENT = "#facc15";

  return (
    <svg viewBox="0 0 200 200" className={commonClasses} fill="none" strokeWidth="0.5">
      <defs>
        <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#475569" />
           <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {type === 'stamping' && (
        <g transform="translate(100, 100)"> {/* Center Point */}
           {/* Coordinates transformed for Isometric: x' = (x-y)*cos(30), y' = (x+y)*sin(30) - z */}
           {/* Simplified Isometric Drawing Logic manually calculated for clarity */}
           
           {/* 1. Base (Bed) */}
           <path d="M-60 50 L0 80 L60 50 L0 20 Z" fill={FACE_TOP} stroke={STROKE} /> {/* Top of Bed */}
           <path d="M-60 50 L-60 70 L0 100 L0 80 Z" fill={FACE_LEFT} stroke={STROKE} /> {/* Left Side */}
           <path d="M0 100 L60 70 L60 50 L0 80 Z" fill={FACE_RIGHT} stroke={STROKE} /> {/* Right Side */}

           {/* 2. Columns (H-Frame) */}
           {/* Left Column */}
           <path d="M-50 25 L-30 35 L-30 -60 L-50 -70 Z" fill={FACE_LEFT} stroke={STROKE} />
           <path d="M-30 35 L-10 25 L-10 -70 L-30 -60 Z" fill={FACE_RIGHT} stroke={STROKE} />
           
           {/* Right Column */}
           <path d="M10 25 L30 35 L30 -60 L10 -70 Z" fill={FACE_LEFT} stroke={STROKE} />
           <path d="M30 35 L50 25 L50 -70 L30 -60 Z" fill={FACE_RIGHT} stroke={STROKE} />

           {/* 3. Crown (Top Header) */}
           <path d="M-55 -70 L0 -95 L55 -70 L0 -45 Z" fill={FACE_TOP} stroke={STROKE} /> {/* Top */}
           <path d="M-55 -70 L-55 -40 L0 -15 L0 -45 Z" fill={FACE_LEFT} stroke={STROKE} /> {/* Front Left */}
           <path d="M0 -15 L55 -40 L55 -70 L0 -45 Z" fill={FACE_RIGHT} stroke={STROKE} /> {/* Front Right */}
           
           {/* Flywheel (Detail) */}
           <ellipse cx="40" cy="-60" rx="5" ry="10" fill={ACCENT} className="animate-[spin_2s_linear_infinite]" />

           {/* 4. Slide (Moving Part) */}
           <g className="animate-[bounce_1s_infinite]">
              <path d="M-25 -40 L0 -52 L25 -40 L0 -28 Z" fill={FACE_TOP} />
              <path d="M-25 -40 L-25 0 L0 12 L0 -28 Z" fill={FACE_LEFT} stroke={STROKE} />
              <path d="M0 12 L25 0 L25 -40 L0 -28 Z" fill={FACE_RIGHT} stroke={STROKE} />
           </g>

           {/* 5. Die Set (Yellow Zone) */}
           <path d="M-20 30 L0 40 L20 30 L0 20 Z" fill={ACCENT} fillOpacity="0.3" stroke={ACCENT} />
        </g>
      )}

      {type === 'molding' && (
        <g transform="translate(100, 110)">
           {/* 1. Base Machine Bed (Long) */}
           <path d="M-80 30 L0 70 L80 30 L0 -10 Z" fill={FACE_TOP} stroke={STROKE} />
           <path d="M-80 30 L-80 50 L0 90 L0 70 Z" fill={FACE_LEFT} stroke={STROKE} />
           <path d="M0 90 L80 50 L80 30 L0 70 Z" fill={FACE_RIGHT} stroke={STROKE} />

           {/* 2. Clamping Unit (Left - Big Box) */}
           <path d="M-70 0 L-30 20 L-30 -40 L-70 -60 Z" fill={FACE_LEFT} stroke={STROKE} /> {/* Front */}
           <path d="M-70 -60 L-30 -40 L0 -55 L-40 -75 Z" fill={FACE_TOP} stroke={STROKE} /> {/* Top */}
           <path d="M-30 20 L0 5 L0 -55 L-30 -40 Z" fill={FACE_RIGHT} stroke={STROKE} /> {/* Side */}
           
           {/* Tie Bars */}
           <line x1="-30" y1="-30" x2="10" y2="-50" stroke="#94a3b8" strokeWidth="2" />
           <line x1="-30" y1="10" x2="10" y2="-10" stroke="#94a3b8" strokeWidth="2" />

           {/* Moving Platen */}
           <path d="M-10 10 L10 0 L10 -40 L-10 -30 Z" fill={FACE_LEFT} fillOpacity="0.8" stroke={STROKE} />

           {/* 3. Injection Unit (Right - Cylinders) */}
           <path d="M20 -10 L70 -35 L70 -15 L20 10 Z" fill={FACE_RIGHT} stroke={STROKE} />
           
           {/* Hopper (Funnel) */}
           <path d="M40 -30 L50 -60 L65 -65 L55 -35 Z" fill={ACCENT} fillOpacity="0.8" />
           <ellipse cx="57" cy="-62" rx="8" ry="3" fill={ACCENT} />

           {/* Screen/Control */}
           <path d="M10 40 L20 35 L20 50 L10 55 Z" fill="#000" stroke="cyan" strokeWidth="0.5" />
        </g>
      )}

      {type === 'plating' && (
        <g transform="translate(100, 100)">
           {/* Tank Array - Multiple units */}
           {[-40, 0, 40].map((offset, i) => (
             <g key={i} transform={`translate(${offset}, ${offset * 0.5})`}>
                {/* Tank Outer */}
                <path d="M-25 15 L0 27 L25 15 L0 3 Z" fill={FACE_TOP} stroke={STROKE} />
                <path d="M-25 15 L-25 40 L0 52 L0 27 Z" fill={FACE_LEFT} stroke={STROKE} />
                <path d="M0 52 L25 40 L25 15 L0 27 Z" fill={FACE_RIGHT} stroke={STROKE} />
                
                {/* Liquid Surface */}
                <path d="M-20 15 L0 24 L20 15 L0 6 Z" fill={i === 1 ? ACCENT : "cyan"} fillOpacity="0.4" className="animate-pulse" />
             </g>
           ))}

           {/* Gantry Structure */}
           <path d="M-60 50 L-60 -50" stroke={STROKE} strokeWidth="2" /> {/* Front Left Leg */}
           <path d="M60 110 L60 10" stroke={STROKE} strokeWidth="2" /> {/* Front Right Leg */}
           <path d="M0 -80 L0 20" stroke={STROKE} strokeWidth="1" opacity="0.5" /> {/* Back Leg */}
           
           {/* Top Beam */}
           <path d="M-60 -50 L60 10" stroke={STROKE} strokeWidth="4" />
           
           {/* Hoist */}
           <g transform="translate(0, -20)">
              <rect x="-10" y="-5" width="20" height="10" fill={ACCENT} transform="skewY(26)" />
              <line x1="0" y1="5" x2="0" y2="40" stroke="white" strokeDasharray="2 2" />
              {/* Rack */}
              <path d="M-10 40 L0 45 L10 40 L0 35 Z" fill="none" stroke={ACCENT} />
           </g>
        </g>
      )}

      {type === 'assembly' && (
        <g transform="translate(100, 100)">
           {/* Conveyor Belt */}
           <path d="M-80 40 L80 -40" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />
           <path d="M-80 40 L80 -40" stroke={STROKE} strokeWidth="16" strokeDasharray="10 10" className="animate-[dash_2s_linear_infinite]" />
           
           {/* Robot Base */}
           <ellipse cx="0" cy="20" rx="20" ry="10" fill={FACE_RIGHT} stroke={STROKE} />
           
           {/* Robot Arm */}
           <path d="M0 20 L0 -30" stroke="#94a3b8" strokeWidth="6" />
           <circle cx="0" cy="-30" r="6" fill={ACCENT} />
           <path d="M0 -30 L40 -50" stroke="#94a3b8" strokeWidth="4" />
           <circle cx="40" cy="-50" r="4" fill={ACCENT} />
           <path d="M40 -50 L50 -40" stroke={ACCENT} strokeWidth="2" />
        </g>
      )}

    </svg>
  );
};

export const ProductionShopView: React.FC<ProductionShopViewProps> = ({ workshops }) => {
  const { t } = useLanguage();
  const [activeShopId, setActiveShopId] = useState(workshops[0].id);
  const currentShop = workshops.find(w => w.id === activeShopId) || workshops[0];
  const [hoveredLine, setHoveredLine] = useState<ProductionLine | null>(null);
  const [hoveredSQDCIP, setHoveredSQDCIP] = useState<{key: string, status: string} | null>(null);

  // SQDCIP Helpers
  const getSQDCIPInfo = (key: string, status: string) => {
    const map: any = {
      'S': { title: t('safety'), error: 'Minor hand injury reported', days: [1,1,1,1,1,1,0] },
      'Q': { title: t('quality_sqdcip'), error: 'FPY dropped below 98%', days: [1,1,0,0,1,1,1] },
      'D': { title: t('delivery'), error: 'Shipment delayed (Logistics)', days: [1,1,1,1,0,1,1] },
      'C': { title: t('cost'), error: 'Scrap cost exceeded budget', days: [1,0,1,1,1,1,1] },
      'I': { title: t('inventory'), error: 'Resin stock critical low', days: [1,1,1,1,1,0,0] },
      'P': { title: t('people'), error: 'Unexpected absenteeism > 5%', days: [1,1,1,0,1,1,1] },
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
      
      {/* Absolute Tooltip - Pointer events none is critical to prevent "stuck" behavior */}
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
               <CheckCircle2 size={12} className="text-green-500" /> {t('systemNormal')}
             </div>
           )}

           <div className="relative z-10">
             <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
               <Calendar size={10} /> {t('history7d')}
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
                <span className="text-xs text-gray-500 uppercase tracking-widest">{t('shopStatus')}</span>
                <span className="text-xl font-bold text-white uppercase">{currentShop.name} {t('performance')}</span>
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

          {/* 2D Digital Twin Map - REDESIGNED LAYERING FOR TOOLTIP VISIBILITY */}
          {/* FIX: Parent has z-0 and no overflow-hidden to allow tooltips to pop out */}
          <div className="relative flex-1 min-h-[500px] group z-0">
            
            {/* LAYER 1: Background & Borders (Clipped) */}
            {/* This absolute div holds the background and border, handling the clipping for rounded corners */}
            <div className="absolute inset-0 rounded-xl border border-white/10 bg-[#0F131A] overflow-hidden shadow-inner pointer-events-none">
                <div className="absolute inset-0 opacity-20" 
                     style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}} 
                />
                {/* Floor Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-blue-500/5 blur-3xl rounded-full" />
            </div>

            {/* LAYER 2: Content (Visible Overflow) */}
            {/* This layer sits on top and allows children (tooltips) to overflow the rounded boundaries */}
            <div className="absolute inset-0 p-12">
               
               {/* Map Header */}
               <div className="absolute top-4 left-4 z-0 pointer-events-none">
                 <span className="text-[10px] text-yellow-400 font-mono border border-yellow-400 px-2 py-0.5 rounded">{t('liveView')}</span>
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
                      h-full w-full flex flex-col items-center justify-end pb-8 transition-all duration-500 relative
                      ${line.status === 'critical' ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}
                    `}>
                       {/* SVG Background - 2.5D */}
                       <MachineSVG type={currentShop.type} />
                       
                       {/* Floor Reflection/Shadow */}
                       <div className="absolute bottom-4 w-2/3 h-4 bg-black/50 blur-md rounded-[100%]" />

                       {/* Status Dot Overlay */}
                       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex flex-col items-center gap-1 z-20 opacity-0 group-hover/machine:opacity-100 transition-opacity duration-300`}>
                          <span className="text-[10px] font-mono text-white whitespace-nowrap">{line.id}</span>
                          <div className={`w-2 h-2 rounded-full ${line.status === 'normal' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                       </div>

                       {/* Floating Stats (Always Visible, Tech Style) */}
                       <div className="absolute -top-2 right-0 z-20">
                          <div className={`
                            flex flex-col items-end text-[10px] font-mono px-2 py-1 rounded border-l-2 backdrop-blur-sm
                            ${line.status === 'critical' ? 'border-red-500 bg-red-900/20 text-red-200' : 'border-blue-500 bg-blue-900/10 text-blue-200'}
                          `}>
                            <span className="opacity-70">OEE</span>
                            <span className="font-bold text-xs">{line.oee}%</span>
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
                             <div className="hidden" />
                          )}
                          
                          {/* Top: Wireframe View (Updated to 3D) */}
                          <div className="h-32 bg-[#0B1120] border-b border-white/10 relative z-10">
                             <ProductWireframe type={line.currentProduct.name} />
                          </div>
                          
                          {/* Bottom: Info */}
                          <div className="p-3 bg-[#0B1120] relative z-10">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-sm">{line.currentProduct.name}</span>
                                <span className="text-[10px] text-blue-400 border border-blue-400/30 px-1 rounded">{t('running')}</span>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                <div className="text-gray-500">{t('partNo')}: <span className="text-gray-300 font-mono">{line.currentProduct.partNumber}</span></div>
                                <div className="text-gray-500 text-right">Eff: <span className="text-green-400 font-mono">{line.currentProduct.efficiency}%</span></div>
                             </div>
                             
                             <div className="mt-2">
                                <div className="flex justify-between mb-1 text-[10px] text-gray-400 uppercase">
                                   <span>{t('batchProgress')}</span>
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
                 {t('issueTracker')}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{currentShop.name} // {t('activeTickets')}</p>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[600px]">
              {currentShop.issues.length === 0 ? (
                 <div className="text-center text-gray-600 py-10">{t('noIssues')}</div>
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
              {t('reportIncident')}
           </button>
        </div>
      </div>
    </div>
  );
};

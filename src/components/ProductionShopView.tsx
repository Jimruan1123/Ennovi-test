
import React, { useState } from 'react';
import { ProductionLine, WorkshopData } from '../types';
import { GlassCard } from './GlassCard';
import { Hammer, Box, FlaskConical, Wrench, AlertTriangle, CheckCircle2, User, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_ASSETS } from '../data/staticAssets';

interface ProductionShopViewProps {
  workshops: WorkshopData[];
}

// 1. Product Wireframe with Direct Asset Lookup
const ProductWireframe = ({ type = 'connector' }: { type?: string }) => {
  const assetKey = `global_product_auto_v7_${type}`;
  // @ts-ignore
  const aiAsset = STATIC_ASSETS[assetKey];

  if (aiAsset) {
    return (
      <div className="w-full h-full bg-[#0B1120] relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
         <img src={aiAsset} alt={type} className="w-[80%] h-[80%] object-contain relative z-10 drop-shadow-2xl animate-in fade-in zoom-in-95 duration-500" />
         <div className="absolute top-1 right-1 px-1 py-0.5 bg-purple-500/30 border border-purple-500/50 rounded text-[8px] text-purple-200 font-bold backdrop-blur-sm">AI TWIN</div>
      </div>
    );
  }
  
  // SVG Fallback
  return (
    <div className="w-full h-full bg-[#0B1120] flex items-center justify-center text-xs text-gray-600">NO ASSET</div>
  );
};

// 2. Machine SVG Fallback
const MachineSVG = ({ type }: { type: string }) => {
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" fill="none">
       <circle cx="100" cy="100" r="50" stroke="#333" />
    </svg>
  );
};

export const ProductionShopView: React.FC<ProductionShopViewProps> = ({ workshops }) => {
  const { t } = useLanguage();
  const [activeShopId, setActiveShopId] = useState(workshops[0].id);
  const currentShop = workshops.find(w => w.id === activeShopId) || workshops[0];
  const [hoveredLine, setHoveredLine] = useState<ProductionLine | null>(null);
  const [hoveredSQDCIP, setHoveredSQDCIP] = useState<{key: string, status: string} | null>(null);

  // Direct Lookup
  const machineAssetKey = `global_asset_v7_${currentShop.type}`;
  // @ts-ignore
  const globalAsset = STATIC_ASSETS[machineAssetKey];

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
      <div className="flex-none shrink-0 relative z-30">
        <div className="flex gap-4 overflow-x-auto pb-4 border-b border-white/10 scrollbar-hide">
          {workshops.map(shop => (
            <button
              key={shop.id}
              onClick={() => setActiveShopId(shop.id)}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-t-lg transition-all border-b-2 whitespace-nowrap min-w-fit
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
      </div>

      <div className="grid grid-cols-12 gap-6 h-full">
        
        {/* 2. Left Column: Status & Map (8 Cols) */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          
          {/* SQDCIP Dashboard */}
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

          {/* 2D Digital Twin Map */}
          <div className="relative flex-1 min-h-[500px] group z-0">
            
            {/* LAYER 1: Background & Borders */}
            <div className="absolute inset-0 rounded-xl border border-white/10 bg-[#0F131A] overflow-hidden shadow-inner pointer-events-none">
                <div className="absolute inset-0 opacity-20" 
                     style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}} 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-blue-500/5 blur-3xl rounded-full" />
            </div>

            {/* LAYER 2: Content */}
            <div className="absolute inset-0 p-12">
               <div className="absolute top-4 left-4 z-0 pointer-events-none">
                 <span className="text-[10px] text-yellow-400 font-mono border border-yellow-400 px-2 py-0.5 rounded">{t('liveView')}</span>
               </div>

               <div className="grid grid-cols-4 gap-8 h-full">
               {currentShop.lines.map((line, index) => {
                 const isTopRow = index < 4; 
                 
                 return (
                 <div 
                   key={line.id}
                   className="relative group/machine"
                   onMouseEnter={() => setHoveredLine(line)}
                   onMouseLeave={() => setHoveredLine(null)}
                 >
                    {/* Machine Block */}
                    <div className={`
                      h-full w-full flex flex-col items-center justify-end pb-8 transition-all duration-500 relative rounded-xl overflow-hidden
                      ${line.status === 'critical' ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}
                    `}>
                       {/* SVG Background - GLOBAL AI ASSET */}
                       {globalAsset ? (
                         <div className="absolute inset-0 p-4 animate-in fade-in duration-700">
                            <img src={globalAsset} className="w-full h-full object-contain drop-shadow-2xl" alt="Machine" />
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-500/30 border border-purple-500/50 rounded text-[8px] text-purple-200 font-bold backdrop-blur-sm">AI TWIN</div>
                         </div>
                       ) : (
                         <MachineSVG type={currentShop.type} />
                       )}
                       
                       {/* Status Dot Overlay */}
                       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex flex-col items-center gap-1 z-20 opacity-0 group-hover/machine:opacity-100 transition-opacity duration-300`}>
                          <span className="text-[10px] font-mono text-white whitespace-nowrap">{line.id}</span>
                          <div className={`w-2 h-2 rounded-full ${line.status === 'normal' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                       </div>

                       {/* Floating Stats */}
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

                    {/* Hover Card */}
                    {hoveredLine?.id === line.id && line.currentProduct && (
                       <div 
                        className={`
                          absolute left-1/2 -translate-x-1/2 z-[100] w-64 bg-gray-900 border border-white/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,1)] p-0 overflow-hidden pointer-events-none animate-in zoom-in-95 duration-200
                          ${isTopRow ? 'top-full mt-4' : '-top-36 bottom-full mb-3'}
                        `}
                       >
                          {isTopRow ? (
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0B1120] border-l border-t border-white/20 rotate-45 z-20" />
                          ) : (
                             <div className="hidden" />
                          )}
                          
                          <div className="h-32 bg-[#0B1120] border-b border-white/10 relative z-10">
                             <ProductWireframe type={line.currentProduct.name} />
                          </div>
                          
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

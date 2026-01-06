import React, { useState } from 'react';
import { ProductionLine, WorkshopData } from '../types';
import { GlassCard } from './GlassCard';
import { Hammer, Box, FlaskConical, Wrench, AlertTriangle, CheckCircle2, User, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_ASSETS } from '../data/staticAssets';

interface ProductionShopViewProps {
  workshops: WorkshopData[];
}

const ProductWireframe = ({ type = 'connector' }: { type?: string }) => {
  const assetKey = `global_product_auto_v7_${type}`;
  // @ts-ignore
  const aiAsset = STATIC_ASSETS[assetKey];

  if (aiAsset) {
    return (
      <div className="w-full h-full bg-[#0B1120] relative overflow-hidden flex items-center justify-center">
         <img src={aiAsset} alt={type} className="w-[80%] h-[80%] object-contain relative z-10 drop-shadow-2xl" />
      </div>
    );
  }
  return <div className="w-full h-full bg-slate-900" />;
};

const MachineSVG = ({ type }: { type: string }) => {
  const assetKey = `global_asset_v7_${type}`;
  // @ts-ignore
  const machineImg = STATIC_ASSETS[assetKey];

  if (machineImg) {
    return <img src={machineImg} className="w-full h-full object-contain" alt={type} />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 opacity-20">
       <Wrench size={40} />
       <span className="text-[10px] font-mono mt-2 uppercase">{type}</span>
    </div>
  );
};

export const ProductionShopView: React.FC<ProductionShopViewProps> = ({ workshops }) => {
  const { t } = useLanguage();
  const [activeShopId, setActiveShopId] = useState(workshops[0]?.id || '');
  const currentShop = workshops.find(w => w.id === activeShopId) || workshops[0];
  const [hoveredLine, setHoveredLine] = useState<ProductionLine | null>(null);

  if (!currentShop) return null;

  return (
    <div className="flex flex-col gap-6 h-full pb-20 animate-in fade-in duration-500">
      
      <div className="flex-none shrink-0 relative z-30">
        <div className="flex gap-3 overflow-x-auto pb-4 border-b border-white/5 scrollbar-hide">
          {workshops.map(shop => (
            <button
              key={shop.id}
              onClick={() => setActiveShopId(shop.id)}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-2xl transition-all border whitespace-nowrap min-w-fit
                ${activeShopId === shop.id 
                  ? 'bg-yellow-400/10 border-yellow-400/40 text-white' 
                  : 'bg-transparent border-white/5 text-gray-500 hover:text-gray-300'}
              `}
            >
              <span className="uppercase font-black tracking-widest text-[10px]">{shop.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-full">
        
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <div className="relative flex-1 min-h-[550px] bg-[#0F131A] rounded-3xl border border-white/5 shadow-inner overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(45deg, #444 1px, transparent 1px), linear-gradient(-45deg, #444 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
            
            <div className="absolute inset-0 p-16">
               <div className="grid grid-cols-4 gap-12 h-full">
               {currentShop.lines.map((line) => (
                 <div 
                   key={line.id}
                   className="relative group/machine flex flex-col items-center"
                   onMouseEnter={() => setHoveredLine(line)}
                   onMouseLeave={() => setHoveredLine(null)}
                 >
                    <div className={`
                      h-full w-full flex flex-col items-center justify-center p-6 transition-all duration-500 relative rounded-3xl overflow-hidden
                      bg-white/2 border border-white/5 hover:border-white/20
                      ${line.status === 'critical' ? 'shadow-[0_0_30px_rgba(239,68,68,0.3)]' : ''}
                    `}>
                       <div className="w-full h-2/3">
                          <MachineSVG type={currentShop.type} />
                       </div>
                       
                       <div className="mt-4 text-center">
                          <div className={`text-sm font-black tracking-tighter ${line.status === 'critical' ? 'text-red-500' : 'text-white'}`}>{line.id}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">OEE {line.oee}%</div>
                       </div>
                    </div>

                    {hoveredLine?.id === line.id && line.currentProduct && (
                       <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-6 z-[100] w-64 bg-[#0B1120] border border-white/20 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.9)] p-0 overflow-hidden pointer-events-none animate-in zoom-in-95 duration-200">
                          <div className="h-32 bg-gray-950 border-b border-white/10 relative">
                             <ProductWireframe type={line.currentProduct.name} />
                          </div>
                          <div className="p-5">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-white text-[11px] uppercase tracking-tighter">{line.currentProduct.name}</span>
                                <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase">Active</span>
                             </div>
                             <div className="flex justify-between text-[10px] mt-4">
                                <span className="text-gray-500 font-bold uppercase">Progress</span>
                                <span className="text-white font-mono">82%</span>
                             </div>
                             <div className="w-full bg-gray-800 h-1 rounded-full mt-2 overflow-hidden">
                                <div className="bg-yellow-400 h-full" style={{width: '82%'}} />
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
               ))}
               </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
           <GlassCard title="Concerns" className="flex-1">
              <div className="flex flex-col gap-4">
                 {currentShop.issues.length === 0 ? (
                    <div className="text-center py-20 opacity-20 italic text-xs">No active shop-floor concerns</div>
                 ) : (
                    currentShop.issues.map(issue => (
                       <div key={issue.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-[9px] font-black bg-red-600 px-2 py-0.5 rounded text-white uppercase">{issue.priority}</span>
                          <h4 className="text-xs font-bold text-white mt-2">{issue.title}</h4>
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                             <div className="w-5 h-5 rounded-full bg-gray-800" />
                             <span className="text-[10px] text-gray-400 uppercase font-mono">{issue.owner}</span>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};
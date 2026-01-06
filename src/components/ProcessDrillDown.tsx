import React from 'react';
import { ProductionLine } from '../types';
import { X, Activity, Thermometer, Gauge, Package, FileText } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_ASSETS } from '../data/staticAssets';

interface ProcessDrillDownProps {
  line: ProductionLine;
  onClose: () => void;
}

export const ProcessDrillDown: React.FC<ProcessDrillDownProps> = ({ line, onClose }) => {
  const { t } = useLanguage();
  
  // Direct Static Lookup for reliability
  const assetKey = `global_asset_v7_${line.processType}`;
  // @ts-ignore
  const machineImg = STATIC_ASSETS[assetKey];

  const historyData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.floor(70 + Math.random() * 30)
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0B1120] border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-white/2">
          <div>
            <div className="flex items-center gap-4">
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{line.name}</h2>
               <span className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] font-black tracking-widest">
                 {line.processType.toUpperCase()}
               </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-2 tracking-widest uppercase">Asset Verification: ENV-DCC-{line.id}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white border border-white/5">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/2 p-5 rounded-2xl border border-white/5">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">OEE Real-time</span>
                    <Activity size={14} className="text-green-400" />
                 </div>
                 <div className="text-4xl font-black text-white font-mono">{line.oee}%</div>
              </div>
              <div className="bg-white/2 p-5 rounded-2xl border border-white/5">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Output Goal</span>
                    <Package size={14} className="text-blue-400" />
                 </div>
                 <div className="text-4xl font-black text-white font-mono">5k</div>
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Efficiency Trend (24h)</span>
               <div className="h-32 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={historyData}>
                     <Area type="monotone" dataKey="value" stroke="#facc15" fill="#facc15" fillOpacity={0.1} strokeWidth={3} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="bg-black/60 rounded-[2rem] border border-white/5 relative overflow-hidden flex flex-col shadow-inner">
             <div className="absolute top-4 left-6 z-10">
                <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    High-Fidelity Render
                </span>
             </div>
             
             <div className="flex-1 bg-slate-900/50 flex items-center justify-center p-8">
               {machineImg ? (
                 <img src={machineImg} alt="Machine" className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
               ) : (
                 <div className="text-gray-700 font-mono text-xs uppercase tracking-widest">No Visual Data</div>
               )}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
          <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-yellow-400/20 active:scale-95">
            Log Maintenance Request
          </button>
        </div>
      </div>
    </div>
  );
};
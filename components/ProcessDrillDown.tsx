
import React from 'react';
import { ProductionLine } from '../types';
import { X, Activity, Thermometer, Gauge, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface ProcessDrillDownProps {
  line: ProductionLine;
  onClose: () => void;
}

export const ProcessDrillDown: React.FC<ProcessDrillDownProps> = ({ line, onClose }) => {
  const { t } = useLanguage();
  // Generate fake telemetry history
  const historyData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.random() * 100
  }));

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
            <div className="col-span-2 bg-gradient-to-r from-yellow-400/10 to-transparent p-4 rounded-xl border border-yellow-400/20 flex items-center justify-between">
               <div>
                 <span className="text-xs text-yellow-400 font-bold uppercase">{t('realtimeOee')}</span>
                 <div className="text-4xl font-black text-white mt-1">{line.oee}%</div>
               </div>
               <div className="h-16 w-32">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={historyData}>
                     <Area type="monotone" dataKey="value" stroke="#facc15" fill="#facc15" fillOpacity={0.2} strokeWidth={2} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Camera Feed / Digital Twin Placeholder */}
          <div className="bg-black relative rounded-xl overflow-hidden border border-white/20 min-h-[250px] flex flex-col">
             <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded animate-pulse">{t('liveFeed')}</span>
                <span className="bg-black/50 text-white text-[9px] font-mono px-2 py-0.5 rounded">CAM-04</span>
             </div>
             
             {/* Fake Industrial View */}
             <div className="flex-1 bg-gray-900 relative">
               <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'repeating-linear-gradient(45deg, #111 0px, #111 10px, #222 10px, #222 20px)'}}></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-yellow-400/50 rounded-full flex items-center justify-center animate-[spin_4s_linear_infinite]">
                     <div className="w-24 h-24 border border-yellow-400/30 rounded-full" />
                  </div>
               </div>
               <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur p-2 rounded text-xs font-mono text-green-400 border-l-2 border-green-500">
                  {t('systemSeq')}
               </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">{t('viewLogs')}</button>
          <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded transition-colors shadow-lg shadow-yellow-400/20">
            {t('reqMaint')}
          </button>
        </div>
      </div>
    </div>
  );
};

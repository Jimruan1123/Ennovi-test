import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';

interface BootLoaderProps {
  onComplete: () => void;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  useEffect(() => {
    const runFastBoot = async () => {
      addLog("CONNECTING TO COMMAND HUB...");
      await new Promise(r => setTimeout(r, 400));
      setProgress(25);

      addLog("AUTHENTICATING DELIVERY PROTOCOLS...");
      await new Promise(r => setTimeout(r, 400));
      setProgress(55);

      addLog("LOADING SNAPSHOT BUFFER...");
      // NO LOCALSTORAGE WRITING HERE - Prevent QuotaExceededError
      await new Promise(r => setTimeout(r, 400));
      setProgress(100);
      
      addLog("INTERFACE STABLE.");
      setTimeout(onComplete, 400);
    };

    runFastBoot();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050a05] z-[9999] flex flex-col font-mono text-green-500 p-8 md:p-20 overflow-hidden">
       <div className="border-b border-green-500/30 pb-4 mb-8 flex justify-between items-end">
          <div>
            <div className="text-[10px] text-green-500/50 mb-2 tracking-[0.3em]">ENNOVI OS // WAR ROOM INTERFACE V3.1</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">Delivery<span className="text-green-500">.Sync</span></h1>
          </div>
          <Cpu size={48} className="text-green-500 animate-pulse hidden md:block" />
       </div>
       <div className="flex-1 flex flex-col items-center justify-center gap-12">
          <div className="w-full max-w-2xl space-y-6">
             <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest text-green-400">
                <span>Initializing Core Feed</span>
                <span>{progress}%</span>
             </div>
             <div className="w-full h-1.5 bg-gray-900 border border-green-500/20 rounded overflow-hidden">
                <div className="h-full bg-green-500 shadow-[0_0_15px_#22c55e] transition-all duration-300" style={{width: `${progress}%`}} />
             </div>
             <div className="h-28 font-mono text-[10px] space-y-2 text-green-600/80 overflow-hidden border-l border-green-900/50 pl-4">
                {logs.map((log, i) => <div key={i} className="animate-in fade-in slide-in-from-left duration-200">{log}</div>)}
             </div>
          </div>
       </div>
       <div className="flex justify-between items-center text-[9px] text-green-900 uppercase tracking-[0.2em] font-bold">
          <div className="flex items-center gap-2"><ShieldCheck size={12} /> SECURE FEED ACTIVE</div>
          <div className="flex items-center gap-2"><Zap size={12} /> HUB LATENCY: 12ms</div>
       </div>
    </div>
  );
};
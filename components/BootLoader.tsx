
import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { STATIC_ASSETS } from '../data/staticAssets';

interface BootLoaderProps {
  onComplete: () => void;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `> ${msg}`]);
  };

  useEffect(() => {
    const runFastBoot = async () => {
      addLog("BIOS POST...");
      await new Promise(r => setTimeout(r, 400));
      setProgress(20);

      addLog("CHECKING MEMORY INTEGRITY...");
      await new Promise(r => setTimeout(r, 400));
      setProgress(40);

      addLog("LOADING STATIC ASSETS (VECTOR)...");
      // Ensure Static Assets exist
      Object.entries(STATIC_ASSETS).forEach(([key, value]) => {
        // Only load if not present (preserve existing AI assets if any)
        if (!localStorage.getItem(key)) {
           localStorage.setItem(key, value);
        }
      });
      setProgress(70);
      
      addLog("INITIALIZING DAEMON PROCESSES...");
      await new Promise(r => setTimeout(r, 400));
      setProgress(100);
      addLog("SYSTEM READY.");
      
      setTimeout(onComplete, 800);
    };

    runFastBoot();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050a05] z-[9999] flex flex-col font-mono text-green-500 p-8 md:p-20 overflow-hidden">
       {/* Header */}
       <div className="border-b border-green-500/30 pb-4 mb-8 flex justify-between items-end">
          <div>
            <div className="text-xs text-green-500/50 mb-2">ENNOVI OS // FASTBOOT V2.1</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">SYSTEM<span className="text-green-500">.INIT</span></h1>
          </div>
          <Cpu size={48} className="text-green-500 animate-pulse hidden md:block" />
       </div>

       {/* Main Display */}
       <div className="flex-1 flex flex-col items-center justify-center gap-12">
          
          <div className="w-full max-w-2xl space-y-6">
             <div className="flex justify-between items-end text-sm font-bold uppercase tracking-widest text-green-400">
                <span>LOADING CORE MODULES</span>
                <span>{progress}%</span>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full h-2 bg-gray-900 border border-green-500/30 rounded overflow-hidden">
                <div 
                  className="h-full bg-green-500 shadow-[0_0_20px_#22c55e] transition-all duration-300 relative" 
                  style={{width: `${progress}%`}}
                >
                  <div className="absolute inset-0 bg-white/30 animate-[scan_1s_linear_infinite]" />
                </div>
             </div>

             {/* Logs */}
             <div className="h-32 font-mono text-xs space-y-2 text-green-600/80 overflow-hidden border-l-2 border-green-900 pl-4">
                {logs.map((log, i) => (
                  <div key={i} className="animate-in slide-in-from-left fade-in duration-300">{log}</div>
                ))}
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="flex justify-between items-center text-[10px] text-green-900 uppercase tracking-widest">
          <div className="flex items-center gap-2">
             <ShieldCheck size={12} />
             SECURE CONNECTION
          </div>
          <div className="flex items-center gap-2">
             <Zap size={12} />
             POWER: NOMINAL
          </div>
       </div>
    </div>
  );
};

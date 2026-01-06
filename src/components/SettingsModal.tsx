
import React from 'react';
import { X, ShieldCheck, Database } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3 text-yellow-400">
             <ShieldCheck size={20} />
             <h2 className="text-lg font-bold tracking-tight">STABLE DELIVERY MODE</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 text-center space-y-4">
           <Database size={48} className="mx-auto text-gray-700" />
           <p className="text-sm text-gray-400">
             The Digital Command Center is currently running in <b>Stable Mode</b>. 
             Real-time data feeds are connected via the ENNOVI Hub API.
           </p>
           <button 
             onClick={onClose}
             className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all"
           >
             RETURN TO COCKPIT
           </button>
        </div>
      </div>
    </div>
  );
};

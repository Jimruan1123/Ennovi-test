import React from 'react';
import { SupplierRisk } from '../types';
import { ShieldCheck, AlertTriangle, Truck, Globe } from 'lucide-react';

interface SupplierPanelProps {
  suppliers: SupplierRisk[];
}

export const SupplierPanel: React.FC<SupplierPanelProps> = ({ suppliers }) => {
  return (
    <div className="space-y-4">
      {suppliers.map((sup) => (
        <div 
          key={sup.id} 
          className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${sup.riskLevel > 5 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
               {sup.riskLevel > 5 ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-200">{sup.name}</div>
              <div className="text-[10px] text-gray-500 flex items-center gap-2">
                <span className="flex items-center gap-1"><Globe size={10} /> {sup.category}</span>
                <span>•</span>
                <span>Risk Score: {sup.riskLevel}/10</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Truck size={12} />
                <span>2d ETA</span>
             </div>
             {/* Health Bar */}
             <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${sup.riskLevel > 5 ? 'bg-red-500' : 'bg-green-500'}`} 
                  style={{ width: `${(10 - sup.riskLevel) * 10}%` }}
                />
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
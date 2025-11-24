
import React from 'react';
import { Customer } from '../types';
import { GlassCard } from './GlassCard';
import { Globe, Package, TrendingUp, AlertTriangle, BarChart as BarChartIcon, MessageSquareWarning, CheckCircle2, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, Tooltip, Cell, Legend, CartesianGrid } from 'recharts';

interface CustomerPanelProps {
  customers: Customer[];
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({ customers }) => {
  // Aggregate S&OP data from the first customer for demo purposes
  const sopData = customers[0].sopData || [];
  
  // Flatten complaints from all customers
  const allComplaints = customers.flatMap(c => c.complaints || []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      
      {/* S&OP Module - Demand Management */}
      <GlassCard 
        title="S&OP Demand Planning" 
        subTitle="DEMAND VS CAPACITY // 产销协同"
        className="w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={sopData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                 <XAxis dataKey="month" tick={{fill: '#9ca3af', fontSize: 12}} />
                 <YAxis yAxisId="left" tick={{fill: '#9ca3af', fontSize: 12}} label={{ value: 'Units', angle: -90, position: 'insideLeft', fill: '#666' }} />
                 <YAxis yAxisId="right" orientation="right" tick={{fill: '#9ca3af', fontSize: 12}} />
                 <Tooltip 
                   contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}}
                   itemStyle={{fontSize: 12}}
                 />
                 <Legend />
                 <Bar yAxisId="left" dataKey="forecast" name="Forecast Demand" fill="#facc15" barSize={30} radius={[4, 4, 0, 0]} />
                 <Bar yAxisId="left" dataKey="actual" name="Actual Orders" fill="#3b82f6" barSize={30} radius={[4, 4, 0, 0]} />
                 <Line yAxisId="left" type="monotone" dataKey="capacity" name="Plant Capacity" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />
               </ComposedChart>
             </ResponsiveContainer>
           </div>
           
           <div className="flex flex-col justify-center gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-gray-400 text-xs uppercase mb-1">Capacity Utilization (Aug)</h4>
                <div className="text-2xl font-mono font-bold text-white">94.2%</div>
                <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> Over-capacity risk
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-gray-400 text-xs uppercase mb-1">Backlog Gap</h4>
                <div className="text-2xl font-mono font-bold text-yellow-400">-12.5k</div>
                <div className="text-xs text-gray-500 mt-1">Units deferred to next month</div>
              </div>
           </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard title="Strategic Key Accounts (Tier 1)" className="min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map((cust) => (
                <div 
                  key={cust.id} 
                  className={`
                    relative p-5 rounded-lg border transition-all duration-300 hover:scale-[1.02] cursor-pointer
                    ${cust.status === 'critical' ? 'bg-red-900/10 border-red-500/50' : 
                      cust.status === 'warning' ? 'bg-orange-900/10 border-orange-500/50' : 
                      'bg-white/5 border-white/10 hover:border-yellow-400/30'}
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white tracking-tight">{cust.name}</h4>
                      <span className="text-xs text-gray-400 font-mono uppercase">{cust.region} // {cust.segment}</span>
                    </div>
                    {cust.status === 'critical' && <AlertTriangle className="text-red-500 animate-pulse" />}
                    {cust.status === 'normal' && <div className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold">HEALTHY</div>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Pending Orders</span>
                      <div className="flex items-center gap-2 text-white font-mono text-lg">
                        <Package size={14} className="text-yellow-400" />
                        {cust.ordersPending.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Quality (PPM)</span>
                      <div className={`font-mono text-lg ${cust.ppm > 50 ? 'text-red-400' : 'text-green-400'}`}>
                        {cust.ppm}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <span className="text-gray-500">Last Ship: {cust.lastShipment}</span>
                    <span className="text-yellow-400/80 cursor-pointer hover:underline">View Contracts &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* New Module: Key Customer Complaints */}
          <GlassCard title="Key Customer Complaints (VOC)" subTitle="STATUS & RESOLUTION // 客户抱怨管理">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-400">
                 <thead className="bg-white/5 text-gray-200 text-xs uppercase font-mono">
                   <tr>
                     <th className="p-3">Status</th>
                     <th className="p-3">Customer</th>
                     <th className="p-3">Type</th>
                     <th className="p-3">Issue Description</th>
                     <th className="p-3">Dept</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {allComplaints.length > 0 ? allComplaints.map(comp => (
                     <tr key={comp.id} className="hover:bg-white/5 transition-colors">
                       <td className="p-3">
                         <span className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded w-fit ${
                           comp.status === 'Open' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                           comp.status === 'Investigating' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                           'bg-green-500/20 text-green-400 border border-green-500/30'
                         }`}>
                           {comp.status === 'Open' ? <AlertTriangle size={12}/> : 
                            comp.status === 'Investigating' ? <Clock size={12}/> : <CheckCircle2 size={12}/>}
                           {comp.status.toUpperCase()}
                         </span>
                       </td>
                       <td className="p-3 font-bold text-white">{comp.customer}</td>
                       <td className="p-3 font-mono text-xs">{comp.type}</td>
                       <td className="p-3 text-white max-w-xs truncate" title={comp.description}>{comp.description}</td>
                       <td className="p-3">
                         <span className="px-2 py-1 bg-gray-700 rounded text-[10px] text-white font-mono">{comp.department}</span>
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={5} className="p-6 text-center text-gray-500 italic">No active complaints logged.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </GlassCard>
        </div>

        <div className="flex flex-col gap-6">
          <GlassCard title="Global Delivery Volume" className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={customers} layout="vertical" margin={{left: 20}}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={80} tick={{fill: '#9ca3af', fontSize: 10}} />
                 <Tooltip 
                    contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                 />
                 <Bar dataKey="ordersPending" radius={[0, 4, 4, 0]} barSize={20}>
                    {customers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.status === 'critical' ? '#ef4444' : '#facc15'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-4 bg-gradient-to-br from-yellow-400/20 to-transparent border-yellow-400/20">
             <div className="flex items-center gap-4">
               <div className="p-3 rounded-full bg-yellow-400/20 text-yellow-400">
                 <Globe size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-white">Logistics Alert</h4>
                 <p className="text-xs text-gray-300">Shanghai Port congestion affecting EU shipments. Rerouting via Ningbo.</p>
               </div>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

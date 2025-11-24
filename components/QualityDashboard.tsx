
import React from 'react';
import { QualityData } from '../types';
import { GlassCard } from './GlassCard';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ShieldAlert, TrendingUp, DollarSign, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface QualityDashboardProps {
  data: QualityData;
}

export const QualityDashboard: React.FC<QualityDashboardProps> = ({ data }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      
      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="flex items-center justify-between p-4">
           <div>
             <span className="text-gray-400 text-xs uppercase">{t('plantFpy')}</span>
             <div className="text-3xl font-mono font-bold text-green-400">98.2%</div>
           </div>
           <Target className="text-green-500/50" size={32} />
        </GlassCard>
        <GlassCard className="flex items-center justify-between p-4">
           <div>
             <span className="text-gray-400 text-xs uppercase">{t('rmaCount')}</span>
             <div className="text-3xl font-mono font-bold text-yellow-400">3</div>
           </div>
           <ShieldAlert className="text-yellow-500/50" size={32} />
        </GlassCard>
        <GlassCard className="flex items-center justify-between p-4">
           <div>
             <span className="text-gray-400 text-xs uppercase">{t('coqpYtd')}</span>
             <div className="text-3xl font-mono font-bold text-red-400">$42k</div>
           </div>
           <DollarSign className="text-red-500/50" size={32} />
        </GlassCard>
        <GlassCard className="flex items-center justify-between p-4">
           <div>
             <span className="text-gray-400 text-xs uppercase">{t('goalGap')}</span>
             <div className="text-3xl font-mono font-bold text-blue-400">-0.4%</div>
           </div>
           <TrendingUp className="text-blue-500/50" size={32} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cost of Poor Quality (COQP) */}
        <GlassCard title={t('coqpBreakdown')} subTitle={t('coqpSub')}>
           <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={data.coqp}
                       dataKey="cost"
                       nameKey="category"
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={100}
                       paddingAngle={5}
                    >
                       {data.coqp.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip 
                       formatter={(value) => `$${value}`}
                       contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="text-center text-xs text-gray-500 mt-2">
              Largest contributor: <span className="text-white font-bold">Internal Failures (Scrap)</span> due to Setup Errors.
           </div>
        </GlassCard>

        {/* FPY Trend */}
        <GlassCard title={t('fpyTrend')} subTitle={t('fpySub')}>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data.fpyTrend}>
                    <defs>
                       <linearGradient id="colorFpy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="time" tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis domain={[90, 100]} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}}/>
                    <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorFpy)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </GlassCard>
      </div>

      {/* Defect Pareto */}
      <GlassCard title={t('topDefects')} subTitle={t('defectsSub')} className="min-h-[350px]">
         <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.pareto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="type" tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}} />
                  <Bar dataKey="count" fill="#facc15" radius={[4, 4, 0, 0]} barSize={50} />
               </BarChart>
            </ResponsiveContainer>
         </div>
         <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded flex items-center gap-3">
            <ShieldAlert className="text-red-400" />
            <div className="text-sm text-gray-300">
               <span className="font-bold text-red-400">{t('actionRequired')}</span> {t('defectMsg')}
            </div>
         </div>
      </GlassCard>
    </div>
  );
};

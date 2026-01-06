import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { 
  Clock, CheckCircle2, Smartphone, X, Globe, AlertTriangle, ShieldAlert, Zap
} from 'lucide-react';
import { GlassCard } from './components/GlassCard';
import { KPIRing } from './components/KPIRing';
import { FactoryMap } from './components/FactoryMap';
import { SideNav } from './components/SideNav';
import { CustomerPanel } from './components/CustomerPanel';
import { ProcessDrillDown } from './components/ProcessDrillDown';
import { SupplierPanel } from './components/SupplierPanel';
import { QualityDashboard } from './components/QualityDashboard';
import { ProductionShopView } from './components/ProductionShopView';
import { BootLoader } from './components/BootLoader';
import { Snapshot } from './types';
import { useLanguage } from './contexts/LanguageContext';

const getMockProduct = (type: string, id: string, targetOee?: number) => {
  const products = [
     { name: 'HV Connector Hsg', pn: 'EN-884-X' },
     { name: 'Busbar Clip', pn: 'EN-BB-02' },
     { name: 'Sensor Terminal', pn: 'EN-SN-99' }
  ];
  const index = id.charCodeAt(id.length - 1) % products.length;
  const prod = products[index];
  const efficiency = targetOee !== undefined ? targetOee : Math.floor(85 + Math.random() * 14);
  return {
    name: prod.name,
    partNumber: prod.pn,
    targetOutput: 5000,
    actualOutput: Math.floor(5000 * (efficiency / 100)),
    efficiency: efficiency
  };
};

const getSnapshots = (t: any): Record<number, Snapshot> => ({
  0: { 
    time: "09:00", label: t('shiftStart'),
    kpis: [
      { id: 'oee', label: 'Plant OEE', value: 94, unit: '%', target: 88, status: 'normal', trend: 'up', responsible: '' },
      { id: 'otd', label: 'On Time Del.', value: 99, unit: '%', target: 98, status: 'normal', trend: 'flat', responsible: '' },
      { id: 'ppm', label: 'PPM', value: 12, unit: '', target: 50, status: 'normal', trend: 'down', responsible: '' },
      { id: 'cpk', label: 'Avg CpK', value: 1.67, unit: '', target: 1.33, status: 'normal', trend: 'up', responsible: '' },
    ],
    lines: [
      { id: 'L1', name: 'Press 01', processType: 'stamping', status: 'normal', oee: 92, cycleTime: 10, telemetry: [], currentProduct: getMockProduct('stamping', 'L1', 92) },
      { id: 'L2', name: 'Press 02', processType: 'stamping', status: 'normal', oee: 94, cycleTime: 10, telemetry: [], currentProduct: getMockProduct('stamping', 'L2', 94) },
    ],
    materials: [
      { category: 'Resins', readiness: 100, fullMark: 100 },
      { category: 'Cu Alloys', readiness: 100, fullMark: 100 },
      { category: 'Contacts', readiness: 100, fullMark: 100 },
    ],
    customers: [], suppliers: [], qualityData: {fpyTrend:[], coqp:[], pareto:[]}, workshops: [], actions: [], spcData: []
  },
  1: { 
    time: "11:00", label: t('resinWarning'),
    kpis: [
      { id: 'oee', label: 'Plant OEE', value: 89, unit: '%', target: 88, status: 'warning', trend: 'down', responsible: '' },
      { id: 'otd', label: 'On Time Del.', value: 97, unit: '%', target: 98, status: 'warning', trend: 'down', responsible: '' },
      { id: 'ppm', label: 'PPM', value: 14, unit: '', target: 50, status: 'normal', trend: 'flat', responsible: '' },
      { id: 'cpk', label: 'Avg CpK', value: 1.65, unit: '', target: 1.33, status: 'normal', trend: 'flat', responsible: '' },
    ],
    lines: [
      { id: 'L1', name: 'Press 01', processType: 'stamping', status: 'normal', oee: 91, cycleTime: 10, telemetry: [], currentProduct: getMockProduct('stamping', 'L1', 91) },
      { id: 'MD-5', name: 'Mold 05', processType: 'molding', status: 'warning', issue: 'Hopper Feed Jam', oee: 78, cycleTime: 12, telemetry: [], currentProduct: getMockProduct('molding', 'MD-5', 78) },
    ],
    materials: [
      { category: 'Resins', readiness: 42, fullMark: 100 },
      { category: 'Cu Alloys', readiness: 100, fullMark: 100 },
      { category: 'Contacts', readiness: 95, fullMark: 100 },
    ],
    customers: [], suppliers: [], qualityData: {fpyTrend:[], coqp:[], pareto:[]}, workshops: [], actions: [], spcData: []
  },
  2: { 
    time: "14:00", label: t('lineStop'),
    kpis: [
      { id: 'oee', label: 'Plant OEE', value: 72, unit: '%', target: 88, status: 'critical', trend: 'down', responsible: 'https://i.pravatar.cc/150?u=mgr1' },
      { id: 'otd', label: 'On Time Del.', value: 92, unit: '%', target: 98, status: 'warning', trend: 'down', responsible: '' },
      { id: 'ppm', label: 'PPM', value: 45, unit: '', target: 50, status: 'warning', trend: 'up', responsible: '' },
      { id: 'cpk', label: 'Avg CpK', value: 1.5, unit: '', target: 1.33, status: 'normal', trend: 'flat', responsible: '' },
    ],
    lines: [
      { id: 'L1', name: 'Press 04', processType: 'stamping', status: 'critical', issue: 'Slug Control Error', oee: 45, cycleTime: 0, telemetry: [], currentProduct: getMockProduct('stamping', 'L1', 45) },
      { id: 'AS-1', name: 'Assembly 01', processType: 'assembly', status: 'critical', issue: 'Material Jam', oee: 0, cycleTime: 0, telemetry: [], currentProduct: getMockProduct('assembly', 'AS-1', 0) },
    ],
    materials: [
      { category: 'Resins', readiness: 18, fullMark: 100 },
      { category: 'Cu Alloys', readiness: 100, fullMark: 100 },
      { category: 'Contacts', readiness: 85, fullMark: 100 },
    ],
    customers: [], suppliers: [], qualityData: {fpyTrend:[], coqp:[], pareto:[]}, workshops: [], actions: [], spcData: []
  },
});

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [activeView, setActiveView] = useState('cockpit');
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const snapshots = useMemo(() => getSnapshots(t), [t]);
  const currentData = snapshots[sliderValue];
  const activeLine = currentData.lines.find(l => l.id === selectedLineId);

  const topAlerts = useMemo(() => {
    const alerts: { text: string; type: 'critical' | 'warning' }[] = [];
    currentData.lines.filter(l => l.status === 'critical').forEach(l => {
      alerts.push({ text: `CRITICAL: ${l.name} STOPPED - ${l.issue}`, type: 'critical' });
    });
    currentData.materials.filter(m => m.readiness < 50).forEach(m => {
      alerts.push({ text: `INVENTORY: ${m.category} STOCK LEVEL @ ${m.readiness}%`, type: m.readiness < 20 ? 'critical' : 'warning' });
    });
    if (currentData.kpis[0].status !== 'normal') {
      alerts.push({ text: `PERFORMANCE: PLANT OEE DROPPED TO ${currentData.kpis[0].value}%`, type: 'critical' });
    }
    return alerts.length > 0 ? alerts.slice(0, 3) : null;
  }, [currentData]);

  if (isBooting) return <BootLoader onComplete={() => setIsBooting(false)} />;

  return (
    <div className="flex min-h-screen bg-transparent font-sans text-gray-100 overflow-hidden relative">
      
      <SideNav activeView={activeView} onNavigate={setActiveView} onOpenSettings={() => {}} />

      <main className="flex-1 md:ml-20 lg:ml-64 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between bg-black/60 backdrop-blur-md border-b border-white/10 z-[60]">
          <div>
             <h1 className="text-3xl font-black tracking-tighter text-yellow-400 flex items-center gap-2">
               {t('companyName')} <span className="text-white/30 font-thin text-xl">|</span> {t('hangzhouLoc')}
             </h1>
             <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-1">
               {t('subTitle')}
             </p>
          </div>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono"
            >
              <Globe size={14} />
              <span>{language === 'en' ? 'EN' : '中文'}</span>
            </button>

            <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
              <Clock size={16} className="text-yellow-400" />
              <div className="flex flex-col w-48 md:w-64">
                <input 
                  type="range" min="0" max="2" step="1" 
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
              </div>
              <div className="text-right">
                <div className="text-xl font-mono font-bold">{currentData.time}</div>
              </div>
            </div>
          </div>
        </header>

        {/* --- FACTORY ALERT TICKER --- */}
        <div className="bg-red-950/40 border-b border-red-500/30 h-10 flex items-center overflow-hidden z-[55]">
           <div className="flex items-center gap-4 px-6 shrink-0 border-r border-red-500/20 bg-red-900/40 h-full">
              <ShieldAlert size={16} className="text-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-500 tracking-tighter uppercase whitespace-nowrap">Critical Alerts</span>
           </div>
           <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-20 whitespace-nowrap animate-marquee items-center min-w-full px-10">
                 {topAlerts ? (
                   <>
                    {topAlerts.map((alert, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-orange-500'}`} />
                         <span className={`text-[11px] font-bold font-mono tracking-widest ${alert.type === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                           {alert.text}
                         </span>
                      </div>
                    ))}
                    {/* Repeat for seamless loop */}
                    {topAlerts.map((alert, idx) => (
                      <div key={`dup-${idx}`} className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-orange-500'}`} />
                         <span className={`text-[11px] font-bold font-mono tracking-widest ${alert.type === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                           {alert.text}
                         </span>
                      </div>
                    ))}
                   </>
                 ) : (
                   <span className="text-[11px] font-bold font-mono text-green-500 tracking-[0.2em] uppercase">
                     >>> STATUS: ALL SYSTEMS OPERATING WITHIN NOMINAL PARAMETERS <<<
                   </span>
                 )}
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative custom-scrollbar">
          {activeView === 'cockpit' && (
            <div className="grid grid-cols-12 gap-6 pb-20">
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                <GlassCard title={t('materialReadiness')} subTitle={t('materialSub')}>
                   <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={currentData.materials}>
                          <PolarGrid stroke="#333" />
                          <PolarAngleAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                          <Radar name="Stock" dataKey="readiness" stroke="#facc15" fill="#facc15" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </GlassCard>
              </div>

              <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentData.kpis.map((kpi) => (
                    <KPIRing 
                      key={kpi.id} kpi={kpi} 
                      onClick={() => setSelectedLineId(kpi.status === 'critical' ? 'L1' : null)}
                      isActive={kpi.status === 'critical'}
                    />
                  ))}
                </div>
                <GlassCard title={t('productionAlert')} subTitle={t('productionAlertSub')} className="flex-1 min-h-[400px] !overflow-visible">
                  <FactoryMap 
                    lines={currentData.lines} 
                    onLineClick={setSelectedLineId}
                    activeLineId={selectedLineId}
                  />
                </GlassCard>
              </div>

              <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                 <GlassCard title={t('actionCenter')} subTitle={t('taskForce')}>
                    <div className="flex flex-col gap-3">
                      {currentData.lines.filter(l => l.status !== 'normal').map(l => (
                        <div key={l.id} className="p-3 rounded-lg bg-white/5 border border-red-500/20">
                           <div className="flex justify-between text-xs font-bold text-red-400 mb-1">
                              <span>{l.name} ISSUE</span>
                              <Zap size={12} />
                           </div>
                           <p className="text-[11px] text-gray-300">{l.issue}</p>
                        </div>
                      ))}
                    </div>
                 </GlassCard>
              </div>
            </div>
          )}

          {activeView === 'customers' && <CustomerPanel customers={[]} />}
          {activeView === 'quality' && <QualityDashboard data={{fpyTrend:[], coqp:[], pareto:[]}} />}
          {activeView === 'production' && <ProductionShopView workshops={[]} />}
        </div>
      </main>

      {activeLine && <ProcessDrillDown line={activeLine} onClose={() => setSelectedLineId(null)} />}

    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { 
  Clock, CheckCircle2, Smartphone, X, Globe, AlertTriangle, ShieldAlert, Zap, ArrowRight
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

  // DERIVE TOP 3 CONCERNS FOR MANAGEMENT
  const topConcerns = useMemo(() => {
    const concerns: { text: string; type: 'critical' | 'warning' }[] = [];
    currentData.lines.filter(l => l.status === 'critical').forEach(l => {
      concerns.push({ text: `[PROD] CRITICAL: ${l.name} STOPPED - IMPACT ON CUSTOMER DELIVERY`, type: 'critical' });
    });
    currentData.materials.filter(m => m.readiness < 40).forEach(m => {
      concerns.push({ text: `[SUPPLY] ALERT: ${m.category} STOCK LEVEL @ ${m.readiness}% - SHORTAGE RISK`, type: 'critical' });
    });
    if (currentData.kpis[0].status === 'critical') {
      concerns.push({ text: `[EXEC] PERFORMANCE: PLANT OEE DROPPED TO ${currentData.kpis[0].value}%`, type: 'critical' });
    }
    return concerns.length > 0 ? concerns.slice(0, 3) : null;
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all"
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
                <div className="text-xl font-mono font-bold text-white">{currentData.time}</div>
              </div>
            </div>
          </div>
        </header>

        {/* --- FACTORY ALERT MARQUEE (TOP 3) --- */}
        <div className="bg-red-950/60 border-b border-red-500/30 h-12 flex items-center overflow-hidden z-[55] shadow-2xl">
           <div className="flex items-center gap-4 px-6 shrink-0 border-r border-red-500/20 bg-red-900/60 h-full">
              <ShieldAlert size={18} className="text-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-500 tracking-widest uppercase whitespace-nowrap">War Room Alerts</span>
           </div>
           <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-24 whitespace-nowrap animate-marquee items-center min-w-full px-12">
                 {topConcerns ? (
                   <>
                    {[...topConcerns, ...topConcerns].map((concern, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                         <div className={`w-2.5 h-2.5 rounded-full ${concern.type === 'critical' ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-orange-500'}`} />
                         <span className={`text-[13px] font-black font-mono tracking-[0.15em] ${concern.type === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                           {concern.text}
                         </span>
                         {idx < 5 && <ArrowRight size={14} className="text-gray-700 mx-4" />}
                      </div>
                    ))}
                   </>
                 ) : (
                   <span className="text-[12px] font-bold font-mono text-green-500 tracking-[0.4em] uppercase">
                     >>> STATUS: ALL CORE METRICS WITHIN NORMAL OPERATING PARAMETERS <<<
                   </span>
                 )}
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative custom-scrollbar">
          {activeView === 'cockpit' && (
            <div className="grid grid-cols-12 gap-6 pb-24">
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                <GlassCard title={t('materialReadiness')} subTitle={t('materialSub')} variant={sliderValue === 2 ? 'critical' : 'default'}>
                   <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={currentData.materials}>
                          <PolarGrid stroke="#333" />
                          <PolarAngleAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                          <Radar name="Readiness" dataKey="readiness" stroke="#facc15" fill="#facc15" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </GlassCard>
                <GlassCard title={t('supplierHealth')} subTitle={t('supplierSub')}>
                    <div className="p-4 bg-yellow-400/5 border border-yellow-400/10 rounded-lg flex items-center justify-center h-20">
                       <span className="text-[10px] text-gray-500 font-mono italic">Tier-1 Logistics Active</span>
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
                <GlassCard title={t('productionAlert')} subTitle={t('productionAlertSub')} className="flex-1 min-h-[450px] !overflow-visible" variant={currentData.kpis[0].status === 'critical' ? 'critical' : 'default'}>
                  <FactoryMap lines={currentData.lines} onLineClick={setSelectedLineId} activeLineId={selectedLineId} />
                </GlassCard>
              </div>

              <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                 <GlassCard title={t('actionCenter')} subTitle={t('taskForce')} variant={sliderValue === 2 ? 'warning' : 'default'}>
                    <div className="flex flex-col gap-4">
                      {currentData.lines.filter(l => l.status !== 'normal').map(l => (
                        <div key={l.id} className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                           <div className="flex justify-between items-center text-[10px] font-black text-red-500 mb-2">
                              <span>FAULT ID: {l.id}</span>
                              <Zap size={14} className="fill-red-500" />
                           </div>
                           <h4 className="text-sm font-bold text-white mb-1">{l.name}</h4>
                           <p className="text-xs text-gray-400 mb-3">{l.issue}</p>
                           <button className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase rounded">ACKNOWLEDGE</button>
                        </div>
                      ))}
                      {currentData.lines.filter(l => l.status !== 'normal').length === 0 && (
                         <div className="flex flex-col items-center py-12 opacity-30">
                            <CheckCircle2 size={48} className="mb-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Nominal</span>
                         </div>
                      )}
                    </div>
                 </GlassCard>
              </div>
            </div>
          )}
          {activeView === 'customers' && <CustomerPanel customers={[]} />}
          {activeView === 'quality' && <QualityDashboard data={{fpyTrend:[], coqp:[], pareto:[]}} />}
          {activeView === 'production' && <ProductionShopView workshops={[]} />}
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-[#0B1120] border-t border-white/10 h-8 flex items-center overflow-hidden z-30">
           <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap gap-12 text-[10px] font-mono text-gray-500 px-4 uppercase tracking-widest">
              <span>{t('systemStatus')}</span>
              <span className="text-yellow-400">LAST REFRESH: {currentData.time} (UTC+8)</span>
              <span>HUB LATENCY: 12ms</span>
           </div>
        </div>
      </main>

      {activeLine && <ProcessDrillDown line={activeLine} onClose={() => setSelectedLineId(null)} />}
    </div>
  );
}

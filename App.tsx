
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { 
  Activity, AlertCircle, Clock, CheckCircle2, 
  RefreshCw, Smartphone, X, Zap, ChevronRight, Menu, Truck, ShieldAlert, Layers
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
import { KPI, ProductionLine, ActionItem, MaterialStatus, Customer, SupplierRisk, QualityData, SOPData, WorkshopData, Complaint } from './types';

// --- ENNOVI MOCK DATA SCENARIOS ---

type Snapshot = {
  time: string;
  label: string;
  kpis: KPI[];
  lines: ProductionLine[];
  materials: MaterialStatus[];
  customers: Customer[];
  suppliers: SupplierRisk[];
  qualityData: QualityData;
  workshops: WorkshopData[];
  actions: ActionItem[];
  spcData: any[]; // Data for SPC Chart
};

// Mock Product Helper - NOW ACCEPTS OEE TO SYNC DATA
const getMockProduct = (type: string, id: string, targetOee?: number) => {
  const products = [
     { name: 'HV Connector Hsg', pn: 'EN-884-X', img: '' },
     { name: 'Busbar Clip', pn: 'EN-BB-02', img: '' },
     { name: 'Sensor Terminal', pn: 'EN-SN-99', img: '' }
  ];
  const prod = products[Math.floor(Math.random() * products.length)];
  
  // SYNC LOGIC: If OEE is provided, use it for efficiency. Otherwise random.
  const efficiency = targetOee !== undefined ? targetOee : Math.floor(85 + Math.random() * 14);
  const targetOutput = 5000;
  // Calculate actual output based on efficiency
  const actualOutput = Math.floor(targetOutput * (efficiency / 100));

  return {
    name: prod.name,
    partNumber: prod.pn,
    image: prod.img, 
    targetOutput: targetOutput,
    actualOutput: actualOutput,
    efficiency: efficiency
  };
};

// Helper to generate extra dummy lines
const generateExtraLines = (baseId: string, count: number, type: any, startIdx: number): ProductionLine[] => {
  return Array.from({ length: count }, (_, i) => {
    // Generate OEE first
    const oee = Math.floor(85 + Math.random() * 14);
    
    return {
      id: `${baseId}-${i + startIdx}`,
      name: `${type === 'stamping' ? 'Press' : type === 'molding' ? 'Mold' : 'Line'} ${String(i + startIdx).padStart(2, '0')}`,
      processType: type,
      status: Math.random() > 0.9 ? 'warning' : 'normal',
      oee: oee,
      cycleTime: 10,
      telemetry: [
        { name: 'Power', value: 120, unit: 'kW', status: 'normal' },
        { name: 'Temp', value: 65, unit: 'C', status: 'normal' }
      ],
      // Pass OEE to product to ensure sync
      currentProduct: getMockProduct(type, `${baseId}-${i}`, oee)
    };
  });
};

const SUPPLIERS_DATA: SupplierRisk[] = [
  { id: 'S1', name: 'Wieland Metal', riskLevel: 2, category: 'Raw Material (DE)' },
  { id: 'S2', name: 'DuPont Polymers', riskLevel: 8, category: 'Resin (CN)' }, 
  { id: 'S3', name: 'Umicore Plating', riskLevel: 3, category: 'Chemicals (BE)' },
  { id: 'S4', name: 'Local Pkg Co', riskLevel: 1, category: 'Packaging (CN)' },
];

const SOP_MOCK: SOPData[] = [
  { month: 'Aug', forecast: 150000, actual: 142000, capacity: 160000, gap: 8000 },
  { month: 'Sep', forecast: 165000, actual: 160000, capacity: 160000, gap: -5000 },
  { month: 'Oct', forecast: 180000, actual: 110000, capacity: 160000, gap: -20000 },
];

const QUALITY_MOCK: QualityData = {
  fpyTrend: [
    { time: 'Mon', value: 98.5 }, { time: 'Tue', value: 98.2 }, { time: 'Wed', value: 97.9 }, 
    { time: 'Thu', value: 98.8 }, { time: 'Fri', value: 99.1 }, { time: 'Sat', value: 98.0 }, { time: 'Sun', value: 98.4 }
  ],
  coqp: [
    { category: 'Prevention', cost: 12000, color: '#22c55e' },
    { category: 'Appraisal', cost: 8500, color: '#3b82f6' },
    { category: 'Internal Failure', cost: 18000, color: '#facc15' },
    { category: 'External Failure', cost: 3500, color: '#ef4444' },
  ],
  pareto: [
    { type: 'Plating Peeling', count: 142 },
    { type: 'Dim. Out of Spec', count: 86 },
    { type: 'Burrs', count: 54 },
    { type: 'Scratches', count: 32 },
    { type: 'Others', count: 21 },
  ]
};

// Common Complaints
const COMPLAINTS_MOCK: Complaint[] = [
  { id: 'c1', customer: 'Tesla Global', type: 'Quality', description: 'Burr detected on Connector housing batch #4402', status: 'Investigating', department: 'QA', date: '2023-10-24' },
  { id: 'c2', customer: 'Bosch', type: 'Logistics', description: 'Shipment delayed by 3 days due to port congestion', status: 'Open', department: 'Logistics', date: '2023-10-25' },
];

// Generate Workshop Data
const WORKSHOPS_MOCK: WorkshopData[] = [
  {
    id: 'ws-stamping', name: 'Stamping Hall A', type: 'stamping', 
    sqdcip: {s: 'normal', q: 'normal', d: 'normal', c: 'normal', i: 'warning', p: 'normal'},
    lines: generateExtraLines('ST', 8, 'stamping', 1),
    issues: [{id: 'i1', title: 'Die Maintenance Required', status: 'todo', priority: 'medium', owner: 'Team A', timeAgo: '2h', ownerAvatar: ''}]
  },
  {
    id: 'ws-molding', name: 'Molding Cleanroom', type: 'molding',
    sqdcip: {s: 'normal', q: 'warning', d: 'normal', c: 'normal', i: 'normal', p: 'normal'},
    lines: generateExtraLines('MD', 6, 'molding', 1),
    issues: [{id: 'i2', title: 'Hopper Feed Error', status: 'doing', priority: 'high', owner: 'John D.', timeAgo: '15m', ownerAvatar: ''}]
  },
  {
    id: 'ws-plating', name: 'Plating Line 2', type: 'plating',
    sqdcip: {s: 'normal', q: 'normal', d: 'warning', c: 'normal', i: 'normal', p: 'normal'},
    lines: generateExtraLines('PL', 4, 'plating', 1),
    issues: []
  },
  {
    id: 'ws-assembly', name: 'Assembly & Pack', type: 'assembly',
    sqdcip: {s: 'normal', q: 'normal', d: 'normal', c: 'normal', i: 'normal', p: 'normal'},
    lines: generateExtraLines('AS', 8, 'assembly', 1),
    issues: [{id: 'i3', title: 'Laser Safety Interlock', status: 'done', priority: 'high', owner: 'Safety Team', timeAgo: '1d', ownerAvatar: ''}]
  }
];

// Global Action Items Pool
const ACTION_ITEMS_MOCK: ActionItem[] = [
  { id: '1', machineId: 'L1', title: 'Press 04 - Slug Jam', status: 'doing', strategy: 'Stop line, clear die, inspect strip. Resume @ 50% speed.', owner: 'Mike Chen', ownerAvatar: 'https://i.pravatar.cc/150?u=1', priority: 'high', timeAgo: '15m' },
  { id: '2', title: 'Resin Stock Low (DuPont)', status: 'todo', strategy: 'Expedite air freight from alternate supplier (SABIC).', owner: 'Sarah Wu', ownerAvatar: 'https://i.pravatar.cc/150?u=2', priority: 'high', timeAgo: '45m' },
  { id: '3', machineId: 'PL-3', title: 'Plating Bath B Maintenance', status: 'done', strategy: 'Routine filter change and chemical top-up.', owner: 'Dave L.', ownerAvatar: 'https://i.pravatar.cc/150?u=3', priority: 'medium', timeAgo: '2h' },
  { id: '4', title: 'Weekly Safety Audit', status: 'todo', strategy: 'Walkthrough of Stamping Hall B.', owner: 'EHS Team', ownerAvatar: '', priority: 'medium', timeAgo: '4h' },
  { id: '5', machineId: 'L2', title: 'Press 02 - Vibration', status: 'todo', strategy: 'Check flywheel balance and floor mounting bolts.', owner: 'Maint. Team', ownerAvatar: '', priority: 'medium', timeAgo: '10m' },
  { id: '6', machineId: 'MD-5', title: 'Mold 05 - Feed Jam', status: 'doing', strategy: 'Clear hopper bridge, reset feeder motor.', owner: 'John D.', ownerAvatar: '', priority: 'medium', timeAgo: '5m' },
];

const DATA_SNAPSHOTS: Record<number, Snapshot> = {
  0: { // 09:00 AM - START
    time: "09:00",
    label: "Shift Start",
    kpis: [
      { id: 'oee', label: 'Plant OEE', value: 94, unit: '%', target: 88, status: 'normal', trend: 'up', responsible: '' },
      { id: 'otd', label: 'On Time Del.', value: 99, unit: '%', target: 98, status: 'normal', trend: 'flat', responsible: '' },
      { id: 'ppm', label: 'Quality (PPM)', value: 12, unit: '', target: 50, status: 'normal', trend: 'down', responsible: '' },
      { id: 'cpk', label: 'Avg CpK', value: 1.67, unit: '', target: 1.33, status: 'normal', trend: 'up', responsible: '' },
    ],
    // Force some issues even at start
    lines: [
      { id: 'L2', name: 'Press 02', processType: 'stamping', status: 'warning', issue: 'High Vibration', oee: 82, cycleTime: 10, telemetry: [], currentProduct: getMockProduct('stamping', 'L2', 82) },
      ...WORKSHOPS_MOCK[0].lines.slice(0, 3) 
    ],
    materials: [
      { category: 'Cu Alloys', readiness: 100, fullMark: 100 },
      { category: 'Resins', readiness: 100, fullMark: 100 },
      { category: 'Gold Salts', readiness: 100, fullMark: 100 },
      { category: 'Pkg Trays', readiness: 95, fullMark: 100 },
      { category: 'Contacts', readiness: 100, fullMark: 100 },
    ],
    customers: [
      { id: 'C1', name: 'Tesla Global', region: 'NA/EU', segment: 'EV Power', status: 'normal', ordersPending: 45000, ppm: 5, lastShipment: '2h ago', sopData: SOP_MOCK },
      { id: 'C2', name: 'CATL', region: 'APAC', segment: 'Battery', status: 'normal', ordersPending: 120000, ppm: 0, lastShipment: '30m ago', sopData: SOP_MOCK },
      { id: 'C3', name: 'Bosch', region: 'EU', segment: 'Signal', status: 'normal', ordersPending: 8500, ppm: 15, lastShipment: '1d ago', sopData: SOP_MOCK, complaints: COMPLAINTS_MOCK },
    ],
    suppliers: SUPPLIERS_DATA,
    qualityData: QUALITY_MOCK,
    workshops: WORKSHOPS_MOCK,
    actions: ACTION_ITEMS_MOCK,
    spcData: [{time: '08:00', v: 1.66}, {time: '08:15', v: 1.67}, {time: '08:30', v: 1.68}, {time: '08:45', v: 1.65}, {time: '09:00', v: 1.67}]
  },
  1: { // 11:00 AM - WARNING
    time: "11:00",
    label: "Resin Warning",
    kpis: [
      { id: 'oee', label: 'Plant OEE', value: 89, unit: '%', target: 88, status: 'warning', trend: 'down', responsible: '' },
      { id: 'otd', label: 'On Time Del.', value: 97, unit: '%', target: 98, status: 'warning', trend: 'down', responsible: '' },
      { id: 'ppm', label: 'Quality (PPM)', value: 14, unit: '', target: 50, status: 'normal', trend: 'flat', responsible: '' },
      { id: 'cpk', label: 'Avg CpK', value: 1.65, unit: '', target: 1.33, status: 'normal', trend: 'flat', responsible: '' },
    ],
    lines: [
      { id: 'L1', name: 'Press 04', processType: 'stamping', status: 'warning', issue: 'Speed Reduced', oee: 75, cycleTime: 12, telemetry: [], currentProduct: getMockProduct('stamping', 'L1', 75) },
      { id: 'MD-5', name: 'Mold 05', processType: 'molding', status: 'warning', issue: 'Hopper Feed', oee: 78, cycleTime: 12, telemetry: [], currentProduct: getMockProduct('molding', 'MD-5', 78) },
      ...WORKSHOPS_MOCK[0].lines.slice(1, 3)
    ],
    materials: [
      { category: 'Cu Alloys', readiness: 100, fullMark: 100 },
      { category: 'Resins', readiness: 45, fullMark: 100 }, // Warning
      { category: 'Gold Salts', readiness: 90, fullMark: 100 },
      { category: 'Pkg Trays', readiness: 90, fullMark: 100 },
      { category: 'Contacts', readiness: 95, fullMark: 100 },
    ],
    customers: [
      { id: 'C1', name: 'Tesla Global', region: 'NA/EU', segment: 'EV Power', status: 'normal', ordersPending: 44500, ppm: 5, lastShipment: '4h ago', sopData: SOP_MOCK },
      { id: 'C2', name: 'CATL', region: 'APAC', segment: 'Battery', status: 'warning', ordersPending: 125000, ppm: 0, lastShipment: '2h ago', sopData: SOP_MOCK }, 
      { id: 'C3', name: 'Bosch', region: 'EU', segment: 'Signal', status: 'normal', ordersPending: 8500, ppm: 15, lastShipment: '1d ago', sopData: SOP_MOCK, complaints: COMPLAINTS_MOCK },
    ],
    suppliers: SUPPLIERS_DATA,
    qualityData: QUALITY_MOCK,
    workshops: WORKSHOPS_MOCK,
    actions: ACTION_ITEMS_MOCK,
    spcData: [{time: '09:00', v: 1.67}, {time: '09:30', v: 1.65}, {time: '10:00', v: 1.62}, {time: '10:30', v: 1.58}, {time: '11:00', v: 1.55}]
  },
  2: { // 14:00 PM - CRITICAL
    time: "14:00",
    label: "Line Stop",
    kpis: [
      { id: 'oee', label: 'Plant OEE', value: 72, unit: '%', target: 88, status: 'critical', trend: 'down', responsible: 'https://i.pravatar.cc/150?u=mgr1' },
      { id: 'otd', label: 'On Time Del.', value: 92, unit: '%', target: 98, status: 'warning', trend: 'down', responsible: '' },
      { id: 'ppm', label: 'Quality (PPM)', value: 45, unit: '', target: 50, status: 'warning', trend: 'up', responsible: '' },
      { id: 'cpk', label: 'Avg CpK', value: 1.5, unit: '', target: 1.33, status: 'normal', trend: 'flat', responsible: '' },
    ],
    lines: [
      { id: 'L1', name: 'Press 04 (High-Speed)', processType: 'stamping', status: 'critical', issue: 'Slug Control Error', oee: 45, cycleTime: 0, telemetry: [{name: 'Press Force', value: 0, unit: 'kN', status: 'critical'}, {name: 'SPM', value: 0, unit: '', status: 'critical'}], currentProduct: getMockProduct('stamping', 'L1', 45) },
      { id: 'PL-3', name: 'Plating 03', processType: 'plating', status: 'warning', issue: 'pH Level Drift', oee: 88, cycleTime: 10, telemetry: [], currentProduct: getMockProduct('plating', 'PL-3', 88) },
      ...WORKSHOPS_MOCK[0].lines.slice(1, 3)
    ],
    materials: [
      { category: 'Cu Alloys', readiness: 100, fullMark: 100 },
      { category: 'Resins', readiness: 20, fullMark: 100 }, // Critical Low
      { category: 'Gold Salts', readiness: 85, fullMark: 100 },
      { category: 'Pkg Trays', readiness: 80, fullMark: 100 },
      { category: 'Contacts', readiness: 95, fullMark: 100 },
    ],
    customers: [
      { id: 'C1', name: 'Tesla Global', region: 'NA/EU', segment: 'EV Power', status: 'warning', ordersPending: 44000, ppm: 5, lastShipment: '6h ago', sopData: SOP_MOCK, complaints: [...COMPLAINTS_MOCK, { id: 'c3', customer: 'Tesla', type: 'Quality', description: 'Urgent: Line stop at Tesla Berlin due to Connector fitment issue', status: 'Open', department: 'Eng', date: 'Today' }] },
      { id: 'C2', name: 'CATL', region: 'APAC', segment: 'Battery', status: 'critical', ordersPending: 130000, ppm: 0, lastShipment: '4h ago', sopData: SOP_MOCK }, 
      { id: 'C3', name: 'Bosch', region: 'EU', segment: 'Signal', status: 'normal', ordersPending: 8500, ppm: 15, lastShipment: '1d ago', sopData: SOP_MOCK, complaints: COMPLAINTS_MOCK },
    ],
    suppliers: [
       ...SUPPLIERS_DATA.slice(0, 1),
       { id: 'S2', name: 'DuPont Polymers', riskLevel: 9, category: 'Resin (CN)' }, // Risk increase
       ...SUPPLIERS_DATA.slice(2),
    ],
    qualityData: QUALITY_MOCK,
    workshops: WORKSHOPS_MOCK,
    actions: ACTION_ITEMS_MOCK,
    spcData: [{time: '12:00', v: 1.55}, {time: '12:30', v: 1.52}, {time: '13:00', v: 1.50}, {time: '13:30', v: 1.48}, {time: '14:00', v: 1.52}]
  },
};

export default function App() {
  const [activeView, setActiveView] = useState('cockpit');
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  
  const currentData = useMemo(() => DATA_SNAPSHOTS[sliderValue], [sliderValue]);
  const activeLine = currentData.lines.find(l => l.id === selectedLineId);

  // Auto-select problematic line at 14:00 (Scenario 2)
  useEffect(() => {
    if (sliderValue === 2) {
      setSelectedLineId('L1');
    } else {
      setSelectedLineId(null);
    }
  }, [sliderValue]);

  // PRODUCTION ALERT LOGIC: Filter to only show critical/warning lines
  const alertLines = useMemo(() => {
    const problems = currentData.lines.filter(l => l.status !== 'normal');
    // If no problems, returning empty array logic can be handled in render
    return problems;
  }, [currentData.lines]);

  // ACTION CENTER LOGIC: Filter based on selection
  const filteredActions = useMemo(() => {
    if (selectedLineId) {
      return currentData.actions.filter(a => a.machineId === selectedLineId);
    }
    // If no specific line selected, show high priority generic items
    return currentData.actions.filter(a => !a.machineId || a.priority === 'high');
  }, [selectedLineId, currentData.actions]);

  return (
    <div className="flex min-h-screen bg-transparent font-sans text-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <SideNav activeView={activeView} onNavigate={setActiveView} />

      {/* Main Content */}
      <main className="flex-1 md:ml-20 lg:ml-64 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
        
        {/* Top Header */}
        <header className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5 z-40">
          <div>
             <h1 className="text-3xl font-black tracking-tighter text-yellow-400 flex items-center gap-2">
               ENNOVI <span className="text-white/30 font-thin text-xl">|</span> HANGZHOU
             </h1>
             <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-1">
               CONNECTED MOBILITY SOLUTIONS // GIGA-FACTORY
             </p>
          </div>
          
          {/* Time Travel Slider */}
          <div className="flex items-center gap-4 mt-4 md:mt-0 bg-white/5 px-6 py-2 rounded-full border border-white/10">
            <Clock size={16} className="text-yellow-400" />
            <div className="flex flex-col w-48 md:w-64">
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="1" 
                value={sliderValue}
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span className={sliderValue === 0 ? 'text-white font-bold' : ''}>09:00</span>
                <span className={sliderValue === 1 ? 'text-white font-bold' : ''}>11:00</span>
                <span className={sliderValue === 2 ? 'text-white font-bold' : ''}>14:00</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold">{currentData.time}</div>
              <div className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${sliderValue === 2 ? 'bg-red-500 text-white' : sliderValue === 1 ? 'bg-orange-500 text-white' : 'bg-green-500 text-black'}`}>
                {currentData.label}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative custom-scrollbar">
          
          {/* View: Command Center (Cockpit) */}
          {activeView === 'cockpit' && (
            <div className="grid grid-cols-12 gap-6 pb-20">
              
              {/* Left Column: Resources (Input) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 animate-in slide-in-from-left duration-500 z-30">
                <GlassCard title="Material Readiness" subTitle="WIP & RAW SUPPLY // 物料齐套率">
                   <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={currentData.materials}>
                          <PolarGrid stroke="#333" />
                          <PolarAngleAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                          <Radar name="Stock" dataKey="readiness" stroke="#facc15" fill="#facc15" fillOpacity={0.3} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}}
                            itemStyle={{color: '#facc15'}}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                      {currentData.materials.map((m, i) => (
                        <div key={i} className={`text-[10px] px-2 py-1 rounded border ${m.readiness < 50 ? 'border-red-500/50 text-red-400 bg-red-900/10' : 'border-gray-700 text-gray-400'}`}>
                           {m.category}: {m.readiness}%
                        </div>
                      ))}
                   </div>
                </GlassCard>

                <GlassCard title="Supplier Health" subTitle="RISK MONITORING // 供应链风险" variant={sliderValue === 2 ? 'warning' : 'default'}>
                  <SupplierPanel suppliers={currentData.suppliers} />
                </GlassCard>
              </div>

              {/* Middle Column: Results (KPIs) */}
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 z-20">
                
                {/* Executive KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentData.kpis.map((kpi) => (
                    <KPIRing 
                      key={kpi.id} 
                      kpi={kpi} 
                      onClick={() => setSelectedLineId(kpi.status === 'critical' ? 'L1' : null)}
                      isActive={kpi.status === 'critical'}
                    />
                  ))}
                </div>

                {/* Factory Map - ALERT MONITOR FILTERED */}
                <GlassCard 
                  title="Production Alert Monitor" 
                  subTitle="ANOMALY DETECTION // 生产异常监控" 
                  className="flex-1 min-h-[400px] !overflow-visible" 
                  variant={currentData.kpis[0].status === 'critical' ? 'critical' : 'default'}
                >
                  {alertLines.length > 0 ? (
                    <FactoryMap 
                      lines={alertLines} 
                      onLineClick={setSelectedLineId}
                      activeLineId={selectedLineId}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-50">
                       <CheckCircle2 size={64} className="text-green-500 mb-4 shadow-lg shadow-green-500/50 rounded-full" />
                       <h3 className="text-xl font-bold text-green-400">All Systems Nominal</h3>
                       <p className="text-sm text-gray-400">No active production alerts reported.</p>
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* Right Column: Process & Actions */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 animate-in slide-in-from-right duration-500 z-30">
                 
                 {/* Action Center - CONTEXT AWARE */}
                 <GlassCard 
                    title="Action Center" 
                    subTitle={selectedLineId ? `STRATEGY FOR ${selectedLineId}` : "GLOBAL TASK FORCE // 任务中心"}
                    action={
                      <button 
                        onClick={() => setShowQR(!showQR)}
                        className="p-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-lg transition-colors"
                      >
                        <Smartphone size={18} />
                      </button>
                    }
                  >
                    <div className="flex flex-col gap-3">
                      {filteredActions.length > 0 ? filteredActions.map(item => (
                        <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-all group">
                          <img src={item.ownerAvatar || "https://i.pravatar.cc/150"} alt="" className="w-8 h-8 rounded-full border border-gray-600 grayscale group-hover:grayscale-0" />
                          <div className="flex-1">
                             <div className="flex justify-between items-start">
                               <span className="text-sm font-bold text-gray-200">{item.title}</span>
                               <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${item.status === 'doing' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                                 {item.status.toUpperCase()}
                               </span>
                             </div>
                             {item.strategy && (
                               <div className="text-xs text-yellow-400/80 mt-1 italic border-l-2 border-yellow-400/30 pl-2">
                                 "{item.strategy}"
                               </div>
                             )}
                             <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
                               <span className="text-xs text-gray-500">{item.owner}</span>
                               <span className="text-[10px] text-gray-600">{item.timeAgo}</span>
                             </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-gray-500 py-4 text-xs">No specific actions required for current selection.</div>
                      )}

                      {/* Manual Assignment Override */}
                      {currentData.kpis[0].status === 'critical' && !selectedLineId && (
                         <div className="p-3 bg-red-900/10 border border-red-500/30 rounded text-center">
                            <span className="text-xs text-red-400 animate-pulse">Select a red machine to view strategy</span>
                         </div>
                      )}
                    </div>
                 </GlassCard>

                 {/* SPC Quick View - ADDED TIME AXIS */}
                 <GlassCard title="SPC Monitor" subTitle="QUALITY CONTROL // 质量波动">
                    <div className="h-32">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={currentData.spcData}>
                           <Area type="monotone" dataKey="v" stroke="#facc15" fill="#facc15" fillOpacity={0.1} />
                           <XAxis dataKey="time" tick={{fontSize: 9, fill: '#666'}} interval={1} />
                           <YAxis hide domain={[1.3, 1.8]} />
                           <Tooltip contentStyle={{backgroundColor: '#111827', fontSize: '10px'}} />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-mono mt-2">
                       <span>LOWER: 1.33</span>
                       <span className="text-yellow-400">CUR: {currentData.kpis[3].value}</span>
                    </div>
                 </GlassCard>
              </div>
            </div>
          )}

          {/* View: Customers */}
          {activeView === 'customers' && (
            <CustomerPanel customers={currentData.customers} />
          )}

          {/* View: Quality */}
          {activeView === 'quality' && (
             <QualityDashboard data={currentData.qualityData} />
          )}

          {/* View: Production (Digital Twin) */}
          {activeView === 'production' && (
            <ProductionShopView workshops={currentData.workshops} />
          )}

        </div>

        {/* Global Bottom Ticker */}
        <div className="absolute bottom-0 left-0 w-full bg-[#0B1120] border-t border-white/10 h-8 flex items-center overflow-hidden z-30">
           <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap gap-12 text-xs font-mono text-gray-500 px-4">
              <span>SYSTEM STATUS: ONLINE</span>
              <span>LAST SYNC: {currentData.time}:05</span>
              <span className="text-yellow-400">ALERT: {currentData.label.toUpperCase()}</span>
              <span>HANGZHOU SERVER: 24ms LATENCY</span>
              <span>ERP CONNECTION: ACTIVE</span>
              <span>WEATHER: 24°C RAIN</span>
           </div>
        </div>

      </main>

      {/* Overlays / Modals */}
      
      {/* 1. Process Drill Down Modal */}
      {activeLine && (
        <ProcessDrillDown line={activeLine} onClose={() => setSelectedLineId(null)} />
      )}

      {/* 2. QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4 max-w-sm w-full text-black">
              <h3 className="font-bold text-lg">Manager Access</h3>
              <p className="text-sm text-center text-gray-600">Scan to open Mobile Command App</p>
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-black">
                 <Smartphone size={64} className="text-black/20" />
                 {/* Fake QR pattern would go here */}
              </div>
              <button onClick={() => {setShowQR(false); setShowMobile(true);}} className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800">
                Simulate Scan
              </button>
           </div>
        </div>
      )}

      {/* 3. Mobile App Simulation (The "Human-in-the-loop" Demo) */}
      {showMobile && (
        <div className="fixed bottom-4 right-4 z-50 w-[300px] h-[600px] bg-white rounded-[40px] border-8 border-gray-900 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500">
           {/* Notch */}
           <div className="bg-gray-900 h-6 w-1/2 mx-auto rounded-b-xl mb-2"></div>
           
           <div className="flex-1 bg-gray-50 p-4 overflow-y-auto text-gray-800">
              <div className="flex justify-between items-center mb-6">
                 <span className="font-bold text-lg">Task Assignment</span>
                 <X size={20} className="cursor-pointer" onClick={() => setShowMobile(false)} />
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                 <div className="text-xs font-bold text-red-500 uppercase mb-1">Critical Alert</div>
                 <h4 className="font-bold text-xl mb-1">Press 04 Stoppage</h4>
                 <p className="text-sm text-gray-500">OEE dropped to 45%. Slug monitor triggered.</p>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-400 uppercase">Assign To</label>
                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">M</div>
                    <span className="text-sm font-medium">Maintenance Team A</span>
                 </div>

                 <label className="text-xs font-bold text-gray-400 uppercase">Priority</label>
                 <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200">High</button>
                    <button className="flex-1 py-2 bg-white text-gray-400 rounded-lg text-xs font-bold border border-gray-200">Med</button>
                    <button className="flex-1 py-2 bg-white text-gray-400 rounded-lg text-xs font-bold border border-gray-200">Low</button>
                 </div>

                 <label className="text-xs font-bold text-gray-400 uppercase">Action Plan</label>
                 <textarea className="w-full p-3 text-sm bg-white border border-gray-200 rounded-lg h-24" placeholder="Describe required action..."></textarea>
              </div>
           </div>

           <div className="p-4 bg-white border-t border-gray-100">
              <button onClick={() => setShowMobile(false)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-transform">
                 Confirm Assignment
              </button>
           </div>
        </div>
      )}

    </div>
  );
}

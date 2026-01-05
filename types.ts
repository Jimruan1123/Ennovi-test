

export type Status = 'normal' | 'warning' | 'critical';

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  status: Status;
  trend: 'up' | 'down' | 'flat';
  responsible: string; // Avatar URL
}

export interface ProcessMetric {
  name: string;
  value: string | number;
  unit: string;
  status: Status;
}

export interface Product {
  name: string;
  partNumber: string;
  image: string;
  targetOutput: number;
  actualOutput: number;
  efficiency: number;
}

export interface ProductionLine {
  id: string;
  name: string;
  processType: 'stamping' | 'molding' | 'plating' | 'assembly';
  status: Status;
  issue?: string;
  oee: number;
  cycleTime: number; // seconds
  telemetry: ProcessMetric[]; // For drill-down
  currentProduct?: Product;
}

export interface MaterialStatus {
  category: string;
  readiness: number; // 0-100
  fullMark: number;
}

export interface ActionItem {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  owner: string; // Name
  ownerAvatar: string;
  priority: 'high' | 'medium' | 'low';
  timeAgo: string;
  machineId?: string; // Optional linkage to specific machine
  strategy?: string; // Description of the fix strategy
}

export interface SupplierRisk {
  id: string;
  name: string;
  riskLevel: number; // 1-10, 10 is high risk
  category: string;
}

export interface SOPData {
  month: string;
  forecast: number;
  actual: number;
  capacity: number;
  gap: number;
}

export interface Complaint {
  id: string;
  customer: string;
  type: string; // e.g., 'Logistics', 'Quality', 'Admin'
  description: string;
  status: 'Open' | 'Investigating' | 'Closed';
  department: string; // e.g., 'QA', 'Sales', 'Logistics'
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  region: string;
  segment: 'EV Power' | 'Signal' | 'Battery';
  status: Status;
  ordersPending: number;
  ppm: number; // Parts Per Million defects
  lastShipment: string;
  sopData?: SOPData[]; // Sales & Operations Planning Data
  complaints?: Complaint[];
}

export interface COQPData {
  category: string; // Internal Failure, External Failure, Appraisal, Prevention
  cost: number; // in USD
  color: string;
}

export interface DefectType {
  type: string;
  count: number;
}

export interface QualityData {
  fpyTrend: { time: string; value: number }[];
  coqp: COQPData[];
  pareto: DefectType[];
}

export interface SQDCIP {
  s: Status; // Safety
  q: Status; // Quality
  d: Status; // Delivery
  c: Status; // Cost
  i: Status; // Inventory
  p: Status; // People
}

export interface WorkshopData {
  id: string;
  name: string;
  type: 'stamping' | 'molding' | 'plating' | 'assembly';
  sqdcip: SQDCIP;
  lines: ProductionLine[];
  issues: ActionItem[];
}

export interface Snapshot {
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
  spcData: { time: string; v: number }[];
}
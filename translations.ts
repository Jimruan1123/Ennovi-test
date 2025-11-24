
export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    companyName: 'ENNOVI',
    subTitle: 'CONNECTED MOBILITY SOLUTIONS // GIGA-FACTORY',
    shiftStart: 'Shift Start',
    resinWarning: 'Resin Warning',
    lineStop: 'Line Stop',
    systemStatus: 'SYSTEM STATUS: ONLINE',
    lastSync: 'LAST SYNC',
    alert: 'ALERT',
    
    // SideNav
    cockpit: 'Command Center',
    production: 'Line Details',
    customers: 'Customers & CRM',
    quality: 'Quality (SPC)',
    settings: 'Settings',
    
    // Cockpit Titles
    materialReadiness: 'Material Readiness',
    materialSub: 'WIP & RAW SUPPLY',
    supplierHealth: 'Supplier Health',
    supplierSub: 'RISK MONITORING',
    productionAlert: 'Production Alert Monitor',
    productionAlertSub: 'ANOMALY DETECTION',
    actionCenter: 'Action Center',
    taskForce: 'GLOBAL TASK FORCE',
    strategyFor: 'STRATEGY FOR',
    spcMonitor: 'SPC Monitor',
    qualityControl: 'QUALITY CONTROL',
    
    // Empty States / Msgs
    allSystemsNominal: 'All Systems Nominal',
    noActiveAlerts: 'No active production alerts reported.',
    noActions: 'No specific actions required for current selection.',
    selectRedMachine: 'Select a red machine to view strategy',
    
    // Customer Panel
    sopTitle: 'S&OP Demand Planning',
    sopSub: 'DEMAND VS CAPACITY',
    keyAccounts: 'Strategic Key Accounts (Tier 1)',
    vocTitle: 'Key Customer Complaints (VOC)',
    vocSub: 'STATUS & RESOLUTION',
    globalDelivery: 'Global Delivery Volume',
    logisticsAlert: 'Logistics Alert',
    logisticsMsg: 'Shanghai Port congestion affecting EU shipments. Rerouting via Ningbo.',
    
    // Quality Panel
    plantFpy: 'Plant FPY',
    rmaCount: 'RMA Count',
    coqpYtd: 'COQP YTD',
    goalGap: 'Goal Gap',
    coqpBreakdown: 'COQP Breakdown',
    coqpSub: 'FINANCIAL IMPACT',
    fpyTrend: 'FPY Trend (7-Day)',
    fpySub: 'ROLLING YIELD',
    topDefects: 'Top Defects (Pareto)',
    defectsSub: 'DEFECT ANALYSIS',
    actionRequired: 'Action Required:',
    defectMsg: '"Plating Peeling" accounts for 42% of all defects this week. Check Bath B temp.',
    
    // Production Shop
    shopStatus: 'Shop Status',
    performance: 'Performance',
    issueTracker: 'ISSUE TRACKER',
    activeTickets: 'Active Tickets',
    noIssues: 'No active issues.',
    reportIncident: '+ Report New Incident',
    batchProgress: 'Batch Progress',
    systemNormal: 'System functioning normally.',
    history7d: '7-Day History',
    
    // Generic
    efficiency: 'Efficiency (OEE)',
    owner: 'OWNER',
    partNo: 'Part No.',
    output: 'Output',
    running: 'RUNNING',
    liveView: 'LIVE VIEW',
    
    // SQDCIP
    safety: 'Safety',
    quality_sqdcip: 'Quality',
    delivery: 'Delivery',
    cost: 'Cost',
    inventory: 'Inventory',
    people: 'People',

    // New Additions for Modals & Footer
    digitalTwin: 'DIGITAL TWIN // LVL 1',
    northWing: 'NORTH WING ASSEMBLY',
    realtimeOee: 'Real-time OEE',
    liveFeed: 'LIVE FEED',
    systemSeq: 'SYSTEM STATUS: RUNNING AUTOMATION SEQUENCE 44B',
    viewLogs: 'View Logs',
    reqMaint: 'Request Maintenance',
    hangzhouLoc: 'HANGZHOU',
    serverLat: 'HANGZHOU SERVER: 24ms LATENCY',
    erpConn: 'ERP CONNECTION: ACTIVE',
    managerAccess: 'Manager Access',
    scanToOpen: 'Scan to open Mobile Command App',
    simulateScan: 'Simulate Scan',
    taskAssign: 'Task Assignment',
    critAlert: 'Critical Alert',
    assignTo: 'Assign To',
    mainTeamA: 'Maintenance Team A',
    actionPlan: 'Action Plan',
    descAction: 'Describe required action...',
    confirmAssign: 'Confirm Assignment',
    detectedIssue: 'Detected Issue'
  },
  zh: {
    // Header
    companyName: 'ENNOVI',
    subTitle: '互联出行解决方案 // 杭州超级工厂',
    shiftStart: '班次开始 (Shift Start)',
    resinWarning: '树脂缺料 (Resin Warning)',
    lineStop: '产线停机 (Line Stop)',
    systemStatus: '系统状态: 在线',
    lastSync: '最后同步',
    alert: '警报',
    
    // SideNav
    cockpit: '数字指挥中心',
    production: '产线详情',
    customers: '客户与CRM',
    quality: '质量 (SPC)',
    settings: '系统设置',
    
    // Cockpit Titles
    materialReadiness: '物料齐套率',
    materialSub: 'WIP 与 原材料供应',
    supplierHealth: '供应链健康度',
    supplierSub: '风险监控',
    productionAlert: '生产异常监控',
    productionAlertSub: '异常检测',
    actionCenter: '行动指挥中心',
    taskForce: '全厂任务列表',
    strategyFor: '应对策略: ',
    spcMonitor: 'SPC 监控',
    qualityControl: '质量波动',
    
    // Empty States / Msgs
    allSystemsNominal: '系统运行正常',
    noActiveAlerts: '当前未检测到生产警报。',
    noActions: '当前选择无需特殊操作。',
    selectRedMachine: '请选择红色异常设备以查看策略',
    
    // Customer Panel
    sopTitle: 'S&OP 产销协同计划',
    sopSub: '需求 VS 产能',
    keyAccounts: '战略大客户 (Tier 1)',
    vocTitle: '关键客户投诉 (VOC)',
    vocSub: '状态与解决进度',
    globalDelivery: '全球交付量',
    logisticsAlert: '物流警报',
    logisticsMsg: '上海港拥堵影响欧盟发货。正在改道宁波港。',
    
    // Quality Panel
    plantFpy: 'Plant FPY (直通率)',
    rmaCount: 'RMA Count (退货)',
    coqpYtd: 'COQP YTD (质量成本)',
    goalGap: 'Goal Gap (差距)',
    coqpBreakdown: 'COQP Breakdown',
    coqpSub: '财务影响',
    fpyTrend: 'FPY Trend (7天趋势)',
    fpySub: '滚动良率',
    topDefects: 'Top Defects (缺陷分析)',
    defectsSub: '帕累托图',
    actionRequired: '需立即行动:',
    defectMsg: '"电镀剥落" 占本周缺陷的 42%。请检查 B 槽温度。',
    
    // Production Shop
    shopStatus: '车间状态',
    performance: '绩效看板',
    issueTracker: '问题追踪',
    activeTickets: '活跃工单',
    noIssues: '暂无活跃问题。',
    reportIncident: '+ 上报新异常',
    batchProgress: '批次进度',
    systemNormal: '系统运行正常。',
    history7d: '7天历史趋势',
    
    // Generic
    efficiency: 'Efficiency (OEE)',
    owner: '负责人',
    partNo: 'Part No.',
    output: '产出',
    running: '运行中',
    liveView: '实时画面',
    
    // SQDCIP
    safety: '安全 (Safety)',
    quality_sqdcip: '质量 (Quality)',
    delivery: '交付 (Delivery)',
    cost: '成本 (Cost)',
    inventory: '库存 (Inventory)',
    people: '人员 (People)',

    // New Additions for Modals & Footer
    digitalTwin: '数字孪生 // LVL 1',
    northWing: '北翼总装车间',
    realtimeOee: '实时 OEE',
    liveFeed: '实时监控',
    systemSeq: '系统状态: 自动化序列 44B 运行中',
    viewLogs: '查看日志',
    reqMaint: '请求维护',
    hangzhouLoc: '杭州',
    serverLat: '杭州服务器: 24ms 延迟',
    erpConn: 'ERP 连接: 正常',
    managerAccess: '管理者权限',
    scanToOpen: '扫码打开移动指挥端',
    simulateScan: '模拟扫码',
    taskAssign: '任务指派',
    critAlert: '严重警报',
    assignTo: '指派给',
    mainTeamA: '维修一队',
    actionPlan: '行动方案',
    descAction: '描述所需行动...',
    confirmAssign: '确认指派',
    detectedIssue: '检测到异常'
  }
};

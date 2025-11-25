
// This file contains pre-generated 2.5D Isometric SVG assets.
// These are used to populate the Digital Twin view without requiring an API Key at runtime.

// Helper to encode SVG to Data URI
const svgToDataUri = (svgString: string) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
};

// --- COLORS ---
const C = {
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  yellow400: '#facc15',
  yellow500: '#eab308',
  orange500: '#f97316',
  orange600: '#ea580c',
  copperLight: '#fcd34d',
  copperMed: '#d97706',
  copperDark: '#92400e',
};

// --- 1. PRODUCT ASSETS ---

const HV_CONNECTOR_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="4" dy="4" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g transform="translate(100, 100)" filter="url(#shadow)">
    <!-- Main Body Orange -->
    <path d="M-50 -20 L0 -45 L50 -20 L0 5 Z" fill="${C.orange500}"/>
    <path d="M-50 -20 L-50 30 L0 55 L0 5 Z" fill="${C.orange600}"/>
    <path d="M0 55 L50 30 L50 -20 L0 5 Z" fill="${C.orange500}" fill-opacity="0.8"/>
    <!-- Black Insert -->
    <path d="M-30 -10 L0 -25 L30 -10 L0 5 Z" fill="${C.slate900}" fill-opacity="0.8"/>
    <!-- Pins -->
    <g transform="translate(-10, -10)"><rect width="4" height="10" fill="${C.yellow400}" transform="skewY(26)"/></g>
    <g transform="translate(6, -10)"><rect width="4" height="10" fill="${C.yellow400}" transform="skewY(26)"/></g>
    <!-- Lock Tab -->
    <path d="M-10 40 L10 30 L10 35 L-10 45 Z" fill="${C.slate800}"/>
  </g>
</svg>
`;

const BUSBAR_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="shadow"><feDropShadow dx="4" dy="4" stdDeviation="4" flood-opacity="0.3"/></filter></defs>
  <g transform="translate(80, 80)" filter="url(#shadow)">
    <!-- Copper Bent Bar -->
    <path d="M0 0 L40 -20 L80 0 L40 20 Z" fill="${C.copperLight}"/>
    <path d="M0 0 L0 60 L40 80 L40 20 Z" fill="${C.copperMed}"/>
    <path d="M40 80 L80 60 L80 0 L40 20 Z" fill="${C.copperDark}"/>
    <!-- Insulation Orange -->
    <path d="M-5 55 L35 75 L35 25 L-5 5 Z" fill="${C.orange600}" opacity="0.8"/>
    <!-- Terminal Hole -->
    <circle cx="40" cy="-5" r="5" fill="${C.slate900}" transform="scale(1, 0.5)"/>
  </g>
</svg>
`;

const SENSOR_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="glow"><feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${C.yellow400}"/></filter></defs>
  <g transform="translate(100, 100)">
     <path d="M-40 -10 L-20 0 L-20 20 L-40 10 Z" fill="${C.slate500}"/>
     <path d="M-40 -10 L-20 0 L0 -10 L-20 -20 Z" fill="${C.slate600}"/>
     <path d="M-20 0 L0 -10 L0 10 L-20 20 Z" fill="${C.slate700}"/>
     <!-- Gold Plating -->
     <path d="M40 -20 L70 -5 L70 5 L40 0 Z" fill="${C.yellow400}" filter="url(#glow)"/>
     <path d="M40 -20 L40 0 L0 0 L0 -10 Z" fill="${C.slate500}"/>
  </g>
</svg>
`;

// --- 2. MACHINE ASSETS ---

const STAMPING_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 110)">
    <!-- Base -->
    <path d="M-60 50 L0 80 L60 50 L0 20 Z" fill="${C.slate600}" stroke="${C.slate500}"/>
    <path d="M-60 50 L-60 70 L0 100 L0 80 Z" fill="${C.slate700}" stroke="${C.slate500}"/>
    <path d="M0 100 L60 70 L60 50 L0 80 Z" fill="${C.slate800}" stroke="${C.slate500}"/>
    <!-- Columns -->
    <path d="M-50 25 L-30 35 L-30 -60 L-50 -70 Z" fill="${C.slate700}"/>
    <path d="M30 35 L50 25 L50 -70 L30 -60 Z" fill="${C.slate800}"/>
    <!-- Head -->
    <path d="M-55 -70 L0 -95 L55 -70 L0 -45 Z" fill="${C.slate600}"/>
    <path d="M-55 -70 L-55 -40 L0 -15 L0 -45 Z" fill="${C.slate700}"/>
    <path d="M0 -15 L55 -40 L55 -70 L0 -45 Z" fill="${C.slate800}"/>
    <!-- Slide -->
    <path d="M-25 -40 L0 -52 L25 -40 L0 -28 Z" fill="${C.yellow400}"/>
    <path d="M-25 -40 L-25 0 L0 12 L0 -28 Z" fill="${C.yellow500}"/>
    <path d="M0 12 L25 0 L25 -40 L0 -28 Z" fill="${C.yellow500}"/>
  </g>
</svg>
`;

const MOLDING_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 110)">
     <!-- Clamping Unit -->
     <path d="M-80 30 L0 70 L80 30 L0 -10 Z" fill="${C.slate600}"/>
     <path d="M-80 30 L-80 50 L0 90 L0 70 Z" fill="${C.slate700}"/>
     <path d="M0 90 L80 50 L80 30 L0 70 Z" fill="${C.slate800}"/>
     <!-- Mold -->
     <path d="M-50 10 L-20 25 L-20 -20 L-50 -35 Z" fill="${C.slate500}"/>
     <!-- Injection Unit -->
     <path d="M20 -10 L70 -35 L70 -15 L20 10 Z" fill="${C.slate800}"/>
     <!-- Hopper -->
     <path d="M40 -30 L50 -60 L65 -65 L55 -35 Z" fill="${C.blue600}"/>
  </g>
</svg>
`;

const PLATING_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
    <!-- Tanks -->
    <path d="M-65 20 L-25 40 L15 20 L-25 0 Z" fill="${C.slate600}"/>
    <path d="M-65 20 L-65 50 L-25 70 L-25 40 Z" fill="${C.slate700}"/>
    <path d="M-25 70 L15 50 L15 20 L-25 40 Z" fill="${C.slate800}"/>
    <!-- Liquid -->
    <path d="M-60 22 L-25 38 L10 22 L-25 6 Z" fill="${C.blue500}" opacity="0.6"/>
    <!-- Second Tank -->
    <g transform="translate(40, -20)">
        <path d="M-65 20 L-25 40 L15 20 L-25 0 Z" fill="${C.slate600}"/>
        <path d="M-65 20 L-65 50 L-25 70 L-25 40 Z" fill="${C.slate700}"/>
        <path d="M-25 70 L15 50 L15 20 L-25 40 Z" fill="${C.slate800}"/>
        <path d="M-60 22 L-25 38 L10 22 L-25 6 Z" fill="${C.yellow400}" opacity="0.6"/>
    </g>
    <!-- Gantry -->
    <path d="M-70 -40 L70 30" stroke="${C.slate500}" stroke-width="4"/>
    <path d="M-70 60 L-70 -40" stroke="${C.slate500}" stroke-width="2"/>
    <path d="M70 130 L70 30" stroke="${C.slate500}" stroke-width="2"/>
  </g>
</svg>
`;

const ASSEMBLY_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
     <!-- Conveyor -->
     <path d="M-90 45 L90 -45" stroke="${C.slate800}" stroke-width="24" stroke-linecap="round"/>
     <path d="M-90 45 L90 -45" stroke="${C.slate600}" stroke-width="18" stroke-dasharray="10 10"/>
     <!-- Robot Base -->
     <ellipse cx="0" cy="20" rx="25" ry="12" fill="${C.slate800}"/>
     <path d="M0 20 L0 -30" stroke="${C.slate500}" stroke-width="8"/>
     <!-- Arm -->
     <circle cx="0" cy="-30" r="8" fill="${C.orange500}"/>
     <path d="M0 -30 L40 -60" stroke="${C.slate500}" stroke-width="6"/>
     <circle cx="40" cy="-60" r="6" fill="${C.orange500}"/>
     <path d="M40 -60 L50 -50" stroke="${C.orange500}" stroke-width="3"/>
  </g>
</svg>
`;

export const STATIC_ASSETS = {
  // Products
  'global_product_auto_v4_HV Connector Hsg': svgToDataUri(HV_CONNECTOR_SVG),
  'global_product_auto_v4_Busbar Clip': svgToDataUri(BUSBAR_SVG),
  'global_product_auto_v4_Sensor Terminal': svgToDataUri(SENSOR_SVG),
  
  // Machines
  'global_asset_stamping': svgToDataUri(STAMPING_SVG),
  'global_asset_molding': svgToDataUri(MOLDING_SVG),
  'global_asset_plating': svgToDataUri(PLATING_SVG),
  'global_asset_assembly': svgToDataUri(ASSEMBLY_SVG),
};

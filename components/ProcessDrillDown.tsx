
import React, { useState, useEffect } from 'react';
import { ProductionLine } from '../types';
import { X, Activity, Thermometer, Gauge, RefreshCw, AlertTriangle, FileText, Image as ImageIcon, Save } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
// Dynamic import is used below to prevent load crashes
// import { GoogleGenAI } from "@google/genai"; 

interface ProcessDrillDownProps {
  line: ProductionLine;
  onClose: () => void;
}

// Helper to safely get API key
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environment access failed");
  }
  return '';
};

// --- IMAGE COMPRESSION UTILITY ---
// Reduces 1MB+ PNGs to ~50KB JPEGs to fit in LocalStorage
const compressImage = (base64Str: string, maxWidth = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      const width = maxWidth;
      const height = img.height * ratio;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Export as JPEG with 0.7 quality
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressed);
      } else {
        resolve(base64Str); // Fallback
      }
    };
    img.onerror = () => resolve(base64Str); // Fallback
  });
};

// --- SVG GENERATOR LOGIC (Fallback / Blueprint) ---
const getSchematicSVG = (line: ProductionLine) => {
  const status = line.status;
  const processType = line.processType;
  const accent = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f97316' : '#22c55e';
  const strokeColor = '#60a5fa';
  
  let machineGeometry = '';
  
  if (processType === 'stamping') {
    machineGeometry = `
      <g transform="translate(400, 280) scale(1.2)">
        <path d="M-120 40 L0 100 L120 40 L0 -20 Z" fill="rgba(30, 58, 138, 0.5)" stroke="${strokeColor}" stroke-width="2" />
        <path d="M-100 50 L-60 70 L-60 -120 L-100 -140 Z" fill="none" stroke="${strokeColor}" stroke-width="2"/>
        <path d="M30 55 L70 75 L70 -115 L30 -135 Z" fill="none" stroke="${strokeColor}" stroke-width="2"/>
        <path d="M-110 -140 L0 -195 L110 -140 L0 -85 Z" fill="rgba(30,58,138,0.8)" stroke="${strokeColor}" stroke-width="2"/>
        <path d="M-50 -80 L0 -105 L50 -80 L0 -55 Z" fill="${accent}" fill-opacity="0.3" stroke="${accent}" stroke-width="2"></path>
      </g>
    `;
  } else if (processType === 'molding') {
    machineGeometry = `
      <g transform="translate(400, 250) scale(1.1)">
         <path d="M-200 60 L0 160 L200 60 L0 -40 Z" fill="rgba(30, 58, 138, 0.5)" stroke="${strokeColor}" stroke-width="2" />
         <path d="M-180 0 L-80 50 L-80 -80 L-180 -130 Z" fill="none" stroke="${strokeColor}" stroke-width="2" />
         <path d="M20 -20 L150 -85 L150 -35 L20 30 Z" fill="none" stroke="${strokeColor}" stroke-width="2" />
         <path d="M80 -60 L100 -120 L140 -130 L120 -80 Z" fill="${accent}" fill-opacity="0.2" stroke="${accent}" />
      </g>
    `;
  } else {
    machineGeometry = `
       <g transform="translate(400, 250) scale(1.3)">
          <path d="M-200 50 L200 -150" stroke="${strokeColor}" stroke-width="40" stroke-linecap="round" opacity="0.5"/>
          <ellipse cx="0" cy="50" rx="60" ry="30" fill="none" stroke="${strokeColor}" stroke-width="2" />
          <path d="M0 50 L0 -50" stroke="${strokeColor}" stroke-width="12" />
          <path d="M0 -50 L80 -100" stroke="${strokeColor}" stroke-width="8" />
       </g>
    `;
  }

  const svgContent = `
    <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="23" patternUnits="userSpaceOnUse">
           <path d="M 40 0 L 0 0 0 23" fill="none" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1"/>
        </pattern>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <rect width="100%" height="100%" fill="url(#grid)" transform="skewY(-15)" opacity="0.5" />
      ${machineGeometry}
      <text x="30" y="474" font-family="monospace" font-size="10" fill="${strokeColor}" font-weight="bold">SCHEMATIC BLUEPRINT // REV.A</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
};

export const ProcessDrillDown: React.FC<ProcessDrillDownProps> = ({ line, onClose }) => {
  const { t } = useLanguage();
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'schematic' | 'ai'>('schematic');

  // Load history/cache - CHECK FOR GLOBAL ASSET
  useEffect(() => {
    // Check for GLOBAL asset for this process type first
    const globalAsset = localStorage.getItem(`global_asset_${line.processType}`);
    
    if (globalAsset) {
      setDisplayImage(globalAsset);
      setViewMode('ai');
    } else {
      setDisplayImage(getSchematicSVG(line));
      setViewMode('schematic');
    }
  }, [line]);

  const historyData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.random() * 100
  }));

  const handleSwitchToSchematic = () => {
    setViewMode('schematic');
    setDisplayImage(getSchematicSVG(line));
    setErrorMsg(null);
  };

  const handleGenerateAI = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setErrorMsg("API Key not found. Please check your environment variables.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setViewMode('ai');

    try {
      // Dynamically import GenAI to prevent startup crashes
      const { GoogleGenAI } = await import("@google/genai");
      
      const ai = new GoogleGenAI({ apiKey });
      
      // Prompt for gemini-2.5-flash-image
      // We request a generic machine of this TYPE, not specific to this instance, to reuse it.
      const prompt = `
        Create a professional, high-fidelity 2.5D isometric industrial vector illustration of a generic ${line.processType} machine.
        
        Style Requirements:
        - Style: Flat vector art, technical infographic style (like Adobe Illustrator).
        - Perspective: Strict Isometric projection (30-degree angles).
        - Color Palette: Industrial Slate Grey, White, and Safety Yellow accents.
        - Background: Solid dark color #080b12 (to match the application background seamlessly).
        - Lighting: Soft, studio lighting, no harsh shadows.
        - Details: Display mechanical components clearly.
        
        The image should look like a premium asset for a digital dashboard. No text, no labels.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        },
      });

      let foundImage = false;
      if (response && response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const base64Image = `data:image/png;base64,${part.inlineData.data}`;
            
            // --- COMPRESS AND SAVE GLOBALLY ---
            try {
              const compressed = await compressImage(base64Image);
              
              // Save as GLOBAL asset for this process type
              localStorage.setItem(`global_asset_${line.processType}`, compressed);
              
              // Dispatch event to update all views
              window.dispatchEvent(new Event('assetUpdated'));
              
              setDisplayImage(compressed);
              foundImage = true;
            } catch (storageErr) {
              console.error("Storage quota exceeded:", storageErr);
              // Even if save fails, show the image temporarily
              setDisplayImage(base64Image);
              setErrorMsg("Storage full: Image shown but not saved.");
              foundImage = true;
            }
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("No image data returned from API.");
      }

    } catch (err: any) {
      console.error("AI Generation failed:", err);
      setErrorMsg(err.message || "Generation failed");
      if (!displayImage) handleSwitchToSchematic();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0B1120] border border-yellow-400/30 rounded-2xl shadow-[0_0_100px_rgba(250,204,21,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">{line.name}</h2>
               <span className="px-2 py-0.5 rounded border border-yellow-400/30 text-yellow-400 text-xs font-mono">
                 {line.processType.toUpperCase()}
               </span>
            </div>
            <p className="text-sm text-gray-400 font-mono mt-1">ASSET_ID: ENV-HZ-{line.id}-001</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Telemetry Grid */}
          <div className="grid grid-cols-2 gap-4">
            {line.telemetry.map((metric, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-yellow-400/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs text-gray-400 uppercase tracking-wider">{metric.name}</span>
                   {metric.name.includes("Temp") ? <Thermometer size={14} className="text-yellow-400"/> :
                    metric.name.includes("Pressure") ? <Gauge size={14} className="text-blue-400"/> :
                    <Activity size={14} className="text-green-400"/>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-mono font-bold text-white">{metric.value}</span>
                  <span className="text-xs text-gray-500">{metric.unit}</span>
                </div>
                <div className="w-full bg-gray-800 h-1 mt-3 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-transparent to-yellow-400 w-[70%]" />
                </div>
              </div>
            ))}
            
            {/* OEE Big Card */}
            <div className="col-span-2 bg-gradient-to-r from-yellow-400/10 to-transparent p-4 rounded-xl border border-yellow-400/20 flex items-center justify-between">
               <div>
                 <span className="text-xs text-yellow-400 font-bold uppercase">{t('realtimeOee')}</span>
                 <div className="text-4xl font-black text-white mt-1">{line.oee}%</div>
               </div>
               <div className="h-16 w-32">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={historyData}>
                     <Area type="monotone" dataKey="value" stroke="#facc15" fill="#facc15" fillOpacity={0.2} strokeWidth={2} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Machine Visualization Container */}
          <div className="bg-black relative rounded-xl overflow-hidden border border-white/20 min-h-[250px] flex flex-col group">
             
             {/* Status Badge */}
             <div className="absolute top-3 left-3 z-30 flex gap-2">
                <span className={`
                  ${isGenerating ? 'bg-neon-cyan' : viewMode === 'ai' ? 'bg-purple-600' : 'bg-blue-600'} 
                  text-white text-[9px] font-bold px-2 py-0.5 rounded animate-pulse shadow-lg
                `}>
                    {isGenerating ? 'AI GENERATING...' : viewMode === 'ai' ? 'GEMINI DIGITAL TWIN' : 'SCHEMATIC BLUEPRINT'}
                </span>
             </div>
             
             {/* Main Viewport */}
             <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
               {isGenerating ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                       <RefreshCw className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
                       <span className="text-neon-cyan font-mono text-sm tracking-widest animate-pulse">GENERATING 2.5D MODEL...</span>
                       <span className="text-gray-500 text-xs mt-2">Converting to Global Asset...</span>
                   </div>
               ) : displayImage ? (
                   <div className="w-full h-full relative group/img animate-in fade-in duration-500">
                       <img src={displayImage} alt="Machine Visualization" className="w-full h-full object-cover" />
                       
                       {/* Overlay Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                       
                       {/* Cached Indicator */}
                       {viewMode === 'ai' && !isGenerating && (
                         <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/20 border border-green-500/50 text-green-400 px-2 py-1 rounded text-[9px] font-bold backdrop-blur-md">
                           <Save size={10} />
                           <span>GLOBAL ASSET SAVED</span>
                         </div>
                       )}

                       {/* Controls Overlay */}
                       <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm border-t border-white/10 flex justify-between items-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] text-gray-400 font-mono">RENDER: {viewMode === 'ai' ? 'AI_TWIN_V2' : 'CAD_WIRE_V1'}</span>
                       </div>
                   </div>
               ) : (
                   <div className="text-gray-500 text-xs font-mono">NO VISUAL DATA</div>
               )}
               
               {/* Error Message */}
               {errorMsg && (
                 <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-50">
                   <AlertTriangle className="text-red-400 w-10 h-10 mb-2" />
                   <h3 className="text-white font-bold">System Alert</h3>
                   <p className="text-red-200 text-xs mt-1">{errorMsg}</p>
                   <button 
                     onClick={() => setErrorMsg(null)}
                     className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm text-white"
                   >
                     Dismiss
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex flex-wrap justify-end gap-3">
           
           {viewMode === 'ai' ? (
             <button 
               onClick={handleSwitchToSchematic}
               className="px-4 py-2 text-sm border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded transition-all flex items-center gap-2"
             >
               <FileText size={16} />
               SHOW BLUEPRINT
             </button>
           ) : (
             <button 
               onClick={handleGenerateAI}
               disabled={isGenerating}
               className="px-4 py-2 text-sm border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
             >
               <ImageIcon size={16} />
               GENERATE GLOBAL AI TWIN
             </button>
           )}
          
          <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded transition-colors shadow-lg shadow-yellow-400/20">
            {t('reqMaint')}
          </button>
        </div>
      </div>
    </div>
  );
};

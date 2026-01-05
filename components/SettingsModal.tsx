
import React, { useState, useEffect, useRef } from 'react';
import { X, Cpu, Loader2, Database, FileCode, Copy, Check, FileJson, Terminal, PackageOpen, Zap, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { STATIC_ASSETS } from '../data/staticAssets';

interface SettingsModalProps {
  onClose: () => void;
}

const ASSET_MANIFEST = [
  { key: 'global_asset_v7_stamping', name: 'Stamping Press', prompt: 'Isometric view of a futuristic industrial stamping press machine, heavy steel construction, metallic grey with safety yellow accents, dark background, high fidelity 3d render, cinematic lighting, game asset style' },
  { key: 'global_asset_v7_molding', name: 'Injection Molder', prompt: 'Isometric view of a high-tech injection molding machine, complex industrial machinery, white and blue color scheme, dark background, 3d render, unreal engine 5 style' },
  { key: 'global_asset_v7_plating', name: 'Plating Line', prompt: 'Isometric view of an industrial chemical plating tank system, modular manufacturing equipment, stainless steel and glass, dark background, 3d render' },
  { key: 'global_asset_v7_assembly', name: 'Assembly Robot', prompt: 'Isometric view of an orange industrial robotic arm on a mounting base, high tech automation equipment, dark background, 3d render, sharp focus' },
  { key: 'global_product_auto_v7_HV Connector Hsg', name: 'HV Connector', prompt: 'Isometric view of an orange high-voltage EV connector housing, automotive plastic component, technical product visualization, dark background, macro photography style' },
  { key: 'global_product_auto_v7_Busbar Clip', name: 'Busbar Clip', prompt: 'Isometric view of a copper electrical busbar clip, shiny metallic texture, automotive electrical component, dark background, 3d render' },
  { key: 'global_product_auto_v7_Sensor Terminal', name: 'Sensor Terminal', prompt: 'Isometric view of a gold-plated electrical sensor terminal, tiny intricate metal component, dark background, macro 3d render' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [assetSource, setAssetSource] = useState<'static' | 'ai'>('static');
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCodeView, setShowCodeView] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const codeTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const version = localStorage.getItem('asset_version_control');
    if (version === 'custom_ai_v1') {
      setAssetSource('ai');
    } else {
      setAssetSource('static');
    }

    const initialPreviews: Record<string, string> = {};
    ASSET_MANIFEST.forEach(item => {
      const cached = localStorage.getItem(item.key);
      if (cached) initialPreviews[item.key] = cached;
      else if (STATIC_ASSETS[item.key as keyof typeof STATIC_ASSETS]) {
        // @ts-ignore
        initialPreviews[item.key] = STATIC_ASSETS[item.key as keyof typeof STATIC_ASSETS];
      }
    });
    setPreviews(initialPreviews);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const getApiKey = () => {
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        // @ts-ignore
        return process.env.API_KEY;
      }
    } catch (e) {}
    return '';
  };

  const optimizeImage = (base64Str: string, maxWidth = 160, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
           const optimized = canvas.toDataURL('image/webp', quality);
           resolve(optimized);
        } else {
           resolve(base64Str); 
        }
      };
      img.onerror = () => resolve(base64Str); 
    });
  };

  const handleReset = () => {
    if(!confirm("Reset all assets to defaults?")) return;
    Object.entries(STATIC_ASSETS).forEach(([key, value]) => localStorage.setItem(key, value));
    localStorage.removeItem('asset_version_control');
    setAssetSource('static');
    window.dispatchEvent(new Event('assetUpdated'));
    addLog("Defaults Restored.");
  };

  const handleLoadPresets = () => {
    addLog("Loading Presets...");
    ASSET_MANIFEST.forEach(item => {
      // @ts-ignore
      const preset = STATIC_ASSETS[item.key];
      if (preset) localStorage.setItem(item.key, preset);
    });
    localStorage.setItem('asset_version_control', 'custom_ai_v1'); 
    setAssetSource('ai');
    window.dispatchEvent(new Event('assetUpdated'));
    addLog("Done.");
  };

  const generateFullFileContent = () => {
    let fileContent = `export const STATIC_ASSETS = {\n`;
    const allKeys = new Set([...Object.keys(STATIC_ASSETS), ...Object.keys(previews)]);
    allKeys.forEach(key => {
      // @ts-ignore
      const val = previews[key] || STATIC_ASSETS[key];
      if (val) fileContent += `  '${key}': '${val}',\n`;
    });
    fileContent += `};\n`;
    return fileContent;
  };

  const handleOpenCodeView = () => {
    setGeneratedCode(generateFullFileContent());
    setShowCodeView(true);
  };

  const handleCopySingleKey = (key: string) => {
     const val = previews[key];
     if (val) {
       navigator.clipboard.writeText(`'${key}': '${val}',`).then(() => {
          setCopiedKey(key);
          setTimeout(() => setCopiedKey(null), 1500);
       });
     }
  };

  const handleGenerate = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      addLog("ERROR: API Key not found.");
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setLogs([]);
    addLog("Starting...");

    try {
      const ai = new GoogleGenAI({ apiKey });
      let completed = 0;

      for (const item of ASSET_MANIFEST) {
        setCurrentStep(completed + 1);
        addLog(`Generating ${item.name}...`);
        
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: item.prompt }] },
            config: {}
          });

          let base64Img = null;
          if (response.candidates?.[0]?.content?.parts) {
             for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                   base64Img = part.inlineData.data;
                   break;
                }
             }
          }

          if (base64Img) {
            const rawUri = `data:image/png;base64,${base64Img}`;
            const optimizedUri = await optimizeImage(rawUri);
            
            try {
              localStorage.setItem(item.key, optimizedUri);
              setPreviews(prev => ({...prev, [item.key]: optimizedUri}));
              addLog(`Saved ${item.name}`);
            } catch (err) {
              addLog(`Storage Full - Skip ${item.name}`);
            }
          } else {
            addLog(`Failed: ${item.name}`);
          }
        } catch (err: any) {
          addLog(`Error: ${err.message}`);
        }
        completed++;
      }

      localStorage.setItem('asset_version_control', 'custom_ai_v1');
      setAssetSource('ai');
      window.dispatchEvent(new Event('assetUpdated'));
      
    } catch (e: any) {
      addLog(`Fatal Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] relative overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
             <Cpu size={24} className="text-neon-cyan" />
             <h2 className="text-xl font-bold text-white tracking-wide">DIGITAL TWIN CONSOLE</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {showCodeView && (
          <div className="absolute inset-0 z-[100] bg-[#0B1120] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                   <Terminal size={20} /> GENERATED ASSET CODE
                </h3>
                <button 
                  onClick={() => setShowCodeView(false)} 
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-bold text-sm"
                >
                  DONE
                </button>
             </div>
             <div className="flex-1 relative">
                <textarea 
                  ref={codeTextAreaRef}
                  readOnly
                  value={generatedCode}
                  className="w-full h-full bg-black border border-green-500/30 text-green-500/80 font-mono text-xs p-4 rounded focus:outline-none focus:border-green-500 resize-none"
                  onClick={(e) => e.currentTarget.select()}
                />
             </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
           <div className="flex-1 p-6 overflow-y-auto border-r border-white/10">
              
              <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                assetSource === 'ai' 
                  ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                  : 'bg-blue-900/10 border-blue-500/30'
              }`}>
                  <div className={`p-2 rounded-full ${assetSource === 'ai' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {assetSource === 'ai' ? <Database size={20} /> : <FileCode size={20} />}
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase ${assetSource === 'ai' ? 'text-purple-400' : 'text-blue-400'}`}>
                      Current Asset Source
                    </div>
                    <div className="text-sm font-bold text-white">
                      {assetSource === 'ai' ? 'AI Digital Twin' : 'Static Schematics'}
                    </div>
                  </div>
              </div>

              <div className="mb-6">
                 <button 
                   onClick={handleLoadPresets}
                   className="w-full py-3 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-cyan/50 hover:border-neon-cyan text-white rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-lg hover:shadow-neon-cyan/20 group"
                 >
                    <PackageOpen size={18} className="group-hover:scale-110 transition-transform" />
                    LOAD BUILT-IN ASSETS (NO KEY)
                 </button>
              </div>

              <div className="border-t border-white/10 my-4 pt-4 space-y-4">
                  {isGenerating && (
                    <div className="space-y-2 bg-gray-900/50 p-3 rounded border border-white/10">
                        <div className="flex justify-between text-xs text-neon-cyan font-bold">
                          <span className="animate-pulse">GENERATING {currentStep}/{ASSET_MANIFEST.length}</span>
                          <Loader2 size={14} className="animate-spin" />
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-neon-cyan transition-all duration-300" style={{width: `${(currentStep / ASSET_MANIFEST.length) * 100}%`}} />
                        </div>
                    </div>
                  )}

                  <div className="h-32 bg-black/50 rounded border border-white/10 p-3 overflow-y-auto font-mono text-[10px] space-y-1">
                    {logs.map((log, i) => (
                        <div key={i} className={log.includes("ERROR") || log.includes("FAILED") ? "text-red-400" : log.includes("SUCCESS") ? "text-green-400" : "text-gray-400"}>
                          {log}
                        </div>
                    ))}
                  </div>
              </div>
           </div>

           <div className="flex-1 p-6 bg-black/20 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Asset Library</h3>
                 <button 
                    onClick={handleOpenCodeView}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all border bg-white/10 text-white border-white/20 hover:bg-white/20"
                 >
                    <FileJson size={14} />
                    <span>VIEW RAW CODE</span>
                 </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                 {ASSET_MANIFEST.map((item) => {
                    const hasAsset = !!previews[item.key];
                    const size = hasAsset ? Math.round(previews[item.key].length * 0.75 / 1024) : 0;
                    const isCopied = copiedKey === item.key;
                    
                    return (
                    <div key={item.key} className="relative group bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all overflow-hidden aspect-square flex flex-col">
                       <div className="flex-1 relative flex items-center justify-center p-2">
                          {hasAsset ? (
                             <img src={previews[item.key]} alt={item.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                          ) : (
                             <div className="text-gray-700 text-[10px] font-mono">MISSING</div>
                          )}
                       </div>
                       
                        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleCopySingleKey(item.key)}
                            title="Copy single asset string"
                            className={`p-1.5 rounded transition-all shadow-lg cursor-pointer border border-black ${
                                isCopied ? 'bg-green-500 text-black' : 'bg-black/80 text-white hover:bg-neon-cyan hover:text-black'
                            }`}
                          >
                             {isCopied ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                       </div>

                       <div className="p-2 bg-black/40 text-[9px] text-gray-400 font-mono border-t border-white/5 flex justify-between items-center">
                          <span className="truncate max-w-[80px]" title={item.name}>{item.name}</span>
                          <span className={size > 3 ? 'text-yellow-500' : 'text-green-500'}>{size}KB</span>
                       </div>
                    </div>
                 )})}
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-between items-center">
           <button 
             onClick={handleReset}
             disabled={isGenerating}
             className="px-4 py-2 text-red-400 hover:bg-red-900/20 rounded flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50"
           >
              <Trash2 size={16} /> RESET
           </button>

           <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-bold">
                  CLOSE
              </button>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`px-6 py-2 rounded flex items-center gap-2 text-sm font-bold transition-all ${
                    isGenerating 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-neon-cyan text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                }`}
              >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                  {isGenerating ? 'GENERATING...' : 'RE-GENERATE ALL'}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

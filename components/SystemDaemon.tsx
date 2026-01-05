
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';

// Define the assets we want to enhance from SVG to AI
const ASSET_QUEUE = [
  { key: 'global_asset_v7_stamping', name: 'Stamping Press', prompt: 'Isometric view of a futuristic industrial stamping press machine, heavy steel construction, metallic grey with safety yellow accents, dark background, high fidelity 3d render, cinematic lighting, game asset style' },
  { key: 'global_asset_v7_molding', name: 'Injection Molder', prompt: 'Isometric view of a high-tech injection molding machine, complex industrial machinery, white and blue color scheme, dark background, 3d render, unreal engine 5 style' },
  { key: 'global_asset_v7_plating', name: 'Plating Line', prompt: 'Isometric view of an industrial chemical plating tank system, modular manufacturing equipment, stainless steel and glass, dark background, 3d render' },
  { key: 'global_asset_v7_assembly', name: 'Assembly Robot', prompt: 'Isometric view of an orange industrial robotic arm on a mounting base, high tech automation equipment, dark background, 3d render, sharp focus' },
  { key: 'global_product_auto_v7_HV Connector Hsg', name: 'HV Connector', prompt: 'Isometric view of an orange high-voltage EV connector housing, automotive plastic component, technical product visualization, dark background, macro photography style' },
  { key: 'global_product_auto_v7_Busbar Clip', name: 'Busbar Clip', prompt: 'Isometric view of a copper electrical busbar clip, shiny metallic texture, automotive electrical component, dark background, 3d render' },
  { key: 'global_product_auto_v7_Sensor Terminal', name: 'Sensor Terminal', prompt: 'Isometric view of a gold-plated electrical sensor terminal, tiny intricate metal component, dark background, macro 3d render' },
];

export const SystemDaemon: React.FC = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [completed, setCompleted] = useState(0);
  const [total] = useState(ASSET_QUEUE.length);

  // Helper: Aggressive Image Optimization
  const optimizeImage = (base64Str: string, maxWidth = 100, quality = 0.5): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str.startsWith('data:') ? base64Str : `data:image/png;base64,${base64Str}`;
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

  useEffect(() => {
    const runDaemon = async () => {
      // 1. Check if we need to run
      const version = localStorage.getItem('asset_version_control');
      if (version === 'custom_ai_v1') return;

      // Check API Key SAFELY
      let apiKey = '';
      try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env) {
            // @ts-ignore
            apiKey = process.env.API_KEY;
        }
      } catch (e) {}

      if (!apiKey) {
         console.warn("Daemon: No API Key found. Background generation disabled.");
         return;
      }

      setIsWorking(true);
      const ai = new GoogleGenAI({ apiKey });

      for (const item of ASSET_QUEUE) {
        const currentVal = localStorage.getItem(item.key);
        // Skip if already improved (heuristic check)
        if (currentVal && currentVal.length > 15000) { 
           setCompleted(prev => prev + 1);
           continue; 
        }

        setCurrentTask(item.name);
        
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
             const optimized = await optimizeImage(base64Img);
             // HOT SWAP: Overwrite the key immediately
             localStorage.setItem(item.key, optimized);
             // TRIGGER UPDATE: Tell the app to re-render this asset
             window.dispatchEvent(new Event('assetUpdated'));
          }
        } catch (e) {
          console.error(`Daemon Error [${item.name}]:`, e);
        }
        
        setCompleted(prev => prev + 1);
        // Small delay to prevent rate limiting and let UI breathe
        await new Promise(r => setTimeout(r, 2000));
      }

      // Mark system as fully upgraded
      localStorage.setItem('asset_version_control', 'custom_ai_v1');
      setIsWorking(false);
    };

    // Wait 5 seconds after boot before starting heavy lifting
    const timer = setTimeout(runDaemon, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isWorking) return null;

  return (
    <div className="fixed bottom-12 right-6 z-[80] animate-in slide-in-from-right duration-700">
      <div className="bg-[#0B1120]/90 backdrop-blur-md border border-neon-cyan/30 rounded-lg p-3 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex items-center gap-3 max-w-xs">
         <div className="relative">
            <div className="absolute inset-0 bg-neon-cyan blur-lg opacity-20 animate-pulse"></div>
            <RefreshCw size={20} className="text-neon-cyan animate-spin duration-[3000ms]" />
         </div>
         <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-wider flex items-center gap-1">
               <Sparkles size={10} />
               ENHANCING GRAPHICS
            </span>
            <span className="text-xs text-white font-mono truncate max-w-[150px]">
               Processing: {currentTask}
            </span>
         </div>
         <div className="text-[10px] font-mono text-gray-400 border-l border-white/10 pl-2 ml-1">
            {Math.round((completed / total) * 100)}%
         </div>
      </div>
    </div>
  );
};

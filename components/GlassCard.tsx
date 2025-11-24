import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode; // Changed to ReactNode to allow complex title structures
  subTitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'critical' | 'active' | 'warning';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  title, 
  subTitle,
  action,
  variant = 'default' 
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'critical': return 'border-neon-red/60 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-neon-red/5';
      case 'warning': return 'border-neon-orange/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-neon-orange/5';
      case 'active': return 'border-neon-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
      default: return 'border-white/10 hover:border-white/20';
    }
  };

  return (
    <div className={`glass-panel relative flex flex-col rounded-xl overflow-hidden transition-all duration-500 ${getBorderColor()} ${className}`}>
      {/* Decorative top sheen */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      {(title || action) && (
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/5 bg-black/20 shrink-0">
          {title && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm tracking-widest uppercase text-gray-200 flex items-center gap-2">
                {variant === 'critical' && <span className="w-2 h-2 rounded-full bg-neon-red animate-pulse shadow-[0_0_8px_#ef4444]" />}
                {variant === 'warning' && <span className="w-2 h-2 rounded-full bg-neon-orange animate-pulse" />}
                {title}
              </h3>
              {subTitle && (
                <span className="text-[10px] text-gray-500 font-mono mt-0.5 tracking-wide">{subTitle}</span>
              )}
            </div>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1 p-5 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};
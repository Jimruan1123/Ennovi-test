import React from 'react';
import { LayoutDashboard, Factory, Users, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SideNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenSettings: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ activeView, onNavigate }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'cockpit', icon: LayoutDashboard, label: t('cockpit') },
    { id: 'production', icon: Factory, label: t('production') },
    { id: 'customers', icon: Users, label: t('customers') },
    { id: 'quality', icon: BarChart3, label: t('quality') },
  ];

  return (
    <div className="hidden md:flex flex-col w-20 lg:w-64 h-screen fixed left-0 top-0 bg-[#0B1120]/90 backdrop-blur-xl border-r border-white/10 z-50 pt-24 pb-6 shadow-2xl">
      <div className="flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group relative
              ${activeView === item.id 
                ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400' 
                : 'hover:bg-white/5 text-gray-500 hover:text-white'}
            `}
          >
            <item.icon size={22} className={activeView === item.id ? 'text-yellow-400' : 'group-hover:text-yellow-400 transition-colors'} />
            <span className="hidden lg:block font-bold tracking-tight text-xs uppercase">{item.label}</span>
            {activeView === item.id && (
              <div className="absolute right-0 w-1 h-6 bg-yellow-400 rounded-l shadow-[0_0_8px_#facc15]" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto px-3 flex flex-col gap-2 border-t border-white/5 pt-6">
         <div className="px-4">
            <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest hidden lg:block">Version 3.1.0 Stable</p>
            <p className="text-[8px] text-gray-700 font-mono mt-1 hidden lg:block">SECURED BY ENNOVI HUB</p>
         </div>
      </div>
    </div>
  );
};
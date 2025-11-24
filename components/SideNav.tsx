import React from 'react';
import { LayoutDashboard, Factory, Users, BarChart3, Settings, LifeBuoy } from 'lucide-react';

interface SideNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const SideNav: React.FC<SideNavProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: 'cockpit', icon: LayoutDashboard, label: 'Command Center' },
    { id: 'production', icon: Factory, label: 'Line Details' },
    { id: 'customers', icon: Users, label: 'Customers & CRM' },
    { id: 'quality', icon: BarChart3, label: 'Quality (SPC)' },
  ];

  return (
    <div className="hidden md:flex flex-col w-20 lg:w-64 h-screen fixed left-0 top-0 bg-[#0B1120]/90 backdrop-blur-xl border-r border-white/10 z-50 pt-24 pb-6">
      <div className="flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group
              ${activeView === item.id 
                ? 'bg-yellow-400/10 border border-yellow-400/50 text-yellow-400' 
                : 'hover:bg-white/5 text-gray-400 hover:text-white'}
            `}
          >
            <item.icon size={24} className={activeView === item.id ? 'text-yellow-400' : 'group-hover:text-yellow-400 transition-colors'} />
            <span className="hidden lg:block font-medium tracking-wide text-sm uppercase">{item.label}</span>
            {activeView === item.id && (
              <div className="absolute right-0 w-1 h-8 bg-yellow-400 rounded-l shadow-[0_0_10px_#facc15]" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto px-3 flex flex-col gap-2">
         <div className="px-4 py-2">
            <p className="text-[10px] text-gray-600 font-mono hidden lg:block">SYSTEM V2.4.1</p>
         </div>
         <button className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
            <Settings size={20} />
            <span className="hidden lg:block text-sm">Settings</span>
         </button>
      </div>
    </div>
  );
};
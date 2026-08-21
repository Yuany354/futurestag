import React from 'react';
import { Zap, FileText, Calendar, ShieldAlert, Sparkles, Gauge } from 'lucide-react';

export type ResearchSubMenu = 'flash_news' | 'research_report' | 'calendar' | 'macro_events' | 'impact_matrix';

interface SidebarProps {
  activeSubMenu: ResearchSubMenu;
  onSelectSubMenu: (menu: ResearchSubMenu) => void;
  eventCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSubMenu,
  onSelectSubMenu,
  eventCount,
}) => {
  const menuItems: {
    id: ResearchSubMenu;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    { id: 'flash_news', label: '快讯', icon: <Zap className="w-4 h-4" /> },
    { id: 'research_report', label: '研报', icon: <FileText className="w-4 h-4" /> },
    { id: 'calendar', label: '财经日历', icon: <Calendar className="w-4 h-4" /> },
    {
      id: 'macro_events',
      label: '重大事件',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      id: 'impact_matrix',
      label: '冲击评分矩阵',
      icon: <Gauge className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-full select-none shadow-2xs">
      {/* Sidebar Section Title */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600" />
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            研究资讯子菜单
          </span>
        </div>
      </div>

      {/* Sub-menu Navigation Links */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeSubMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSubMenu(item.id)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span>所属栏目：研究资讯</span>
      </div>
    </aside>
  );
};

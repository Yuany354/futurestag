import React from 'react';
import { Layers, FileText, BarChart3, ShieldAlert, User, Database, Radio } from 'lucide-react';

export type PlatformTab = 'black_swan' | 'base_info' | 'research_info' | 'research_data';

interface PlatformHeaderProps {
  activeTab: PlatformTab;
  onSelectTab: (tab: PlatformTab) => void;
  researcherName?: string;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  activeTab,
  onSelectTab,
  researcherName = '俞尘泯',
}) => {
  const tabs: { id: PlatformTab; label: string; icon: React.ReactNode }[] = [
    { id: 'black_swan', label: '黑天鹅', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'base_info', label: '基础信息', icon: <Database className="w-4 h-4" /> },
    { id: 'research_info', label: '研究资讯', icon: <FileText className="w-4 h-4" /> },
    { id: 'research_data', label: '研究数据', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800 shrink-0 select-none">
      {/* Top Navbar Row */}
      <div className="h-14 px-6 flex items-center justify-between">
        {/* Left Platform Branding & Navigation Tabs */}
        <div className="flex items-center gap-8">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md font-bold text-base">
              投
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-slate-100">
                投研平台
              </span>
            </div>
          </div>

          {/* Primary Menu Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.id === 'research_info' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right User & Status Area */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700/60 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[11px]">实时数据同步中</span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-indigo-900/80 border border-indigo-700/50 flex items-center justify-center text-indigo-300 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-200 leading-tight">
                {researcherName}
              </div>
              <div className="text-[10px] text-slate-400">高级投研分析师</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Header Breadcrumb for Research Info */}
      <div className="h-9 px-6 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">研究资讯</span>
          <span className="text-slate-600">/</span>
          <span className="text-indigo-400 font-semibold">重大事件</span>
        </div>
      </div>
    </header>
  );
};

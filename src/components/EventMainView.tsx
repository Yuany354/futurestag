import React from 'react';
import { MacroEvent } from '../types';
import { getIndustryColor, INDUSTRY_COLOR_BADGES } from '../utils/industryColors';
import { Search, Plus, Download, Calendar, Eye, Edit3, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';

interface EventMainViewProps {
  events: MacroEvent[];
  activeEventId: string;
  onSelectEvent: (id: string, openDrawer?: boolean) => void;
  onAddNewEvent: () => void;
  onExportExcel: () => void;
  onPreviewEvent: (evt: MacroEvent) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (cat: string | null) => void;
  categories: string[];
}

export const EventMainView: React.FC<EventMainViewProps> = ({
  events,
  activeEventId,
  onSelectEvent,
  onAddNewEvent,
  onExportExcel,
  onPreviewEvent,
  searchQuery,
  onSearchChange,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  categories,
}) => {
  // Filter events based on search query & category filter
  const filteredEvents = events.filter((evt) => {
    const matchesQuery =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.marketVarieties.some(
        (v) =>
          v.name.includes(searchQuery) ||
          v.code.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategoryFilter || evt.categories.includes(selectedCategoryFilter);

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* Main View Top Toolbar Bar */}
      <div className="p-6 bg-white border-b border-slate-200/80 shadow-2xs space-y-4 shrink-0">
        {/* Title & Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse" />
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                重大事件
              </h1>
            </div>
          </div>

          {/* Action Buttons: Add New & Export Excel */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExportExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              title="导出包含全量重大事件的数据表格"
            >
              <Download className="w-4 h-4" />
              <span>导出表格</span>
            </button>

            <button
              onClick={onAddNewEvent}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增重大事件</span>
            </button>
          </div>
        </div>

        {/* Search Input & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索事件名称、受影响产业、品种代码..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition-all"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              分类:
            </span>
            <button
              onClick={() => onSelectCategoryFilter(null)}
              className={`px-3 py-1 rounded-md border text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryFilter === null
                  ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              全部
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategoryFilter(isSelected ? null : cat)}
                  className={`px-3 py-1 rounded-md border text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List / Grid Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">未找到匹配的重大事件定义</p>
            <p className="text-xs text-slate-400 mt-1">请尝试调整搜索关键词或选择其他事件分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredEvents.map((evt) => {
              const isActive = evt.id === activeEventId;

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id, true)}
                  className={`p-5 bg-white rounded-xl border transition-all cursor-pointer group flex flex-col justify-between hover:shadow-md ${
                    isActive
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Categories & Start Date Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-1.5">
                        {evt.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 bg-indigo-50/80 text-indigo-700 border border-indigo-200/60 text-[10px] font-bold rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 shrink-0">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{evt.startDate}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                      {evt.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {evt.description || '暂无事件描述'}
                    </p>

                    {/* Impacted Industries */}
                    <div className="space-y-2 mb-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        受影响产业板块
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {evt.impactedIndustries.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">暂无产业</span>
                        ) : (
                          evt.impactedIndustries.map((ind) => {
                            const colorStyle = getIndustryColor(ind.name, ind.colorStyle);
                            const badgeClass = INDUSTRY_COLOR_BADGES[colorStyle];
                            return (
                              <span
                                key={ind.id}
                                className={`px-2 py-0.5 text-[11px] font-semibold border rounded ${badgeClass}`}
                              >
                                {ind.name}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Market Varieties */}
                    <div className="space-y-1.5 mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        核心交易品种
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {evt.marketVarieties.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">暂无品种</span>
                        ) : (
                          evt.marketVarieties.map((v) => (
                            <span
                              key={v.code}
                              className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-medium rounded flex items-center gap-1"
                            >
                              <span className="font-bold">{v.name}</span>
                              <code className="text-slate-500 font-mono text-[10px]">
                                {v.code}
                              </code>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewEvent(evt);
                        }}
                        className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>预览卡片</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt.id, true);
                        }}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>配置编辑</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

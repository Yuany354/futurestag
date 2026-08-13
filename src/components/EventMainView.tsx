import React from 'react';
import { MacroEvent } from '../types';
import { getIndustryColor, INDUSTRY_COLOR_BADGES } from '../utils/industryColors';
import { Search, Plus, Download, Calendar, Eye, Edit3, Sparkles, Filter, ChevronRight, Check, Trash2 } from 'lucide-react';

interface EventMainViewProps {
  events: MacroEvent[];
  activeEventId: string;
  onSelectEvent: (id: string, openDrawer?: boolean) => void;
  onAddNewEvent: () => void;
  onExportExcel: () => void;
  onPreviewEvent: (evt: MacroEvent) => void;
  onRequestDelete: (id: string, title: string) => void;
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
  onRequestDelete,
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

      {/* Events Table Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">未找到匹配的重大事件</p>
            <p className="text-xs text-slate-400 mt-1">请尝试调整搜索关键词或选择其他事件分类</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">事件名称 & 分类</th>
                    <th className="py-3.5 px-4 font-bold w-32 whitespace-nowrap">起始日期</th>
                    <th className="py-3.5 px-4 font-bold">受影响产业</th>
                    <th className="py-3.5 px-4 font-bold">核心交易品种</th>
                    <th className="py-3.5 px-4 font-bold max-w-xs">事件简述</th>
                    <th className="py-3.5 px-4 font-bold text-right w-44 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredEvents.map((evt) => {
                    const isActive = evt.id === activeEventId;

                    return (
                      <tr
                        key={evt.id}
                        onClick={() => onSelectEvent(evt.id, true)}
                        className={`transition-colors cursor-pointer group hover:bg-slate-50/80 ${
                          isActive ? 'bg-indigo-50/40 font-medium' : ''
                        }`}
                      >
                        {/* Title & Categories */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                            {evt.title}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {evt.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-bold rounded"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Start Date */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap font-mono text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.startDate}</span>
                          </div>
                        </td>

                        {/* Impacted Industries */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {evt.impactedIndustries.length === 0 ? (
                              <span className="text-slate-400 italic">暂无</span>
                            ) : (
                              evt.impactedIndustries.map((ind) => {
                                const colorStyle = getIndustryColor(ind.name, ind.colorStyle);
                                const badgeClass = INDUSTRY_COLOR_BADGES[colorStyle];
                                return (
                                  <span
                                    key={ind.id}
                                    className={`px-2 py-0.5 text-[10px] font-semibold border rounded ${badgeClass}`}
                                  >
                                    {ind.name}
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </td>

                        {/* Market Varieties */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {evt.marketVarieties.length === 0 ? (
                              <span className="text-slate-400 italic">暂无</span>
                            ) : (
                              evt.marketVarieties.map((v) => (
                                <span
                                  key={v.code}
                                  className="px-1.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 text-[10px] rounded font-medium inline-flex items-center gap-1"
                                >
                                  <span>{v.name}</span>
                                  <code className="text-slate-500 font-mono text-[9px]">{v.code}</code>
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                            {evt.description || '暂无描述'}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPreviewEvent(evt);
                              }}
                              className="px-2 py-1 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>预览</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectEvent(evt.id, true);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>编辑</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRequestDelete(evt.id, evt.title);
                              }}
                              className="px-2 py-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="删除此事件"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>删除</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

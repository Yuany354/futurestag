import React from 'react';
import { MacroEvent } from '../types';
import { getIndustryColor, INDUSTRY_COLOR_BADGES } from '../utils/industryColors';
import { Plus, Download, Calendar, Eye, Edit3, Sparkles, ChevronRight, Check, Trash2 } from 'lucide-react';

// 列表单元格中产业/品种最多展示数量，超出部分折叠为 +N
const MAX_VISIBLE_TAGS = 4;

interface EventMainViewProps {
  events: MacroEvent[];
  activeEventId: string;
  onSelectEvent: (id: string, openDrawer?: boolean) => void;
  onAddNewEvent: () => void;
  onExportExcel: () => void;
  onPreviewEvent: (evt: MacroEvent) => void;
  onRequestDelete: (id: string, title: string) => void;
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (cat: string | null) => void;
  selectedIndustryFilter: string | null;
  onSelectIndustryFilter: (ind: string | null) => void;
  selectedVarietyFilter: string | null;
  onSelectVarietyFilter: (varCode: string | null) => void;
  selectedIntensityFilter: number | null;
  onSelectIntensityFilter: (val: number | null) => void;
  selectedImpactFilter: number | null;
  onSelectImpactFilter: (val: number | null) => void;
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
  selectedCategoryFilter,
  onSelectCategoryFilter,
  selectedIndustryFilter,
  onSelectIndustryFilter,
  selectedVarietyFilter,
  onSelectVarietyFilter,
  selectedIntensityFilter,
  onSelectIntensityFilter,
  selectedImpactFilter,
  onSelectImpactFilter,
  categories,
}) => {
  // Collect unique industries and varieties from all events for filter dropdowns
  const allIndustries = Array.from(new Set(events.flatMap((e) => e.impactedIndustries.map((i) => i.name)))).sort();
  // Unique varieties by code, keeping name for display
  const allVarietiesMap: Record<string, string> = {};
  events.forEach((e) => e.marketVarieties.forEach((v) => { allVarietiesMap[v.code] = v.name; }));
  const allVarieties = Object.entries(allVarietiesMap).sort((a, b) => a[0].localeCompare(b[0]));

  // Filter events based on all filter criteria
  const filteredEvents = events.filter((evt) => {
    const matchesCategory = !selectedCategoryFilter || evt.categories.includes(selectedCategoryFilter);
    const matchesIndustry = !selectedIndustryFilter || evt.impactedIndustries.some((i) => i.name === selectedIndustryFilter);
    const matchesVariety = !selectedVarietyFilter || evt.marketVarieties.some((v) => v.code === selectedVarietyFilter);
    const matchesIntensity = selectedIntensityFilter == null || evt.eventIntensity === selectedIntensityFilter;
    const matchesImpact = selectedImpactFilter == null || evt.commodityImpact === selectedImpactFilter;
    return matchesCategory && matchesIndustry && matchesVariety && matchesIntensity && matchesImpact;
  });

  // Check if any filter is active
  const hasActiveFilter = selectedCategoryFilter || selectedIndustryFilter || selectedVarietyFilter || selectedIntensityFilter != null || selectedImpactFilter != null;

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

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          {/* 事件标签 */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold shrink-0">事件标签</span>
            <select
              value={selectedCategoryFilter ?? ''}
              onChange={(e) => onSelectCategoryFilter(e.target.value || null)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="">全部</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* 受影响产业 */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold shrink-0">受影响产业</span>
            <select
              value={selectedIndustryFilter ?? ''}
              onChange={(e) => onSelectIndustryFilter(e.target.value || null)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="">全部</option>
              {allIndustries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* 核心影响品种 */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold shrink-0">核心影响品种</span>
            <select
              value={selectedVarietyFilter ?? ''}
              onChange={(e) => onSelectVarietyFilter(e.target.value || null)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="">全部</option>
              {allVarieties.map(([code, name]) => <option key={code} value={code}>{name}（{code}）</option>)}
            </select>
          </div>

          {/* 事件烈度 */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold shrink-0">事件烈度</span>
            <select
              value={selectedIntensityFilter ?? ''}
              onChange={(e) => onSelectIntensityFilter(e.target.value ? Number(e.target.value) : null)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="">全部</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* 商品冲击程度 */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold shrink-0">商品冲击程度</span>
            <select
              value={selectedImpactFilter ?? ''}
              onChange={(e) => onSelectImpactFilter(e.target.value ? Number(e.target.value) : null)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="">全部</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* 清除筛选 */}
          {hasActiveFilter && (
            <button
              onClick={() => {
                onSelectCategoryFilter(null);
                onSelectIndustryFilter(null);
                onSelectVarietyFilter(null);
                onSelectIntensityFilter(null);
                onSelectImpactFilter(null);
              }}
              className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors cursor-pointer font-medium"
            >
              清除筛选
            </button>
          )}
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
                    <th className="py-3.5 px-4 font-bold">核心影响品种</th>
                    <th className="py-3.5 px-4 font-bold max-w-xs">事件简述</th>
                    <th className="py-3.5 px-4 font-bold text-center w-24">
                      <span className="group relative inline-flex items-center justify-center gap-1">
                        事件烈度
                        <span className="relative inline-flex items-center justify-center w-4 h-4 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 rounded-full cursor-help transition-colors text-[10px] font-bold">?</span>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50 w-72 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl border border-gray-700 pointer-events-none whitespace-normal">
                          <span className="font-bold text-amber-300">事件本身的宏观冲击力</span>，包括系统性与持续时间。<br/>
                          1=极低，2=低，3=中，4=高，5=极高
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></span>
                        </span>
                      </span>
                    </th>
                    <th className="py-3.5 px-4 font-bold text-center w-28 whitespace-nowrap">
                      <span className="group relative inline-flex items-center justify-center gap-1">
                        商品冲击程度
                        <span className="relative inline-flex items-center justify-center w-4 h-4 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 rounded-full cursor-help transition-colors text-[10px] font-bold">?</span>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50 w-72 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl border border-gray-700 pointer-events-none whitespace-normal">
                          事件对国内已上市商品品种价格的冲击<br/><span className="font-bold text-rose-300">（幅度 × 广度 × 持续性）</span><br/>
                          1=极弱，2=弱，3=中，4=强，5=极强
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></span>
                        </span>
                      </span>
                    </th>
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
                              <>
                                {evt.impactedIndustries.slice(0, MAX_VISIBLE_TAGS).map((ind) => {
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
                                })}
                                {evt.impactedIndustries.length > MAX_VISIBLE_TAGS && (
                                  <span
                                    className="px-2 py-0.5 text-[10px] font-semibold border rounded bg-slate-50 text-slate-500 border-slate-200 cursor-help"
                                    title={evt.impactedIndustries.slice(MAX_VISIBLE_TAGS).map((i) => i.name).join('、')}
                                  >
                                    +{evt.impactedIndustries.length - MAX_VISIBLE_TAGS}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>

                        {/* Market Varieties */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {evt.marketVarieties.length === 0 ? (
                              <span className="text-slate-400 italic">暂无</span>
                            ) : (
                              <>
                                {evt.marketVarieties.slice(0, MAX_VISIBLE_TAGS).map((v) => (
                                  <span
                                    key={v.code}
                                    className="px-1.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 text-[10px] rounded font-medium inline-flex items-center gap-1"
                                  >
                                    <span>{v.name}</span>
                                    <code className="text-slate-500 font-mono text-[9px]">{v.code}</code>
                                  </span>
                                ))}
                                {evt.marketVarieties.length > MAX_VISIBLE_TAGS && (
                                  <span
                                    className="px-1.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 text-[10px] rounded font-medium cursor-help"
                                    title={evt.marketVarieties.slice(MAX_VISIBLE_TAGS).map((v) => `${v.name}(${v.code})`).join('、')}
                                  >
                                    +{evt.marketVarieties.length - MAX_VISIBLE_TAGS}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                            {evt.description || '暂无描述'}
                          </p>
                        </td>

                        {/* Event Intensity Score */}
                        <td className="py-3.5 px-4 align-middle text-center">
                          {evt.eventIntensity != null ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
                              {evt.eventIntensity}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Commodity Impact Score */}
                        <td className="py-3.5 px-4 align-middle text-center">
                          {evt.commodityImpact != null ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-300">
                              {evt.commodityImpact}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
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

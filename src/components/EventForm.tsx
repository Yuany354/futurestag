import React, { useRef } from 'react';
import { MacroEvent } from '../types';
import { Calendar, Plus, X } from 'lucide-react';
import { getIndustryColor, INDUSTRY_COLOR_BADGES } from '../utils/industryColors';

interface EventFormProps {
  event: MacroEvent;
  categories: string[];
  onChange: (updated: MacroEvent) => void;
  onOpenAddCategory: () => void;
  onOpenAddIndustry: () => void;
  onOpenAddVariety: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  categories,
  onChange,
  onOpenAddCategory,
  onOpenAddIndustry,
  onOpenAddVariety,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Toggle category selection
  const handleToggleCategory = (cat: string) => {
    let updatedCategories = [...event.categories];
    if (updatedCategories.includes(cat)) {
      if (updatedCategories.length > 1) {
        updatedCategories = updatedCategories.filter((c) => c !== cat);
      }
    } else {
      updatedCategories.push(cat);
    }
    onChange({ ...event, categories: updatedCategories });
  };

  // Remove industry
  const handleRemoveIndustry = (id: string) => {
    const updated = event.impactedIndustries.filter((i) => i.id !== id);
    onChange({ ...event, impactedIndustries: updated });
  };

  // Remove variety
  const handleRemoveVariety = (code: string) => {
    const updated = event.marketVarieties.filter((v) => v.code !== code);
    onChange({ ...event, marketVarieties: updated });
  };

  // Handle native date picker selection
  const handleNativeDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const formatted = e.target.value.replace(/-/g, '/');
      onChange({ ...event, startDate: formatted });
    }
  };

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          dateInputRef.current.showPicker();
        } catch {
          dateInputRef.current.click();
        }
      } else {
        dateInputRef.current.click();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-12 gap-y-6 gap-x-8">
        {/* 1. 事件定义名称 */}
        <div className="col-span-12">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            1. 事件定义名称
          </label>
          <input
            type="text"
            value={event.title}
            onChange={(e) => onChange({ ...event, title: e.target.value })}
            onFocus={(e) => e.target.select()}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            placeholder="例如: 2015 汇率形成机制改革及其市场冲击"
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
          />
        </div>

        {/* 2. 事件分类选择 */}
        <div className="col-span-12">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
            2. 事件分类选择
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => {
              const isSelected = event.categories.includes(cat);
              return (
                <span
                  key={cat}
                  onClick={() => handleToggleCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-full border cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs font-medium'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </span>
              );
            })}
            <button
              type="button"
              onClick={onOpenAddCategory}
              className="px-3 py-1.5 bg-white border border-dashed border-gray-400 text-gray-500 text-xs rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              + 自定义分类
            </button>
          </div>
        </div>

        {/* 3. 开始时间 */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            3. 开始时间
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={event.startDate}
              onChange={(e) => onChange({ ...event, startDate: e.target.value })}
              placeholder="YYYY/MM/DD 或选择日期"
              className="w-full pl-4 pr-11 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            {/* Hidden native date picker */}
            <input
              ref={dateInputRef}
              type="date"
              value={
                event.startDate && event.startDate.includes('/')
                  ? event.startDate.replace(/\//g, '-')
                  : event.startDate || ''
              }
              onChange={handleNativeDateSelect}
              className="sr-only"
            />
            <button
              type="button"
              onClick={handleOpenCalendar}
              className="absolute right-2.5 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title="点击打开日历选择日期"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. 事件描述 */}
        <div className="col-span-12">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            4. 事件描述
          </label>
          <textarea
            rows={3}
            value={event.description}
            onChange={(e) => onChange({ ...event, description: e.target.value })}
            placeholder="请输入对重大事件背景、触发逻辑及宏观影响的详细叙述..."
            className="w-full h-24 px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-800 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* 5 & 6. 影响产业 与 影响品种 */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 5. 影响产业 */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                5. 影响产业
              </label>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg min-h-[90px] flex items-center shadow-2xs">
              <div className="flex flex-wrap gap-2 items-center w-full">
                {event.impactedIndustries.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">暂无关联产业</span>
                ) : (
                  event.impactedIndustries.map((ind) => {
                    const colorStyle = getIndustryColor(ind.name, ind.colorStyle);
                    const badgeClass = INDUSTRY_COLOR_BADGES[colorStyle];
                    return (
                      <span
                        key={ind.id}
                        className={`group px-2.5 py-1 text-xs font-semibold border rounded-md flex items-center gap-1.5 transition-all ${badgeClass}`}
                      >
                        <span>{ind.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIndustry(ind.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                          title="移除产业"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })
                )}
                <button
                  type="button"
                  onClick={onOpenAddIndustry}
                  className="px-2 py-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium underline decoration-dotted transition-colors cursor-pointer"
                >
                  配置新产业
                </button>
              </div>
            </div>
          </div>

          {/* 6. 影响品种 */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                6. 影响品种
              </label>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg min-h-[90px] flex items-center shadow-2xs">
              <div className="flex flex-wrap gap-2 items-center w-full">
                {event.marketVarieties.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">暂无关联交易代码</span>
                ) : (
                  event.marketVarieties.map((varItem) => (
                    <div
                      key={varItem.code}
                      className="group flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-300 rounded text-[11px] transition-colors hover:border-gray-400"
                    >
                      <span className="font-bold text-gray-900">{varItem.name}</span>
                      <code className="text-gray-600 font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-gray-200 font-semibold">
                        {varItem.code}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariety(varItem.code)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="移除品种"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
                <button
                  type="button"
                  onClick={onOpenAddVariety}
                  className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-semibold cursor-pointer"
                  title="添加关联交易品种"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. 备注 */}
        <div className="col-span-12 border-t border-gray-200 pt-6 mt-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            7. 备注
          </label>
          <textarea
            rows={2}
            value={event.managerNotes || event.researcherNotes || ''}
            onChange={(e) =>
              onChange({
                ...event,
                managerNotes: e.target.value,
                researcherNotes: e.target.value,
              })
            }
            placeholder="支持在在此填写自定义备注信息（可选，可留空）..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-y min-h-[60px]"
          />
        </div>
      </div>
    </div>
  );
};

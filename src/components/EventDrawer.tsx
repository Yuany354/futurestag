import React from 'react';
import { MacroEvent } from '../types';
import { EventForm } from './EventForm';
import { Eye, Save, Check, X, SlidersHorizontal, Trash2 } from 'lucide-react';

interface EventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: MacroEvent;
  categories: string[];
  onChange: (updated: MacroEvent) => void;
  onOpenAddCategory: () => void;
  onOpenAddIndustry: () => void;
  onOpenAddVariety: () => void;
  onSaveConfig: () => void;
  onPreview: () => void;
  onRequestDelete?: (id: string, title: string) => void;
  isSavedJustNow: boolean;
}

export const EventDrawer: React.FC<EventDrawerProps> = ({
  isOpen,
  onClose,
  event,
  categories,
  onChange,
  onOpenAddCategory,
  onOpenAddIndustry,
  onOpenAddVariety,
  onSaveConfig,
  onPreview,
  onRequestDelete,
  isSavedJustNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="relative z-50 w-full max-w-3xl bg-white h-full shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 select-none">
          {/* Drawer Title & Event Context */}
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                  重大事件配置面板
                </h2>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-200/80">
                  编辑中
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate max-w-md font-medium mt-0.5">
                {event.title || '新建重大事件'}
              </p>
            </div>
          </div>

          {/* Action Buttons in Drawer Header */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onRequestDelete && (
              <button
                onClick={() => onRequestDelete(event.id, event.title)}
                className="px-3 py-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="删除此事件"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>
            )}

            <button
              onClick={onPreview}
              className="px-3.5 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 bg-white text-gray-700 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>预览卡片</span>
            </button>

            <button
              onClick={onSaveConfig}
              className={`px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                isSavedJustNow ? 'bg-emerald-600 hover:bg-emerald-700' : ''
              }`}
            >
              {isSavedJustNow ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>已保存</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>保存配置</span>
                </>
              )}
            </button>

            <div className="h-5 w-[1px] bg-gray-200 mx-1" />

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="关闭抽屉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Form */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F9FAFB]">
          <EventForm
            event={event}
            categories={categories}
            onChange={onChange}
            onOpenAddCategory={onOpenAddCategory}
            onOpenAddIndustry={onOpenAddIndustry}
            onOpenAddVariety={onOpenAddVariety}
          />
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 px-6 shrink-0">
          <span className="text-[11px] text-gray-400">
            最近更新: {event.updatedAt || '刚刚'}
          </span>
        </div>
      </div>
    </div>
  );
};

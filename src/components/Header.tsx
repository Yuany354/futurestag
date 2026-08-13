import React from 'react';
import { ActiveViewMode } from '../types';
import { Eye, Save, Download, Check } from 'lucide-react';

interface HeaderProps {
  activeView: ActiveViewMode;
  onViewChange: (view: ActiveViewMode) => void;
  onExportExcel: () => void;
  onSave: () => void;
  isSavedJustNow: boolean;
  activeEventTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  onExportExcel,
  onSave,
  isSavedJustNow,
  activeEventTitle,
}) => {
  return (
    <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 shrink-0 select-none">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-400 truncate">
        <span>资产配置</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold truncate">事件定义管理</span>
        {activeEventTitle && (
          <>
            <span className="text-gray-300 hidden sm:inline">/</span>
            <span className="text-indigo-600 font-normal truncate hidden sm:inline max-w-[200px]">
              {activeEventTitle}
            </span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onViewChange('preview')}
          className="px-3.5 py-1.5 border border-gray-300 text-xs font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5 bg-white text-gray-700"
        >
          <Eye className="w-3.5 h-3.5" />
          预览
        </button>

        <button
          onClick={onExportExcel}
          className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          title="一键导出包含所有重大事件的 Excel 表格"
        >
          <Download className="w-3.5 h-3.5" />
          导出 Excel 表格
        </button>

        <button
          onClick={onSave}
          className={`px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 shadow-xs transition-all flex items-center gap-1.5 active:scale-95 ${
            isSavedJustNow ? 'bg-emerald-600 hover:bg-emerald-700' : ''
          }`}
        >
          {isSavedJustNow ? (
            <>
              <Check className="w-3.5 h-3.5" />
              已保存
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              保存配置
            </>
          )}
        </button>
      </div>
    </header>
  );
};

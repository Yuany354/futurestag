import React, { useState } from 'react';
import { MarketVariety } from '../types';
import { VARIETY_PRESETS } from '../data/mockEvents';
import { X, Activity, Search } from 'lucide-react';

interface AddVarietyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (variety: MarketVariety) => void;
  existingVarieties: MarketVariety[];
}

export const AddVarietyModal: React.FC<AddVarietyModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingVarieties,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCode, setCustomCode] = useState('');

  if (!isOpen) return null;

  const isAdded = (code: string) =>
    existingVarieties.some((v) => v.code.toLowerCase() === code.toLowerCase());

  const filteredPresets = VARIETY_PRESETS.filter(
    (p) =>
      p.name.includes(searchTerm) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.includes(searchTerm))
  );

  const handleSelectPreset = (preset: MarketVariety) => {
    if (!isAdded(preset.code)) {
      onAdd(preset);
      onClose();
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim() && customCode.trim() && !isAdded(customCode.trim())) {
      onAdd({
        name: customName.trim(),
        code: customCode.trim().toUpperCase(),
        exchange: 'CUSTOM',
      });
      setCustomName('');
      setCustomCode('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">选择或配置影响品种</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Preset search */}
          <div>
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索常见期货/股票代码品种 (如: 沪金 AU, 原油 SC)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredPresets.map((p) => {
                const added = isAdded(p.code);
                return (
                  <button
                    key={p.code}
                    type="button"
                    disabled={added}
                    onClick={() => handleSelectPreset(p)}
                    className={`flex items-center justify-between p-2 rounded border text-left transition-all ${
                      added
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-800">{p.name}</div>
                      {p.category && <div className="text-[10px] text-gray-400">{p.category}</div>}
                    </div>
                    <code className="text-[11px] font-mono font-bold bg-gray-100 text-gray-700 px-1 py-0.5 rounded border border-gray-200">
                      {p.code}
                    </code>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Code Input */}
          <form onSubmit={handleCreateCustom} className="border-t border-gray-100 pt-4 space-y-3">
            <label className="block text-xs font-semibold text-gray-600">
              自定义输入交易所新品种代码
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="品种中文名 (如: 碳酸锂)"
                className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="交易代码 (如: LC)"
                className="px-3 py-1.5 text-xs border border-gray-300 rounded font-mono uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-gray-300 text-xs text-gray-700 font-medium rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!customName.trim() || !customCode.trim()}
                className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                添加品种
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

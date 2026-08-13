import React, { useState, useEffect } from 'react';
import { ImpactedIndustry, IndustryColor } from '../types';
import { X, Layers, Check, Plus } from 'lucide-react';
import { getIndustryColor } from '../utils/industryColors';

interface AddIndustryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (industries: ImpactedIndustry[]) => void;
  existingIndustries: ImpactedIndustry[];
}

const PRESET_INDUSTRIES: { name: string; colorStyle: IndustryColor }[] = [
  { name: '基本金属', colorStyle: 'green' },
  { name: '工业金属', colorStyle: 'green' },
  { name: '金属', colorStyle: 'green' },
  { name: '铝', colorStyle: 'green' },
  { name: '贵金属', colorStyle: 'amber' },
  { name: '能源', colorStyle: 'blue' },
  { name: '天然气', colorStyle: 'blue' },
  { name: '电力', colorStyle: 'amber' },
  { name: '化工', colorStyle: 'blue' },
  { name: '煤化工', colorStyle: 'blue' },
  { name: '能化', colorStyle: 'blue' },
  { name: '化肥', colorStyle: 'purple' },
  { name: '橡胶', colorStyle: 'rose' },
  { name: '农产品', colorStyle: 'rose' },
  { name: '煤炭', colorStyle: 'gray' },
  { name: '建材', colorStyle: 'gray' },
  { name: '航运', colorStyle: 'blue' },
];

// Color styling mappings for each industry type
export const COLOR_STYLE_MAP: Record<
  IndustryColor,
  { defaultBtn: string; selectedBtn: string; badge: string; dot: string }
> = {
  amber: {
    defaultBtn: 'bg-amber-50/80 text-amber-900 border-amber-200/80 hover:bg-amber-100 hover:border-amber-300',
    selectedBtn: 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs ring-2 ring-amber-300',
    badge: 'bg-amber-50 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
  },
  blue: {
    defaultBtn: 'bg-blue-50/80 text-blue-900 border-blue-200/80 hover:bg-blue-100 hover:border-blue-300',
    selectedBtn: 'bg-blue-600 text-white border-blue-700 font-bold shadow-xs ring-2 ring-blue-300',
    badge: 'bg-blue-50 text-blue-800 border-blue-300',
    dot: 'bg-blue-500',
  },
  green: {
    defaultBtn: 'bg-emerald-50/80 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300',
    selectedBtn: 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs ring-2 ring-emerald-300',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  rose: {
    defaultBtn: 'bg-rose-50/80 text-rose-900 border-rose-200/80 hover:bg-rose-100 hover:border-rose-300',
    selectedBtn: 'bg-rose-600 text-white border-rose-700 font-bold shadow-xs ring-2 ring-rose-300',
    badge: 'bg-rose-50 text-rose-800 border-rose-300',
    dot: 'bg-rose-500',
  },
  purple: {
    defaultBtn: 'bg-purple-50/80 text-purple-900 border-purple-200/80 hover:bg-purple-100 hover:border-purple-300',
    selectedBtn: 'bg-purple-600 text-white border-purple-700 font-bold shadow-xs ring-2 ring-purple-300',
    badge: 'bg-purple-50 text-purple-800 border-purple-300',
    dot: 'bg-purple-500',
  },
  gray: {
    defaultBtn: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
    selectedBtn: 'bg-gray-700 text-white border-gray-800 font-bold shadow-xs ring-2 ring-gray-300',
    badge: 'bg-gray-100 text-gray-800 border-gray-300',
    dot: 'bg-gray-500',
  },
};

export const AddIndustryModal: React.FC<AddIndustryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingIndustries,
}) => {
  const [localSelected, setLocalSelected] = useState<ImpactedIndustry[]>([]);
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState<IndustryColor>('blue');

  // Synchronize local selected state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...existingIndustries]);
      setCustomName('');
    }
  }, [isOpen, existingIndustries]);

  if (!isOpen) return null;

  const isSelected = (name: string) =>
    localSelected.some((i) => i.name === name);

  const handleTogglePreset = (preset: { name: string; colorStyle: IndustryColor }) => {
    if (isSelected(preset.name)) {
      setLocalSelected(localSelected.filter((i) => i.name !== preset.name));
    } else {
      setLocalSelected([
        ...localSelected,
        {
          id: `ind-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: preset.name,
          colorStyle: preset.colorStyle,
        },
      ]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customName.trim();
    if (trimmed && !isSelected(trimmed)) {
      setLocalSelected([
        ...localSelected,
        {
          id: `ind-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: trimmed,
          colorStyle: customColor,
        },
      ]);
      setCustomName('');
    }
  };

  const handleRemoveItem = (id: string) => {
    setLocalSelected(localSelected.filter((i) => i.id !== id));
  };

  const handleConfirmSave = () => {
    onSave(localSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">配置受影响产业板块</h3>
              <p className="text-[11px] text-gray-500">支持多选板块，完成后点击保存配置</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Selected Industries Overview */}
          <div className="bg-gray-50/80 p-3.5 rounded-lg border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">
                已选中产业板块 ({localSelected.length})
              </span>
              {localSelected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLocalSelected([])}
                  className="text-[11px] text-gray-400 hover:text-red-600 cursor-pointer"
                >
                  清空已选
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
              {localSelected.length === 0 ? (
                <span className="text-xs text-gray-400 italic">尚未选择任何板块，请在下方点击选择</span>
              ) : (
                localSelected.map((ind) => {
                  const resolvedColor = getIndustryColor(ind.name, ind.colorStyle);
                  const style = COLOR_STYLE_MAP[resolvedColor] || COLOR_STYLE_MAP.blue;
                  return (
                    <span
                      key={ind.id}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-all ${style.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      <span>{ind.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(ind.id)}
                        className="text-gray-400 hover:text-red-600 p-0.5 rounded transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* Preset Industry Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              快速点击选择 / 取消板块
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_INDUSTRIES.map((preset) => {
                const checked = isSelected(preset.name);
                const style = COLOR_STYLE_MAP[preset.colorStyle];
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleTogglePreset(preset)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                      checked ? style.selectedBtn : style.defaultBtn
                    }`}
                  >
                    {checked ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />}
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Industry Addition */}
          <form onSubmit={handleAddCustom} className="border-t border-gray-100 pt-4 space-y-3">
            <label className="block text-xs font-bold text-gray-700">
              自定义新增其他产业
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="例如: 半导体芯片、稀土永磁..."
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={!customName.trim()}
                className="px-3.5 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-500 text-[11px]">自定义配色标签：</span>
              <div className="flex items-center gap-2">
                {(['amber', 'blue', 'green', 'rose', 'purple', 'gray'] as IndustryColor[]).map((col) => {
                  const style = COLOR_STYLE_MAP[col];
                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setCustomColor(col)}
                      className={`w-5 h-5 rounded-full ${style.dot} transition-transform cursor-pointer ${
                        customColor === col ? 'ring-2 ring-indigo-600 scale-110 shadow-xs' : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-t border-gray-200">
          <span className="text-xs text-gray-500 font-medium">
            已勾选 {localSelected.length} 项受影响产业
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存配置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


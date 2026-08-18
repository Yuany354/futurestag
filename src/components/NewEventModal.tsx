import React, { useState } from 'react';
import { MacroEvent } from '../types';
import { X, Plus, Calendar, Tag } from 'lucide-react';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newEvent: MacroEvent) => void;
  categories: string[];
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10).replace(/-/g, '/')
  );
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '金融风险与危机');
  const [description, setDescription] = useState('');
  const [eventIntensity, setEventIntensity] = useState<number | undefined>(undefined);
  const [commodityImpact, setCommodityImpact] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: MacroEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      startDate: startDate || new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
      categories: [selectedCategory],
      description: description.trim() || '尚无事件叙述说明...',
      impactedIndustries: [
        { id: `ind-default-${Date.now()}`, name: '全产业覆盖', colorStyle: 'purple' },
      ],
      marketVarieties: [
        { name: '沪金', code: 'AU', exchange: 'SHFE' },
        { name: '燃料油', code: 'FU', exchange: 'SHFE' },
      ],
      severity: 'medium',
      eventIntensity,
      commodityImpact,
      transmissionMechanism: '需求与供给变动 -> 预期转向 -> 资产重估',
      researcherName: '俞尘泯 (Researcher-YCM)',
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).slice(0, 16),
    };

    onAdd(newEvent);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">新增重大宏观/市场事件</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              事件定义名称 *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如: 2026 全球去美元化结算规则变更..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                主事件分类
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                开始时间
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="YYYY/MM/DD"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="date"
                  value={startDate.includes('/') ? startDate.replace(/\//g, '-') : startDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      setStartDate(e.target.value.replace(/-/g, '/'));
                    }
                  }}
                  className="absolute right-2 top-1.5 opacity-0 w-6 h-6 cursor-pointer"
                />
                <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              事件简要说明
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="概括该事件对宏观经济、供应链及核心大宗商品冲击的背景逻辑..."
              className="w-full p-2.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                事件烈度（1～5分）
              </label>
              <select
                value={eventIntensity}
                onChange={(e) => setEventIntensity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}分
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                商品冲击程度（1～5分）
              </label>
              <select
                value={commodityImpact}
                onChange={(e) => setCommodityImpact(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}分
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 text-xs text-gray-700 font-medium rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-1.5 bg-[#111827] text-white text-xs font-medium rounded hover:bg-gray-800 disabled:opacity-50"
            >
              创建新事件
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

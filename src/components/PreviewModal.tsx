import React from 'react';
import { MacroEvent } from '../types';
import { X, Calendar, Copy, Check } from 'lucide-react';
import { getIndustryColor, INDUSTRY_COLOR_BADGES } from '../utils/industryColors';

interface PreviewModalProps {
  event: MacroEvent;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ event, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySummary = () => {
    const text = `【重大事件定义】${event.title} (${event.startDate})
分类: ${event.categories.join(' / ')}
影响产业: ${event.impactedIndustries.map((i) => i.name).join('、')}
品种: ${event.marketVarieties.map((v) => `${v.name}(${v.code})`).join('、')}
事件摘要: ${event.description}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#F9FAFB] rounded-xl border border-gray-300 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              重大事件定义卡片预览
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              {copied ? '已复制文本' : '复制文本'}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Sheet */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title Header Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>事件起始: {event.startDate}</span>
              </div>
              <div>·</div>
              <div className="text-gray-400">更新时间: {event.updatedAt}</div>
            </div>

            {/* Category tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {event.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Event Description */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              事件核心概述
            </h3>
            <p className="text-xs text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Impact Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impacted Industries */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                受影响产业板块
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {event.impactedIndustries.length === 0 ? (
                  <span className="text-xs text-gray-400">无</span>
                ) : (
                  event.impactedIndustries.map((ind) => {
                    const colorStyle = getIndustryColor(ind.name, ind.colorStyle);
                    const badgeClass = INDUSTRY_COLOR_BADGES[colorStyle];
                    return (
                      <span
                        key={ind.id}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${badgeClass}`}
                      >
                        {ind.name}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Market Varieties */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                核心品种与交易代码
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {event.marketVarieties.length === 0 ? (
                  <span className="text-xs text-gray-400">无</span>
                ) : (
                  event.marketVarieties.map((varItem) => (
                    <div
                      key={varItem.code}
                      className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-xs"
                    >
                      <span className="font-bold text-gray-900">{varItem.name}</span>
                      <code className="text-gray-600 font-mono text-[11px] bg-white px-1 rounded border border-gray-200 font-semibold">
                        {varItem.code}
                      </code>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Manager / Researcher Notes */}
          {(event.managerNotes || event.researcherNotes) && (
            <div className="bg-indigo-50/60 p-4 rounded-lg border border-indigo-100 space-y-1">
              <h3 className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                备注
              </h3>
              <p className="text-xs text-indigo-800 italic">
                "{event.managerNotes || event.researcherNotes}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-white border-t border-gray-200 text-center text-[10px] text-gray-400 font-medium shrink-0">
          投研平台 · 重大事件定义卡片
        </div>
      </div>
    </div>
  );
};

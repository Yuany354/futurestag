import React, { useState } from 'react';
import { MacroEvent } from '../types';
import { Copy, Check, Download, Upload, AlertCircle } from 'lucide-react';

interface JsonConfigModalProps {
  events: MacroEvent[];
  activeEvent: MacroEvent;
  onImportEvents: (newEvents: MacroEvent[]) => void;
}

export const JsonConfigModal: React.FC<JsonConfigModalProps> = ({
  events,
  activeEvent,
  onImportEvents,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const jsonString = JSON.stringify(activeEvent, null, 2);
  const allEventsJsonString = JSON.stringify(events, null, 2);

  const handleCopySingle = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([allEventsJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `macro_events_config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      setError(null);
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        onImportEvents(parsed);
        setSuccess(`成功导入 ${parsed.length} 个事件定义！`);
      } else if (typeof parsed === 'object' && parsed.id && parsed.title) {
        onImportEvents([parsed]);
        setSuccess('成功导入 1 个事件定义！');
      } else {
        throw new Error('格式不符合 MacroEvent 定义');
      }
      setImportText('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(`JSON解析错误: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Bar Actions */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">事件结构化 JSON 导出与导入</h2>
          <p className="text-xs text-gray-500">
            支持标准量化研究 JSON 字段格式，可直接对接量化回测与因子数据库。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySingle}
            className="px-3 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
            {copied ? '已复制当前项' : '复制当前JSON'}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-1.5 bg-[#111827] text-white text-xs font-medium rounded hover:bg-gray-800 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            导出全部 JSON 文件
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Event JSON */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            当前选中事件 JSON ({activeEvent.id})
          </label>
          <pre className="p-4 bg-gray-900 text-emerald-400 font-mono text-xs rounded-md h-[360px] overflow-auto leading-relaxed selection:bg-emerald-900 selection:text-white">
            {jsonString}
          </pre>
        </div>

        {/* JSON Import Section */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              粘贴 JSON 进行导入或替换
            </label>
            <textarea
              rows={12}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='请粘贴 JSON 数组或单个事件对象...'
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded font-mono text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="w-full py-2 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              解析并导入事件数据
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

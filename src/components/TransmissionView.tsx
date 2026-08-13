import React from 'react';
import { MacroEvent } from '../types';
import { ArrowRight, Activity, ShieldAlert, GitBranch, Layers, TrendingUp } from 'lucide-react';

interface TransmissionViewProps {
  event: MacroEvent;
}

export const TransmissionView: React.FC<TransmissionViewProps> = ({ event }) => {
  const pathwaySteps = event.transmissionMechanism
    ? event.transmissionMechanism.split('->').map((s) => s.trim())
    : ['事件触发', '供需关系传导', '资产价格重估'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Overview Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
          <GitBranch className="w-4 h-4" />
          事件逻辑与传导图谱解析
        </div>
        <h2 className="text-base font-bold text-gray-900 mb-1">{event.title}</h2>
        <p className="text-xs text-gray-500 font-mono">事件编号: {event.id} · 起始时间: {event.startDate}</p>
      </div>

      {/* Visual Step-by-Step Pathway */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          传导链条拆解 (Transmission Steps)
        </h3>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 overflow-x-auto py-2">
          {pathwaySteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 min-w-[160px] p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col justify-between space-y-2 relative group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">阶段 T+{idx}</span>
                </div>
                <div className="text-xs font-bold text-gray-800 leading-snug">{step}</div>
              </div>

              {idx < pathwaySteps.length - 1 && (
                <div className="self-center text-indigo-500 shrink-0 rotate-90 md:rotate-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Industry to Variety Grid Node Tree */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Nodes */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-amber-600" />
            受直接影响产业 ({event.impactedIndustries.length})
          </div>

          <div className="space-y-2">
            {event.impactedIndustries.map((ind) => (
              <div
                key={ind.id}
                className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-md flex items-center justify-between"
              >
                <span className="text-xs font-bold text-amber-900">{ind.name}</span>
                <span className="text-[10px] text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200 font-mono">
                  主传导板块
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Variety Nodes */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-indigo-600" />
            敏感资产交易品种 ({event.marketVarieties.length})
          </div>

          <div className="grid grid-cols-2 gap-2">
            {event.marketVarieties.map((varItem) => (
              <div
                key={varItem.code}
                className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between hover:border-indigo-400 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-gray-900">{varItem.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{varItem.exchange || 'SHFE'}</div>
                </div>
                <code className="text-xs font-mono font-bold text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                  {varItem.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

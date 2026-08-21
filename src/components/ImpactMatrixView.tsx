import React, { useState } from 'react';
import { MacroEvent } from '../types';
import { Gauge, Info } from 'lucide-react';

interface ImpactMatrixViewProps {
  events: MacroEvent[];
  onChangeVarietyImpact: (eventId: string, varietyCode: string, score: number | undefined) => void;
  onSelectEvent: (id: string, openDrawer?: boolean) => void;
}

// 分数对应的视觉样式（0=无冲击，1=极弱 ～ 5=极强）
const SCORE_STYLES: Record<number, string> = {
  0: 'bg-slate-50 text-slate-400 border-slate-200',
  1: 'bg-gray-100 text-gray-600 border-gray-300',
  2: 'bg-sky-50 text-sky-700 border-sky-300',
  3: 'bg-amber-50 text-amber-700 border-amber-300',
  4: 'bg-orange-50 text-orange-700 border-orange-300',
  5: 'bg-rose-50 text-rose-700 border-rose-300',
};

const SCORE_LABELS: Record<number, string> = {
  0: '无冲击',
  1: '极弱',
  2: '弱',
  3: '中',
  4: '强',
  5: '极强',
};

export const ImpactMatrixView: React.FC<ImpactMatrixViewProps> = ({
  events,
  onChangeVarietyImpact,
  onSelectEvent,
}) => {
  const [varietyFilter, setVarietyFilter] = useState<string>('');

  // 按时间正序展示事件
  const sortedEvents = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

  // 汇总全部出现过的品种（代码 -> 名称）
  const varietyMap: Record<string, string> = {};
  events.forEach((e) =>
    e.marketVarieties.forEach((v) => {
      varietyMap[v.code] = v.name;
    })
  );
  let varietyCodes = Object.keys(varietyMap).sort((a, b) => a.localeCompare(b));
  if (varietyFilter) {
    varietyCodes = varietyCodes.filter((c) => c === varietyFilter);
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* Top Toolbar */}
      <div className="p-6 bg-white border-b border-slate-200/80 shadow-2xs space-y-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Gauge className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                商品冲击评分矩阵
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                按事件 × 品种维度维护商品冲击程度（0～5分），未单独设置的品种自动沿用事件级统一评分
              </p>
            </div>
          </div>

          {/* Variety Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold shrink-0">品种筛选</span>
            <select
              value={varietyFilter}
              onChange={(e) => setVarietyFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="">全部品种</option>
              {Object.entries(varietyMap)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}（{code}）
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Score Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            评级标准
          </span>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold border rounded ${SCORE_STYLES[n]}`}
            >
              {n} = {SCORE_LABELS[n]}
            </span>
          ))}
          <span className="text-[10px] text-slate-400 ml-1">
            未单独修改的品种自动沿用事件级统一评分，下拉即可单独调整
          </span>
        </div>
      </div>

      {/* Matrix Table Area */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        {sortedEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-sm font-semibold text-slate-700">暂无重大事件</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden w-max min-w-full">
            <table className="text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold sticky left-0 bg-slate-50/95 backdrop-blur-xs z-10 min-w-[220px]">
                    事件（按时间排序）
                  </th>
                  <th className="py-3.5 px-3 font-bold text-center whitespace-nowrap">
                    事件级评分
                  </th>
                  {varietyCodes.map((code) => (
                    <th key={code} className="py-3.5 px-3 font-bold text-center whitespace-nowrap">
                      <div className="text-slate-800">{varietyMap[code]}</div>
                      <div className="text-[10px] text-slate-400 font-mono normal-case">{code}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Event Name Cell */}
                    <td className="py-3 px-4 sticky left-0 bg-white z-10 align-middle">
                      <button
                        type="button"
                        onClick={() => onSelectEvent(evt.id, true)}
                        className="text-left cursor-pointer group"
                        title="点击编辑该事件"
                      >
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {evt.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {evt.startDate}
                        </div>
                      </button>
                    </td>

                    {/* Event-level Impact Score */}
                    <td className="py-3 px-3 align-middle text-center">
                      {evt.commodityImpact != null ? (
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full border ${SCORE_STYLES[evt.commodityImpact]}`}
                        >
                          {evt.commodityImpact}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Per-variety Score Cells */}
                    {varietyCodes.map((code) => {
                      const variety = evt.marketVarieties.find((v) => v.code === code);
                      if (!variety) {
                        return (
                          <td key={code} className="py-3 px-3 align-middle text-center text-slate-200">
                            ·
                          </td>
                        );
                      }
                      const effective = variety.impactScore ?? evt.commodityImpact;
                      return (
                        <td key={code} className="py-3 px-3 align-middle text-center">
                          <div className="inline-flex flex-col items-center gap-0.5">
                            <select
                              value={effective ?? ''}
                              onChange={(e) =>
                                onChangeVarietyImpact(
                                  evt.id,
                                  code,
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                              className={`px-1.5 py-1 text-xs font-bold rounded border cursor-pointer focus:ring-2 focus:ring-indigo-400 outline-none transition-colors ${
                                effective != null
                                  ? SCORE_STYLES[effective]
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                              title={
                                variety.impactScore == null
                                  ? `当前沿用事件级统一评分${evt.commodityImpact ?? '（未设）'}，可下拉单独修改`
                                  : '已单独设置评分'
                              }
                            >
                              {effective == null && (
                                <option value="" hidden>
                                  请选择
                                </option>
                              )}
                              {[0, 1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

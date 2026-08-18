import * as XLSX from 'xlsx';
import { MacroEvent } from '../types';

export const exportEventsToExcel = (events: MacroEvent[]) => {
  const data = events.map((e, index) => ({
    '序号': index + 1,
    '事件ID': e.id,
    '事件定义名称': e.title,
    '事件分类': e.categories.join(' / '),
    '开始时间': e.startDate,
    '事件描述': e.description,
    '影响产业': e.impactedIndustries.map((ind) => ind.name).join('、'),
    '影响品种': e.marketVarieties.map((v) => `${v.name}(${v.code})`).join('、'),
    '事件烈度（1～5）': e.eventIntensity ?? '',
    '商品冲击程度（1～5）': e.commodityImpact ?? '',
    '备注': e.managerNotes || e.researcherNotes || '',
    '更新时间': e.updatedAt || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set explicit column widths for beautiful readability in Excel
  worksheet['!cols'] = [
    { wch: 6 },  // 序号
    { wch: 20 }, // 事件ID
    { wch: 32 }, // 事件定义名称
    { wch: 20 }, // 事件分类
    { wch: 14 }, // 开始时间
    { wch: 45 }, // 事件描述
    { wch: 22 }, // 影响产业
    { wch: 25 }, // 影响品种
    { wch: 16 }, // 事件烈度（1～5）
    { wch: 18 }, // 商品冲击程度（1～5）
    { wch: 30 }, // 备注
    { wch: 18 }, // 更新时间
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '重大事件定义汇总');

  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `重大事件定义汇总表_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};

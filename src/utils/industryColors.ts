import { IndustryColor } from '../types';

export const INDUSTRY_COLOR_BADGES: Record<IndustryColor, string> = {
  amber: 'bg-amber-50 text-amber-900 border-amber-300/80',
  blue: 'bg-blue-50 text-blue-900 border-blue-300/80',
  green: 'bg-emerald-50 text-emerald-900 border-emerald-300/80',
  rose: 'bg-rose-50 text-rose-900 border-rose-300/80',
  purple: 'bg-purple-50 text-purple-900 border-purple-300/80',
  gray: 'bg-gray-100 text-gray-800 border-gray-300',
};

const INDUSTRY_PRESET_COLORS: Record<string, IndustryColor> = {
  '贵金属': 'amber',
  '电力': 'amber',
  '能源': 'blue',
  '航运': 'blue',
  '天然气': 'purple',
  '化工': 'purple',
  '煤化工': 'purple',
  '能化': 'purple',
  '化肥': 'purple',
  '基本金属': 'green',
  '工业金属': 'green',
  '金属': 'green',
  '铝': 'green',
  '农产品': 'rose',
  '橡胶': 'rose',
  '煤炭': 'gray',
  '黑色建材': 'gray',
  '黑色金属': 'gray',
  '建材': 'gray',
  '权益股指': 'purple',
};

export function getIndustryColor(name: string, explicitColor?: IndustryColor): IndustryColor {
  if (explicitColor && ['amber', 'blue', 'green', 'rose', 'purple', 'gray'].includes(explicitColor)) {
    return explicitColor;
  }

  if (INDUSTRY_PRESET_COLORS[name]) {
    return INDUSTRY_PRESET_COLORS[name];
  }

  // Fallback to deterministic hash for any custom industry name
  const colors: IndustryColor[] = ['amber', 'blue', 'green', 'rose', 'purple', 'gray'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

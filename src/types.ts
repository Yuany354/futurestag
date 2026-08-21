export type IndustryColor = 'amber' | 'blue' | 'green' | 'rose' | 'purple' | 'gray';

export interface ImpactedIndustry {
  id: string;
  name: string;
  colorStyle: IndustryColor;
}

export interface MarketVariety {
  name: string;
  code: string;
  exchange?: string;
  category?: string;
  impactScore?: number;  // 该品种在本事件下的商品冲击程度（1～5），未设置时沿用事件级评分
}

export interface MacroEvent {
  id: string;
  title: string;
  startDate: string;
  categories: string[];
  description: string;
  impactedIndustries: ImpactedIndustry[];
  marketVarieties: MarketVariety[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  eventIntensity?: number;     // 事件烈度，1～5分
  commodityImpact?: number;    // 商品冲击程度，1～5分
  transmissionMechanism: string;
  managerNotes?: string;
  researcherNotes?: string;
  researcherName?: string;
  updatedAt: string;
}

export type ActiveViewMode = 'form' | 'preview';

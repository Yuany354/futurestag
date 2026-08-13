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
  transmissionMechanism: string;
  managerNotes?: string;
  researcherNotes?: string;
  researcherName?: string;
  updatedAt: string;
}

export type ActiveViewMode = 'form' | 'preview';

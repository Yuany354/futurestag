import { MacroEvent, MarketVariety } from '../types';

export const INITIAL_CATEGORIES = [
  '地缘政治与战争',
  '金融风险与危机',
  '政策异动',
  '供应冲击',
  '流动性风险',
  '公共卫生'
];

export const VARIETY_PRESETS: MarketVariety[] = [
  { name: '沪金', code: 'AU', exchange: 'SHFE', category: '贵金属' },
  { name: '沪银', code: 'AG', exchange: 'SHFE', category: '贵金属' },
  { name: '燃料油', code: 'FU', exchange: 'SHFE', category: '能源' },
  { name: '沥青', code: 'BU', exchange: 'SHFE', category: '能源' },
  { name: '原油', code: 'SC', exchange: 'INE', category: '能源' },
  { name: '沪铜', code: 'CU', exchange: 'SHFE', category: '基本金属' },
  { name: '沪铝', code: 'AL', exchange: 'SHFE', category: '基本金属' },
  { name: '螺纹钢', code: 'RB', exchange: 'SHFE', category: '黑色建材' },
  { name: '铁矿石', code: 'I', exchange: 'DCE', category: '黑色建材' },
  { name: '焦炭', code: 'J', exchange: 'DCE', category: '黑色建材' },
  { name: '棕榈油', code: 'P', exchange: 'DCE', category: '农产品' },
  { name: '豆粕', code: 'M', exchange: 'DCE', category: '农产品' },
  { name: '10年国债', code: 'T', exchange: 'CFFEX', category: '金融' },
  { name: '沪深300', code: 'IF', exchange: 'CFFEX', category: '金融' },
];

export const INITIAL_EVENTS: MacroEvent[] = [
  {
    id: 'evt-2015-fx-reform',
    title: '2015 汇率形成机制改革及其市场冲击',
    startDate: '2015/11/10',
    categories: ['金融风险与危机', '政策异动'],
    description: '2015年8月11日，央行宣布完善人民币汇率中间价报价，导致短期内人民币大幅贬值。此次汇改引发全球金融市场连锁反应，离岸人民币汇率剧烈波动，对国内能源、贵金属等大宗商品价格产生深远影响...',
    impactedIndustries: [
      { id: 'ind-1', name: '贵金属', colorStyle: 'amber' },
      { id: 'ind-2', name: '能源', colorStyle: 'blue' },
      { id: 'ind-3', name: '基本金属', colorStyle: 'green' }
    ],
    marketVarieties: [
      { name: '沪金', code: 'AU', exchange: 'SHFE' },
      { name: '燃料油', code: 'FU', exchange: 'SHFE' },
      { name: '沥青', code: 'BU', exchange: 'SHFE' },
      { name: '沪铜', code: 'CU', exchange: 'SHFE' }
    ],
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 5,
    transmissionMechanism: '汇率中间价报价机制修正 -> 离岸贬值压力释放 -> 人民币计价大宗资产重估 -> 进口成本传导至产业链下游',
    researcherNotes: '重点关注离岸/在岸价差波动对贵金属进口套利逻辑的影响',
    researcherName: '俞尘泯',
    updatedAt: '2026/08/11 20:15'
  },
  {
    id: 'evt-2022-[#geopolitics]',
    title: '地缘局势突发波动与能源供给震荡',
    startDate: '2022/02/24',
    categories: ['地缘政治与战争', '供应冲击'],
    description: '地缘局势升级导致全球能源与农产品供应链短期严重中断，国际原油、天然气与谷物价格短期内剧烈上涨，引发全球通胀高企与流动性预期急转向。',
    impactedIndustries: [
      { id: 'ind-2', name: '能源', colorStyle: 'blue' },
      { id: 'ind-4', name: '农产品', colorStyle: 'rose' },
      { id: 'ind-3', name: '基本金属', colorStyle: 'green' }
    ],
    marketVarieties: [
      { name: '原油', code: 'SC', exchange: 'INE' },
      { name: '燃料油', code: 'FU', exchange: 'SHFE' },
      { name: '沪铝', code: 'AL', exchange: 'SHFE' },
      { name: '棕榈油', code: 'P', exchange: 'DCE' }
    ],
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 5,
    transmissionMechanism: '地缘冲突冲突加剧 -> 航运与出口封锁 -> 现货供给紧缩溢价飙升 -> 制造终端成本倒挂',
    researcherNotes: '俄乌局势下原油与欧洲天然气价格联动极强，重点监测原油与燃料油裂解价差',
    researcherName: '俞尘泯',
    updatedAt: '2026/08/10 14:22'
  },
  {
    id: 'evt-2020-[#health]',
    title: '公共卫生紧急状态及全产业链停摆',
    startDate: '2020/01/23',
    categories: ['公共卫生', '流动性风险'],
    description: '突发公共卫生事件导致全球供需两端同时收缩，物流中断与工厂停工引发初期抛售，随之而来的超常规货币宽松又带来大宗商品的V型反转。',
    impactedIndustries: [
      { id: 'ind-1', name: '贵金属', colorStyle: 'amber' },
      { id: 'ind-2', name: '能源', colorStyle: 'blue' }
    ],
    marketVarieties: [
      { name: '沪金', code: 'AU', exchange: 'SHFE' },
      { name: '沪银', code: 'AG', exchange: 'SHFE' },
      { name: '螺纹钢', code: 'RB', exchange: 'SHFE' },
      { name: '原油', code: 'SC', exchange: 'INE' }
    ],
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 4,
    transmissionMechanism: '物流与开工受阻 -> 需求短期冰封 -> 资产流动性挤提 -> 美联储/全球央行降息开闸',
    researcherNotes: '极端冲击下金银比历史高位修复逻辑研究',
    researcherName: '俞尘泯',
    updatedAt: '2026/08/08 09:10'
  },
  {
    id: 'evt-2013-liquidity-tightening',
    title: '流动性收紧预期引发钱荒暴跌',
    startDate: '2013/06/20',
    categories: ['流动性风险', '政策异动'],
    description: '银行间市场资金面极度紧张，隔夜拆借利率一度飙升至历史高位。市场对央行货币政策转向紧缩产生恐慌，权益与固收及大宗商品市场普遍遭抛售。',
    impactedIndustries: [
      { id: 'ind-6', name: '权益股指', colorStyle: 'purple' },
      { id: 'ind-7', name: '黑色建材', colorStyle: 'gray' }
    ],
    marketVarieties: [
      { name: '10年国债', code: 'T', exchange: 'CFFEX' },
      { name: '沪深300', code: 'IF', exchange: 'CFFEX' },
      { name: '螺纹钢', code: 'RB', exchange: 'SHFE' }
    ],
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 3,
    transmissionMechanism: '跨季资金紧俏 -> 拆借利率暴涨 -> 机构去杠杆被迫抛售 -> 资产价格无差别下杀',
    researcherNotes: '流动性危机时期信用债与高Beta品种折价最大',
    researcherName: '俞尘泯',
    updatedAt: '2026/08/01 11:45'
  }
];

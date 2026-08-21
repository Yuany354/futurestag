import { MacroEvent, MarketVariety, ImpactedIndustry } from '../types';
import { getIndustryColor } from '../utils/industryColors';

export const INITIAL_CATEGORIES = [
  '地缘政治与战争',
  '金融风险与危机',
  '政策异动',
  '供应冲击',
  '流动性风险',
  '公共卫生'
];

export const VARIETY_PRESETS: MarketVariety[] = [
  // 贵金属
  { name: '沪金', code: 'AU', exchange: 'SHFE', category: '贵金属' },
  { name: '沪银', code: 'AG', exchange: 'SHFE', category: '贵金属' },
  // 能源
  { name: '燃料油', code: 'FU', exchange: 'SHFE', category: '能源' },
  { name: '沥青', code: 'BU', exchange: 'SHFE', category: '能源' },
  { name: '原油', code: 'SC', exchange: 'INE', category: '能源' },
  { name: 'LPG', code: 'PG', exchange: 'DCE', category: '能源' },
  // 基本金属
  { name: '沪铜', code: 'CU', exchange: 'SHFE', category: '基本金属' },
  { name: '沪铝', code: 'AL', exchange: 'SHFE', category: '基本金属' },
  { name: '沪锌', code: 'ZN', exchange: 'SHFE', category: '基本金属' },
  { name: '沪镍', code: 'NI', exchange: 'SHFE', category: '基本金属' },
  // 黑色建材
  { name: '螺纹钢', code: 'RB', exchange: 'SHFE', category: '黑色建材' },
  { name: '铁矿石', code: 'I', exchange: 'DCE', category: '黑色建材' },
  { name: '焦炭', code: 'J', exchange: 'DCE', category: '黑色建材' },
  { name: '焦煤', code: 'JM', exchange: 'DCE', category: '煤炭' },
  { name: '动力煤', code: 'ZC', exchange: 'CZCE', category: '煤炭' },
  { name: '硅铁', code: 'SF', exchange: 'CZCE', category: '黑色建材' },
  { name: '玻璃', code: 'FG', exchange: 'CZCE', category: '建材' },
  // 农产品
  { name: '棕榈油', code: 'P', exchange: 'DCE', category: '农产品' },
  { name: '豆粕', code: 'M', exchange: 'DCE', category: '农产品' },
  { name: '菜油', code: 'OI', exchange: 'CZCE', category: '农产品' },
  { name: '玉米', code: 'C', exchange: 'DCE', category: '农产品' },
  // 化工
  { name: '天胶', code: 'RU', exchange: 'SHFE', category: '化工' },
  { name: 'PTA', code: 'TA', exchange: 'CZCE', category: '化工' },
  { name: '甲醇', code: 'MA', exchange: 'CZCE', category: '化工' },
  { name: 'PVC', code: 'V', exchange: 'DCE', category: '化工' },
  { name: '尿素', code: 'UR', exchange: 'CZCE', category: '化工' },
  { name: '多晶硅', code: 'PS', exchange: 'GFEX', category: '化工' },
  // 航运 / 金融
  { name: '集运指数', code: 'EC', exchange: 'INE', category: '航运' },
  { name: '10年国债', code: 'T', exchange: 'CFFEX', category: '金融' },
  { name: '沪深300', code: 'IF', exchange: 'CFFEX', category: '金融' },
];

// ---------- 事件构建辅助函数 ----------

// 按交易代码从品种库取品种信息，并赋上该事件下统一的商品冲击程度评分
const pick = (code: string, impactScore: number): MarketVariety => {
  const preset = VARIETY_PRESETS.find((p) => p.code === code);
  return {
    name: preset?.name ?? code,
    code,
    exchange: preset?.exchange,
    impactScore,
  };
};

const varieties = (codes: string[], impactScore: number): MarketVariety[] =>
  codes.map((c) => pick(c, impactScore));

const industries = (names: string[]): ImpactedIndustry[] =>
  names.map((name) => ({ id: `ind-${name}`, name, colorStyle: getIndustryColor(name) }));

/**
 * 预置重大事件库（依据《重大事件字段梳理——正式》表格维护）
 * 各事件下的品种冲击评分初始统一取表格中的「商品冲击程度」，管理端可按品种单独调整
 */
export const INITIAL_EVENTS: MacroEvent[] = [
  {
    id: 'evt-1997-asian-financial-crisis',
    title: '亚洲金融危机',
    startDate: '1997/07/02',
    categories: ['金融风险与危机'],
    description: '泰铢失守引发区域性货币与金融崩盘，需求骤降；金属、橡胶及新兴市场经济体大宗商品承压，货币贬值加剧输入成本。',
    impactedIndustries: industries(['基本金属', '橡胶']),
    marketVarieties: varieties(['CU', 'AL', 'RU'], 4),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 4,
    transmissionMechanism: '泰铢贬值 -> 东南亚货币与金融体系连锁崩盘 -> 区域需求骤降 -> 金属、橡胶等大宗商品承压',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2000-dotcom-bubble',
    title: '互联网泡沫破裂',
    startDate: '2000/03/13',
    categories: ['金融风险与危机'],
    description: '自2000年3月纳斯达克见顶后，市场经历系统性估值崩塌与流动性枯竭，带动商品价格出现下跌。',
    impactedIndustries: industries(['基本金属', '贵金属']),
    marketVarieties: varieties(['CU', 'AL'], 2),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 2,
    transmissionMechanism: '科技股估值崩塌 -> 流动性枯竭与风险偏好收缩 -> 全球增长预期下修 -> 商品价格联动走弱',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2008-global-financial-crisis',
    title: '全球金融危机与雷曼破产',
    startDate: '2008/09/15',
    categories: ['金融风险与危机'],
    description: '巴黎银行冻结次贷基金，需求预期崩塌；原油、金属、农产品全线重挫。',
    impactedIndustries: industries(['能源', '贵金属', '基本金属', '农产品', '化工']),
    marketVarieties: varieties(['FU', 'AU', 'CU', 'RU', 'TA'], 5),
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 5,
    transmissionMechanism: '次贷危机引爆 -> 全球信用收缩与需求预期崩塌 -> 大宗商品全线重挫 -> 避险与流动性挤提交织',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2008-four-trillion-qe',
    title: '四万亿刺激+全球量化宽松',
    startDate: '2008/11/09',
    categories: ['政策异动'],
    description: '中国的四万亿刺激计划与美国QE出炉，驱动经济V型修复，商品指数快速反弹，工业品领涨。',
    impactedIndustries: industries(['能源', '贵金属', '基本金属', '农产品', '化工']),
    marketVarieties: varieties(['FU', 'AU', 'CU', 'RU', 'TA'], 5),
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 5,
    transmissionMechanism: '中国四万亿+美国QE -> 流动性泛滥与基建投资扩张 -> 需求预期急速修复 -> 商品指数V型反弹、工业品领涨',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2011-sovereign-debt-crisis',
    title: '欧美债务危机(美债上限+欧债)',
    startDate: '2011/08/05',
    categories: ['金融风险与危机'],
    description: '美债上限僵局与欧债危机交织，避险推升金银，基本金属与工业需求承压。',
    impactedIndustries: industries(['贵金属', '基本金属']),
    marketVarieties: varieties(['AU', 'CU', 'AL'], 4),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 4,
    transmissionMechanism: '美债上限僵局+欧债危机 -> 主权信用风险飙升 -> 避险资金涌入金银 -> 工业需求预期承压压制基本金属',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2013-taper-tantrum',
    title: '美联储缩减恐慌',
    startDate: '2013/05/22',
    categories: ['流动性风险'],
    description: '时任美联储主席伯南克暗示退出QE，新兴市场资产与商品承压，金属、原油回落。',
    impactedIndustries: industries(['贵金属', '基本金属']),
    marketVarieties: varieties(['AU', 'CU', 'AL'], 3),
    severity: 'medium',
    eventIntensity: 3,
    commodityImpact: 3,
    transmissionMechanism: '伯南克暗示退出QE -> 美债收益率飙升、美元走强 -> 新兴市场资本外流 -> 金属与原油回落',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2015-stock-crash',
    title: '中国股灾与商品熊市',
    startDate: '2015/06/12',
    categories: ['流动性风险'],
    description: 'A股崩盘与需求放缓叠加，工业金属创新低，铁矿石、螺纹、铜深度下探。',
    impactedIndustries: industries(['黑色金属', '基本金属', '化工']),
    marketVarieties: varieties(['RB', 'CU', 'AL', 'MA'], 4),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 4,
    transmissionMechanism: 'A股杠杆崩塌 -> 风险偏好与流动性双杀 -> 叠加国内需求放缓 -> 工业金属与黑色系深度下探创新低',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2015-supply-side-reform',
    title: '供给侧结构性改革',
    startDate: '2015/11/10',
    categories: ['政策异动'],
    description: '供给侧改革去产能对煤炭、钢铁、有色等多类工业品价格形成提振，黑色建材、电解铝等价格显著受益。',
    impactedIndustries: industries(['黑色金属', '煤炭', '建材', '铝']),
    marketVarieties: varieties(['RB', 'JM', 'ZC', 'FG', 'AL'], 5),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 5,
    transmissionMechanism: '供给侧改革去产能 -> 煤炭、钢铁、电解铝等行业供给收缩 -> 供需格局逆转 -> 工业品价格系统性抬升',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2018-trade-war',
    title: '中美贸易战',
    startDate: '2018/03/22',
    categories: ['政策异动'],
    description: '美国对华加征关税，中国对美豆加征反制关税，大豆贸易流转向巴西；金属、能源与制造业链条承压。',
    impactedIndustries: industries(['农产品', '基本金属', '能源']),
    marketVarieties: varieties(['M', 'C', 'CU', 'RB', 'RU'], 3),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 3,
    transmissionMechanism: '美国对华加征关税 -> 中国对美豆反制、贸易流转向巴西 -> 制造业与出口链承压 -> 金属、能源需求预期走弱',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2020-covid19',
    title: 'COVID-19全球大流行',
    startDate: '2020/01/23',
    categories: ['公共卫生'],
    description: '疫情致工业停滞、交通停运，需求断崖；商品普跌。',
    impactedIndustries: industries(['能源', '化工', '基本金属', '农产品', '贵金属']),
    marketVarieties: varieties(['SC', 'TA', 'MA', 'CU', 'RB', 'RU', 'M', 'AU'], 5),
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 5,
    transmissionMechanism: '疫情全球蔓延 -> 工业停滞、交通停运 -> 供需两端同时冰封 -> 商品普跌、流动性挤提',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2020-qe-recovery',
    title: '全球流动性放水+疫后复苏',
    startDate: '2020/03/23',
    categories: ['政策异动'],
    description: '美联储无限量QE与中国率先复产，流动性充裕叠加需求修复，商品超级反弹。',
    impactedIndustries: industries(['能源', '化工', '基本金属', '农产品', '贵金属']),
    marketVarieties: varieties(['SC', 'TA', 'MA', 'CU', 'RB', 'RU', 'M', 'AU'], 5),
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 5,
    transmissionMechanism: '美联储无限量QE+中国率先复产 -> 流动性泛滥叠加需求修复 -> 商品超级反弹 -> 通胀预期快速升温',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2021-energy-dual-control',
    title: '能耗双控与工业限电',
    startDate: '2021/08/22',
    categories: ['政策异动'],
    description: '能耗双控与缺煤限电致高耗能品供给收缩，铝、钢、化工、煤等价格强势。',
    impactedIndustries: industries(['铝', '黑色金属', '煤化工']),
    marketVarieties: varieties(['AL', 'RB', 'SF', 'ZC', 'V', 'MA', 'UR'], 5),
    severity: 'medium',
    eventIntensity: 3,
    commodityImpact: 5,
    transmissionMechanism: '能耗双控考核+缺煤限电 -> 高耗能行业开工骤降 -> 供给收缩叠加缺煤恐慌 -> 铝、钢、化工、煤价格强势上行',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2021-eu-energy-crisis',
    title: '欧洲能源危机',
    startDate: '2021/12/21',
    categories: ['供应冲击'],
    description: '欧洲天然气价格紧缺，俄欧之间的亚马尔-欧洲天然气管道流量降为零，推高电价、煤炭、化肥与能耗金属(铝、锌)。',
    impactedIndustries: industries(['天然气', '电力', '化肥', '基本金属']),
    marketVarieties: varieties(['PG', 'UR', 'ZN', 'AL'], 3),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 3,
    transmissionMechanism: '欧洲天然气紧缺、亚马尔管道流量归零 -> 电价飙升 -> 化肥与能耗金属(铝、锌)成本抬升 -> 能源链价格全面推高',
    managerNotes: '危机从2021年9月已酝酿',
    researcherNotes: '危机从2021年9月已酝酿',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2022-russia-ukraine',
    title: '俄乌冲突',
    startDate: '2022/02/24',
    categories: ['地缘政治与战争'],
    description: '俄罗斯进行特别军事行动，两国占全球小麦30%、玉米20%、葵花油50%+、化肥20%；能源、谷物、金属、化肥全面冲击。',
    impactedIndustries: industries(['能源', '农产品', '基本金属', '化肥', '贵金属']),
    marketVarieties: varieties(['SC', 'PG', 'C', 'M', 'P', 'OI', 'UR', 'CU', 'AL', 'NI', 'AU'], 5),
    severity: 'critical',
    eventIntensity: 5,
    commodityImpact: 5,
    transmissionMechanism: '军事行动爆发 -> 能源与谷物出口受阻、制裁升级 -> 供给溢价飙升 -> 能源、谷物、金属、化肥全面冲击',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2022-fed-hiking',
    title: '美联储激进加息与全球紧缩',
    startDate: '2022/06/15',
    categories: ['流动性风险'],
    description: '抗通胀迫使美联储激进加息，美元走强、需求预期下修，商品指数自6月后大幅回落。',
    impactedIndustries: industries(['贵金属', '基本金属', '农产品', '能源', '能化']),
    marketVarieties: varieties(['AU', 'CU', 'P', 'SC', 'TA'], 5),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 5,
    transmissionMechanism: '抗通胀激进加息 -> 美元走强、实际利率抬升 -> 全球需求预期下修 -> 商品指数自6月后大幅回落',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2023-svb-crisis',
    title: '硅谷银行危机',
    startDate: '2023/03/10',
    categories: ['流动性风险'],
    description: 'SVB倒闭，美财政部/美联储/FDIC联合接管，拜登讲话，避险推升黄金，风险资产短期承压。',
    impactedIndustries: industries(['能源', '贵金属', '基本金属']),
    marketVarieties: varieties(['SC', 'AU', 'CU'], 2),
    severity: 'medium',
    eventIntensity: 3,
    commodityImpact: 2,
    transmissionMechanism: 'SVB倒闭 -> 监管部门联合接管稳定预期 -> 避险推升黄金 -> 风险资产短期承压',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2023-red-sea-crisis',
    title: '红海航运危机',
    startDate: '2023/11/19',
    categories: ['地缘政治与战争'],
    description: '胡塞武装袭击红海船只，航运绕行推升运价与保险成本，能源与集装箱运输受扰。',
    impactedIndustries: industries(['航运', '能源', '贵金属']),
    marketVarieties: varieties(['EC', 'SC', 'AU'], 3),
    severity: 'medium',
    eventIntensity: 3,
    commodityImpact: 3,
    transmissionMechanism: '胡塞武装袭击红海船只 -> 船舶绕行好望角 -> 运价与保险成本抬升 -> 能源与集装箱运输受扰',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2024-boj-carry-unwind',
    title: '日央行加息引发套息交易平仓',
    startDate: '2024/07/31',
    categories: ['流动性风险'],
    description: '日央行加息引发套息交易平仓，全球风险偏好下降，商品短期普跌。',
    impactedIndustries: industries(['能源', '基本金属', '贵金属']),
    marketVarieties: varieties(['SC', 'CU', 'AU'], 2),
    severity: 'medium',
    eventIntensity: 3,
    commodityImpact: 2,
    transmissionMechanism: '日央行加息 -> 日元套息交易集中平仓 -> 全球风险偏好骤降 -> 商品短期普跌',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2025-reciprocal-tariff',
    title: '特朗普推出对等关税',
    startDate: '2025/04/02',
    categories: ['政策异动'],
    description: '特朗普推出普适性关税政策，全球风险资产被恐慌抛售。',
    impactedIndustries: industries(['贵金属', '基本金属', '黑色金属', '农产品', '能源']),
    marketVarieties: varieties(['AU', 'CU', 'RB', 'M', 'SC'], 3),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 3,
    transmissionMechanism: '普适性对等关税落地 -> 全球贸易与增长预期恶化 -> 风险资产恐慌抛售 -> 商品需求预期系统性下修',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2025-israel-iran-war',
    title: '美以伊十二日战争',
    startDate: '2025/06/13',
    categories: ['地缘政治与战争'],
    description: '以色列空袭伊朗，油价脉冲式暴涨。',
    impactedIndustries: industries(['贵金属', '基本金属', '黑色金属', '农产品', '能源']),
    marketVarieties: varieties(['AU', 'CU', 'I', 'P', 'SC'], 3),
    severity: 'medium',
    eventIntensity: 3,
    commodityImpact: 3,
    transmissionMechanism: '以色列空袭伊朗 -> 中东地缘风险陡升 -> 油价脉冲式暴涨 -> 避险与供给溢价快速计入',
    managerNotes: '短期影响',
    researcherNotes: '短期影响',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2025-anti-involution',
    title: '推进防止内卷式恶性竞争',
    startDate: '2025/07/01',
    categories: ['政策异动'],
    description: '多部门联合推进、细化执行方案，政策力度持续加码，传递出长期治理信号。',
    impactedIndustries: industries(['工业金属', '煤炭', '建材']),
    marketVarieties: varieties(['PS', 'JM', 'FG'], 4),
    severity: 'medium',
    eventIntensity: 3,
    commodityImpact: 4,
    transmissionMechanism: '多部门联合推进反内卷 -> 细化执行方案、政策持续加码 -> 行业供给与价格秩序重塑 -> 相关工业品价格中枢抬升',
    updatedAt: '2026/08/21 09:00'
  },
  {
    id: 'evt-2026-us-iran-escalation',
    title: '美伊冲突升级',
    startDate: '2026/02/28',
    categories: ['地缘政治与战争'],
    description: '美伊冲突升级，市场担忧霍尔木兹海峡航运与波斯湾原油(1500万桶/日)供给。',
    impactedIndustries: industries(['能源', '化工', '贵金属', '基本金属']),
    marketVarieties: varieties(['SC', 'PG', 'MA', 'UR', 'AU', 'CU'], 4),
    severity: 'high',
    eventIntensity: 4,
    commodityImpact: 4,
    transmissionMechanism: '美伊冲突升级 -> 霍尔木兹海峡航运风险飙升 -> 波斯湾原油供给担忧 -> 能源与化工品供给溢价计入',
    updatedAt: '2026/08/21 09:00'
  }
];

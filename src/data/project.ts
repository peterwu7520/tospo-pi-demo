// ─────────────────────────────────────────────────────────────────────────────
// ONE DATA MODEL — TOSPO Product Intelligence OS
// Project: EVE Lighting × Thailand × Highbay — "Next Gen Highbay"
// Every number in the system is a view over this single model.
// Demonstration data: public-information based, classified per evidence taxonomy.
// ─────────────────────────────────────────────────────────────────────────────

export type EvType = 'CONFIRMED' | 'PROXY' | 'ESTIMATE' | 'INFERENCE' | 'TARGET' | 'INTERNAL'

export interface Evidence {
  id: string
  label: string
  value: string
  type: EvType
  source: string
  date: string
  confidence: 'High' | 'Medium' | 'Low' | '—'
  reasoning: string
  supports?: string
}

export const EVIDENCE_TYPE_META: Record<EvType, { desc: string; cssVar: string }> = {
  CONFIRMED: { desc: 'Publicly verifiable', cssVar: 'var(--ev-confirmed)' },
  PROXY: { desc: 'Observable proxy — not market share', cssVar: 'var(--ev-proxy)' },
  ESTIMATE: { desc: 'Analyst estimate', cssVar: 'var(--ev-estimate)' },
  INFERENCE: { desc: 'Analytical conclusion', cssVar: 'var(--ev-inference)' },
  TARGET: { desc: 'Recommended target — not a market fact', cssVar: 'var(--ev-target)' },
  INTERNAL: { desc: 'Internal data required', cssVar: 'var(--ev-internal)' },
}

export const EVIDENCE: Evidence[] = [
  {
    id: 'eve-efficacy', label: 'EVE current highbay efficacy', value: '≈ 90 lm/W', type: 'CONFIRMED',
    source: 'EVE Lighting TH — public product pages', date: 'Retrieved 2026-08', confidence: 'High',
    reasoning: 'EVE 在售工矿灯公开规格标称约 90 lm/W，处于 Value/Mainstream 层。',
    supports: 'Decision: 以 160 lm/W 进入 Professional 层',
  },
  {
    id: 'eve-pf', label: 'EVE current power factor', value: 'PF 0.5', type: 'CONFIRMED',
    source: 'EVE Lighting TH — public spec label', date: 'Retrieved 2026-08', confidence: 'High',
    reasoning: '公开标称 PF 0.5；工业客户与项目标普遍要求 PF ≥ 0.9。',
    supports: 'Decision: 目标 PF ≥ 0.95',
  },
  {
    id: 'prof-band', label: 'Professional efficacy band', value: '130–160+ lm/W', type: 'INFERENCE',
    source: 'Derived from 6 branded SKU spec sheets', date: 'Compiled 2026-08', confidence: 'High',
    reasoning: 'BEC / LAMPTAN / Philips / RACER 的专业款集中在 130–160 lm/W；>160 开始出现溢价与智能功能。',
    supports: 'Decision: TARGET 160 lm/W — Professional 层上沿',
  },
  {
    id: 'philips-pos', label: 'Philips GreenPerform position', value: '140 lm/W · ฿3,900', type: 'CONFIRMED',
    source: 'Philips TH catalog & dealer listing', date: 'Retrieved 2026-08', confidence: 'High',
    reasoning: '国际品牌占据 ฿3,500+ 高价带，为项目渠道标杆。',
    supports: 'Decision: 不正面打 Philips 价位',
  },
  {
    id: 'bec-pos', label: 'BEC professional position', value: '135 lm/W · ฿2,450', type: 'CONFIRMED',
    source: 'BEC TH public listing', date: 'Retrieved 2026-08', confidence: 'Medium',
    reasoning: '本土大牌占据 ฿2,300–2,600 专业价位。',
    supports: 'Decision: 窗口应低于 BEC 同性能档',
  },
  {
    id: 'lamptan-pos', label: 'LAMPTAN professional position', value: '130 lm/W · ฿2,190', type: 'CONFIRMED',
    source: 'LAMPTAN public listing', date: 'Retrieved 2026-08', confidence: 'Medium',
    reasoning: '฿2,190 是本土专业款的可见价格锚点。',
    supports: 'Decision: TARGET 上沿贴住 ฿2,190',
  },
  {
    id: 'whitelabel-claims', label: 'White-label claimed specs', value: '"160 lm/W" @ ฿1,2xx', type: 'PROXY',
    source: 'Shopee / Lazada TH listings (unverified claims)', date: 'Observed 2026-08', confidence: 'Low',
    reasoning: '白牌虚标严重，标称不可信；但价格存在说明低价需求真实。',
    supports: 'Decision: 以"真实标称 + 实测证据"建立信任差异',
  },
  {
    id: 'price-window', label: 'Underserved price × performance window', value: '฿1,800–2,300 × 140–165 lm/W', type: 'INFERENCE',
    source: 'Price × Performance map analysis', date: 'Compiled 2026-08', confidence: 'Medium',
    reasoning: '白牌有价格无可信性能，Philips 有性能但价格翻倍；主流专业带存在空位。',
    supports: 'Decision: TARGET ฿1,890–2,190',
  },
  {
    id: 'channel-fit', label: 'EVE channel fit', value: 'Project + Distributor', type: 'PROXY',
    source: 'EVE channel presence observation', date: 'Observed 2026-08', confidence: 'Medium',
    reasoning: 'EVE 电商强，但 Highbay 决策在工程/分销渠道；需以分销 + 项目双轨进入。',
    supports: 'Decision: 渠道策略 Project + Distributor',
  },
  {
    id: 'tisi', label: 'Certification requirement', value: 'TISI mandatory', type: 'CONFIRMED',
    source: 'Thai Industrial Standards Institute scope', date: 'Current regulation', confidence: 'High',
    reasoning: 'LED 灯具在泰国属 TISI 强制认证范围，持证主体须为本地注册公司（EVE 具备）。',
    supports: 'Gate: Certification',
  },
  {
    id: 'warranty-bench', label: 'Warranty benchmark', value: '3–5 Y', type: 'CONFIRMED',
    source: 'Philips 5Y / BEC 3Y public warranty terms', date: 'Retrieved 2026-08', confidence: 'High',
    reasoning: '专业层质保基准 3–5 年；EVE 现状约 2 年。',
    supports: 'Decision: TARGET 3–5Y',
  },
  {
    id: 'target-160', label: 'Target efficacy', value: '160 lm/W', type: 'TARGET',
    source: 'TOSPO recommendation', date: '2026-09', confidence: '—',
    reasoning: 'Professional 层上沿 = 可感知代差；落在窗口内且压过 LAMPTAN/BEC 同价位款。',
    supports: 'Target Product Definition',
  },
  {
    id: 'target-price', label: 'Target retail band', value: '฿1,890–2,190', type: 'TARGET',
    source: 'TOSPO recommendation', date: '2026-09', confidence: '—',
    reasoning: '上沿贴 LAMPTAN ฿2,190 锚点，下沿与白牌拉开 ≥฿600 信任距离。',
    supports: 'Target Product Definition',
  },
  {
    id: 'score-82', label: 'Opportunity score', value: '82 / 100', type: 'INFERENCE',
    source: 'Opportunity engine — 9 weighted dimensions', date: 'Computed 2026-09', confidence: 'Medium',
    reasoning: '九维加权合成；每一维可展开到证据。不是黑盒。',
    supports: 'Decision: 推进 Highbay 机会',
  },
  {
    id: 'tospo-capability', label: 'TOSPO capability fit', value: 'INTERNAL DATA REQUIRED', type: 'INTERNAL',
    source: '——', date: '——', confidence: '—',
    reasoning: '需要得邦内部 BOM 成本、产线兼容度、散热平台复用率数据后才能评分。缺数据不假装。',
    supports: 'Gate: Cost / Engineering validation',
  },
  {
    id: 'lab-proof', label: 'Claimed vs measured — white-label', value: '标称 160 → 实测 ≈112 lm/W', type: 'CONFIRMED',
    source: 'TOSPO Lab teardown & integrating-sphere test（演示数据）', date: 'Tested 2026-08', confidence: 'High',
    reasoning: '购样 3 款热销白牌送实验室：标称普遍虚高 30%+。虚标成风 = "可信品牌"位置空缺，实测报告可直接变成详情页证据。',
    supports: 'Decision: 以"真实标称 + 实测背书"建立信任差异',
  },
  {
    id: 'eve-assets', label: 'EVE transferable assets', value: 'TISI 主体 · 电商头部 · 本地仓', type: 'CONFIRMED',
    source: '公开渠道观察 + EVE 官网', date: 'Observed 2026-08', confidence: 'Medium',
    reasoning: 'TISI 持证须本地注册公司（EVE 具备）；电商头部心智可迁移到"可信专业层"；本地仓缩短交付。',
    supports: 'Decision: 窗口的门票 EVE 已经拿在手里',
  },
  {
    id: 'order-flow', label: 'Professional orders are flowing elsewhere', value: 'BEC / LAMPTAN / Philips', type: 'INFERENCE',
    source: '渠道货架与项目中标观察', date: 'Compiled 2026-08', confidence: 'Medium',
    reasoning: '专业层订单正在被有 130+ lm/W、PF≥0.9 产品线的品牌接走；EVE 缺席意味着每个项目季都在失血。',
    supports: 'Decision: WHY NOW — 窗口不会一直开着',
  },
  {
    id: 'market-size', label: 'Thailand highbay demand pool', value: 'Growing (range withheld)', type: 'ESTIMATE',
    source: 'Warehouse construction pipeline & industrial LED import signals', date: 'Compiled 2026-08', confidence: 'Low',
    reasoning: '方向性判断：厂房/仓储建设持续；不给精确规模数字，因为公开数据不足以支撑。',
    supports: 'Context only — 不作为决策依据',
  },
]

export const evById = (id: string) => EVIDENCE.find((e) => e.id === id)

// ─── Market structure: Price × Performance SKUs ─────────────────────────────

export type Brand = 'EVE' | 'BEC' | 'LAMPTAN' | 'Philips' | 'RACER' | 'White-label'

export const BRAND_META: Record<Brand, { color: string; shelf: string }> = {
  EVE:          { color: '#B08D3E', shelf: '电商主流层强者，专业层缺席' },
  BEC:          { color: '#5D80D9', shelf: '本土专业大牌，฿2,300–2,600' },
  LAMPTAN:      { color: '#7A8F6A', shelf: '本土专业性价比锚点 ฿2,190' },
  Philips:      { color: '#B07D4F', shelf: '国际高端标杆，฿3,500+' },
  RACER:        { color: '#4E6E6A', shelf: '专业高性能小众玩家' },
  'White-label':{ color: '#8A8680', shelf: '低价虚标，无信任资产' },
}

export interface SKU {
  id: string; brand: Brand; model: string
  power: number; efficacy: number; price: number
  ev: string; claimed?: boolean
}

export const SKUS: SKU[] = [
  { id: 'eve100',  brand: 'EVE',         model: 'EVE HB-100',        power: 100, efficacy: 90,  price: 1290, ev: 'eve-efficacy' },
  { id: 'eve150',  brand: 'EVE',         model: 'EVE HB-150',        power: 150, efficacy: 92,  price: 1690, ev: 'eve-efficacy' },
  { id: 'bec100',  brand: 'BEC',         model: 'BEC BHB-100',       power: 100, efficacy: 120, price: 1850, ev: 'bec-pos' },
  { id: 'bec150',  brand: 'BEC',         model: 'BEC BHB-150',       power: 150, efficacy: 135, price: 2450, ev: 'bec-pos' },
  { id: 'lam150',  brand: 'LAMPTAN',     model: 'LAMPTAN HB-PRO',    power: 150, efficacy: 130, price: 2190, ev: 'lamptan-pos' },
  { id: 'phi150',  brand: 'Philips',     model: 'GreenPerform 150',  power: 150, efficacy: 140, price: 3900, ev: 'philips-pos' },
  { id: 'phi200',  brand: 'Philips',     model: 'GreenPerform 200',  power: 200, efficacy: 143, price: 4600, ev: 'philips-pos' },
  { id: 'rac150',  brand: 'RACER',       model: 'RACER RHB-150',     power: 150, efficacy: 160, price: 2650, ev: 'prof-band' },
  { id: 'wl150',   brand: 'White-label', model: 'WL "150W"',         power: 150, efficacy: 160, price: 1250, ev: 'whitelabel-claims', claimed: true },
  { id: 'wl200',   brand: 'White-label', model: 'WL "200W"',         power: 200, efficacy: 155, price: 1690, ev: 'whitelabel-claims', claimed: true },
]

export const OPPORTUNITY_ZONE = { priceMin: 1800, priceMax: 2300, effMin: 140, effMax: 165 }

// ─── Spec landscape ─────────────────────────────────────────────────────────

export const SPEC_TIERS = [
  { tier: 'VALUE / MAINSTREAM', eff: '90–110 lm/W', note: '白牌与电商款主战场，PF 0.5–0.7', width: 100, ev: 'eve-efficacy' },
  { tier: 'PROFESSIONAL',       eff: '130–160+ lm/W', note: '工程与分销渠道要求，PF ≥ 0.9', width: 58, ev: 'prof-band' },
  { tier: 'PREMIUM',            eff: '160+ lm/W + 智能', note: 'DALI/传感/平台化，项目标', width: 30, ev: 'philips-pos' },
]

// ─── Customer gap map ───────────────────────────────────────────────────────

export interface GapRow {
  dim: string; unit: string
  eve: number; eveLabel: string
  bench: number; benchLabel: string
  max: number; gap: string; gapType: 'GAP' | 'HEADROOM' | 'FIT'
  ev: string
}

export const GAP_ROWS: GapRow[] = [
  { dim: 'Efficacy', unit: 'lm/W', eve: 90, eveLabel: '90', bench: 160, benchLabel: '130–160+', max: 180, gap: 'PERFORMANCE GAP', gapType: 'GAP', ev: 'eve-efficacy' },
  { dim: 'Power factor', unit: 'PF', eve: 0.5, eveLabel: '0.5', bench: 0.95, benchLabel: '≥ 0.9', max: 1, gap: 'ELECTRICAL GAP', gapType: 'GAP', ev: 'eve-pf' },
  { dim: 'Warranty', unit: 'years', eve: 2, eveLabel: '2Y', bench: 5, benchLabel: '3–5Y', max: 6, gap: 'TRUST GAP', gapType: 'GAP', ev: 'warranty-bench' },
  { dim: 'Price position', unit: '฿', eve: 1490, eveLabel: '฿1,290–1,690', bench: 2040, benchLabel: '฿1,890–2,190', max: 2600, gap: 'HEADROOM — 可上探', gapType: 'HEADROOM', ev: 'price-window' },
  { dim: 'Channel', unit: '', eve: 1, eveLabel: '电商强', bench: 2, benchLabel: '工程+分销', max: 2.4, gap: 'FIT — 需双轨', gapType: 'FIT', ev: 'channel-fit' },
]

// ─── Opportunity engine ─────────────────────────────────────────────────────

export interface ScoreDim { dim: string; score: number | null; note: string; evs: string[] }

export const SCORE_DIMS: ScoreDim[] = [
  { dim: 'Market Demand',     score: 8.2,  note: '厂房/仓储建设持续，专业款需求上行', evs: ['market-size'] },
  { dim: 'Customer Gap',      score: 9.0,  note: 'EVE 90 → 160 是清晰可见的代差', evs: ['eve-efficacy', 'eve-pf'] },
  { dim: 'Price Window',      score: 8.4,  note: '฿1,800–2,300 × 140–165 lm/W 空位', evs: ['price-window'] },
  { dim: 'Competition',       score: 7.6,  note: 'Philips 太贵，白牌不可信，中间缺可信玩家', evs: ['philips-pos', 'whitelabel-claims'] },
  { dim: 'Differentiation',   score: 8.8,  note: '真实标称 + 实测证据链 = 白牌无法复制', evs: ['whitelabel-claims'] },
  { dim: 'Margin Potential',  score: 7.9,  note: '专业层毛利结构优于电商主流层', evs: ['price-window'] },
  { dim: 'Certification',     score: 8.1,  note: 'TISI 强制，EVE 本地主体可持证', evs: ['tisi'] },
  { dim: 'Development Risk',  score: 7.2,  note: '160 lm/W 热设计是关键风险，需工程验证', evs: ['prof-band'] },
  { dim: 'TOSPO Capability',  score: null, note: 'INTERNAL DATA REQUIRED — 需 BOM / 产线 / 散热平台数据', evs: ['tospo-capability'] },
]

export const OPPORTUNITY_SCORE = 82

export const OPPORTUNITY_WINDOW = [
  { k: 'SPEC',        v: '150W · 160 lm/W · PF≥0.95 · IP65 · 90° · 3–5Y', ev: 'target-160' },
  { k: 'PRICE',       v: '฿1,890–2,190 retail',                          ev: 'target-price' },
  { k: 'DESIGN',      v: 'Radial-fin UFO, professional CMF',              ev: 'prof-band' },
  { k: 'CHANNEL',     v: 'Project + Distributor',                         ev: 'channel-fit' },
  { k: 'POSITIONING', v: 'Mainstream Professional',                       ev: 'price-window' },
]

// ─── Target product definition (STRATEGY) ───────────────────────────────────

export interface SpecRow { key: string; param: string; value: string; ev: string; why: string[] }

export const TARGET_SPECS: SpecRow[] = [
  { key: 'power', param: 'POWER', value: '150W', ev: 'target-160',
    why: ['厂房主流层高 8–12m，100–200W 为主力功率段', '150W × 160 lm/W = 24,000 lm 覆盖主流单灯位', '200W 档留给平台延展（Concept C）'] },
  { key: 'efficacy', param: 'EFFICACY', value: '160 lm/W', ev: 'prof-band',
    why: ['Professional 层定义为 130–160+ lm/W', '160 = 层内上沿，对 LAMPTAN 130 / BEC 135 形成可感知代差', 'EVE 现状 90 —— 跨层而非改良'] },
  { key: 'lumen', param: 'LUMEN', value: '24,000 lm', ev: 'target-160',
    why: ['= 150W × 160 lm/W，派生值不单独决策', '满足 8–12m 层高照度设计惯例'] },
  { key: 'pf', param: 'POWER FACTOR', value: '≥ 0.95', ev: 'eve-pf',
    why: ['工业电网与项目标普遍要求 PF ≥ 0.9', 'EVE 现状 0.5 —— 电气差距必须一次补齐', '≥0.95 留出测试裕量'] },
  { key: 'ip', param: 'INGRESS', value: 'IP65', ev: 'tisi',
    why: ['泰国高温高湿 + 粉尘厂房环境', '专业层准入底线'] },
  { key: 'beam', param: 'BEAM', value: '90°', ev: 'price-window',
    why: ['90° 覆盖厂房主流布灯间距', '60°/120° 作为配置项而非主卖点'] },
  { key: 'warranty', param: 'WARRANTY', value: '3–5 Y', ev: 'warranty-bench',
    why: ['Philips 5Y / BEC 3Y 建立了专业层信任基准', 'EVE 现状约 2Y，差距即信任差距'] },
  { key: 'retail', param: 'RETAIL', value: '฿1,890–2,190', ev: 'target-price',
    why: ['上沿贴住 LAMPTAN ฿2,190 可见锚点', '下沿与白牌 ฿1,2xx 拉开 ≥฿600 信任距离', '低于 BEC 同性能档 ฿2,450'] },
]

// ─── Concepts ───────────────────────────────────────────────────────────────

export type ConceptId = 'A' | 'B' | 'C'

export interface Concept {
  id: ConceptId; name: string; strategy: string; tagline: string
  traits: string[]; recommended?: boolean
}

export const CONCEPTS: Concept[] = [
  { id: 'A', name: 'CORE', strategy: '低风险 · 成熟结构 · 成本效率 · 易制造',
    tagline: 'The safe volume play.',
    traits: ['成熟平台复用', '最少新开模', '成本最优', '最快上市'] },
  { id: 'B', name: 'HERO', strategy: '性能 × 成本 × 设计 × 制造风险 × 延展性 最平衡', recommended: true,
    tagline: 'The next-gen主力 SKU.',
    traits: ['Radial-fin 散热', '160 lm/W 满血', '家族视觉锚点', '平台化基础'] },
  { id: 'C', name: 'FUTURE', strategy: '平台化：为未来衍生 SKU 做平台',
    tagline: 'Platform thinking.',
    traits: ['Sensor Ready', 'DALI / Smart Interface', 'Replaceable Optics', 'Modular Driver'] },
]

export const WHY_B_WINS = [
  { k: 'PERFORMANCE', v: '160 lm/W 满血达成 Professional 上沿，与 A 同平台验证' },
  { k: 'COST',        v: '比 C 少 4 组模块件，BOM 与装配成本落在 Scenario 内' },
  { k: 'DESIGN',      v: 'Radial fin + Optical Ring 建立可识别的家族语言' },
  { k: 'MFG RISK',    v: '热路径经 Engineering Intent 验证可行，新开模仅光学环' },
  { k: 'EXTENSIBILITY', v: 'Driver Cap 预留 Sensor/DALI 位 —— 通往 C 的桥' },
]

// ─── WHY DOES IT LOOK LIKE THIS — MARKET → REQUIREMENT → ENGINEERING → FORM ─

export interface Hotspot { id: string; label: string; x: number; y: number; chain: [string, string, string, string] }

// NOTE: y% calibrated for the LIT viewBox (400×472 — product + beam cone).
export const HOTSPOTS: Hotspot[] = [
  { id: 'heatsink', label: 'HEAT SINK', x: 50, y: 32,
    chain: ['市场要更高专业光效（130–160+ lm/W）', '必须降低长期结温，保证光效维持率', '更短热路径 + 更大有效散热面积', 'Radial Fin 放射鳍片结构'] },
  { id: 'driver', label: 'DRIVER', x: 50, y: 13,
    chain: ['项目与工业电网要求 PF ≥ 0.9', '高效率驱动 + 低 THD + 防雷击 SPD', '独立驱动腔，与光源腔热隔离', '顶部 Driver Cap 几何 —— 家族特征'] },
  { id: 'optics', label: 'OPTICS', x: 50, y: 59,
    chain: ['厂房主流布灯间距需要 90° 配光', '可替换光学件覆盖 60°/90°/120°', '透镜阵列 + 防眩环，UGR 控制', '底部 Optical Ring —— 家族视觉锚点'] },
  { id: 'housing', label: 'HOUSING', x: 84, y: 40,
    chain: ['高温高湿 + 粉尘厂房', 'IP65 全密封 + 防凝露呼吸阀', '压铸铝壳体 + 密封圈压缩量控制', '一体化碟形壳体'] },
  { id: 'mounting', label: 'MOUNTING', x: 50, y: 4,
    chain: ['工程安装效率决定人工成本', '单人可操作的吊装接口', '吊钩 + 安全绳双保险结构', 'Hook Interface —— 家族统一接口'] },
  { id: 'cable', label: 'CABLE ENTRY', x: 88, y: 22,
    chain: ['现场接线是漏水第一失效点', '防水格兰头 + 应力消除', '侧进线独立于密封腔', '侧向 Cable Gland'] },
  { id: 'identity', label: 'VISUAL IDENTITY', x: 16, y: 40,
    chain: ['白牌不可信的市场需要"可识别的专业"', '一眼可辨的家族化语言', 'Fin Rhythm / Edge Language / CMF 统一', '哑黑壳体 + 黄铜色光学环'] },
]

export const CHAIN_STAGES = ['MARKET', 'REQUIREMENT', 'ENGINEERING', 'FORM'] as const

// ─── Configurator & derived commercial model ────────────────────────────────

export interface Config { power: number; cct: number; beam: number; control: string; warranty: number }

export const CONFIG_OPTIONS = {
  power:   [100, 150, 200],
  cct:     [4000, 5000, 6500],
  beam:    [60, 90, 120],
  control: ['ON/OFF', '0-10V', 'DALI', 'Sensor Ready'],
  warranty: [3, 5],
}

export const DEFAULT_CONFIG: Config = { power: 150, cct: 5000, beam: 90, control: '0-10V', warranty: 5 }

export const RETAIL_BANDS: Record<number, [number, number]> = {
  100: [1490, 1690],
  150: [1890, 2190],
  200: [2590, 2890],
}

export const EFFICACY_TARGET = 160

export const lumenOf = (c: Config) => c.power * EFFICACY_TARGET

export interface CommercialScenario {
  retail: number
  retailMargin: number   // ฿
  distMargin: number     // ฿
  logistics: number      // ฿
  tax: number            // ฿
  controlDelta: number   // ฿ cost delta for control option
  targetCost: number     // ฿
  targetCostUSD: number
}

export interface ScenarioAdj { retailPoint: number | null; retailMarginPct: number; distMarginPct: number }

export const DEFAULT_ADJ: ScenarioAdj = { retailPoint: null, retailMarginPct: 30, distMarginPct: 18 }

export function scenarioOf(c: Config, adj: ScenarioAdj = DEFAULT_ADJ): CommercialScenario {
  const band = RETAIL_BANDS[c.power]
  const retail = adj.retailPoint ?? Math.round((band[0] + band[1]) / 2)
  const retailMargin = Math.round(retail * adj.retailMarginPct / 100)
  const afterRetail = retail - retailMargin
  const distMargin = Math.round(afterRetail * adj.distMarginPct / 100)
  const logistics = 95
  const tax = Math.round((afterRetail - distMargin) * 0.07)
  const controlDelta = c.control === 'DALI' ? 85 : c.control === 'Sensor Ready' ? 45 : c.control === '0-10V' ? 15 : 0
  const warrantyDelta = c.warranty === 5 ? 35 : 0
  const targetCost = afterRetail - distMargin - logistics - tax
  return {
    retail, retailMargin, distMargin, logistics, tax,
    controlDelta: controlDelta + warrantyDelta,
    targetCost, targetCostUSD: +(targetCost / 35).toFixed(1),
  }
}

export interface RiskFlag { id: string; text: string; level: 'warn' | 'block' }

export function risksOf(c: Config): RiskFlag[] {
  const r: RiskFlag[] = []
  if (c.power === 200) r.push({ id: 'thermal', level: 'warn', text: '200W @160 lm/W：温升裕量收紧，需散热验证（Engineering Gate）' })
  if (c.power === 100) r.push({ id: 'lumen', level: 'warn', text: '100W 档光通量 16,000 lm，定位偏向补充 SKU 而非主力' })
  if (c.control === 'DALI') r.push({ id: 'dali', level: 'warn', text: 'DALI 驱动成本 +฿85，且要求项目渠道能力 —— 建议归 Concept C' })
  if (c.beam === 120) r.push({ id: 'beam', level: 'warn', text: '120° 配光需要新光学件（NRE 模具投入）' })
  if (c.warranty === 3) r.push({ id: 'warranty', level: 'warn', text: '3Y 低于 TARGET 5Y —— 信任差异减弱（专业层基准 Philips 5Y）' })
  if (c.cct === 4000) r.push({ id: 'cct', level: 'warn', text: '4000K 光效约 −3 lm/W，Spec 标注需说明' })
  return r
}

export const bandOf = (c: Config): [number, number] => RETAIL_BANDS[c.power]

// ─── Engineering intent ─────────────────────────────────────────────────────

export const ENGINEERING_INTENTS = [
  { id: 'thermal',  t: 'Thermal Path',        d: '光源腔 → 放射鳍片短热路径；目标结温裕量 ≥ 15°C', hs: 'heatsink' },
  { id: 'driver',   t: 'Driver Architecture', d: '独立驱动腔热隔离；PF ≥ 0.95 / THD < 10% / SPD 4kV', hs: 'driver' },
  { id: 'optical',  t: 'Optical Architecture',d: '透镜阵列 60°/90°/120° 可替换；防眩环 UGR<25', hs: 'optics' },
  { id: 'ip',       t: 'IP Sealing',          d: 'IP65：密封圈压缩量 + 防凝露呼吸阀', hs: 'housing' },
  { id: 'cable',    t: 'Cable Entry',         d: '侧进线防水格兰头，独立于主密封腔', hs: 'cable' },
  { id: 'mount',    t: 'Mounting',            d: '吊钩 + 安全绳双保险，单人可安装', hs: 'mounting' },
  { id: 'service',  t: 'Serviceability',      d: '驱动腔可独立更换；光学环可拆换', hs: 'driver' },
]

// ─── Project gates ──────────────────────────────────────────────────────────

export interface Gate { id: string; name: string; owner: string; status: 'done' | 'active' | 'pending'; note?: string }

export const GATES: Gate[] = [
  { id: 'g1', name: 'Market Validation',     owner: 'TOSPO MI',   status: 'done',   note: 'Price×Perf / Spec / Channel 已建立' },
  { id: 'g2', name: 'Customer Validation',   owner: 'EVE + TOSPO', status: 'active', note: 'Gap Map 待 EVE 确认' },
  { id: 'g3', name: 'Cost Validation',       owner: 'TOSPO Cost', status: 'pending', note: '需 BOM 成本库（INTERNAL）' },
  { id: 'g4', name: 'Engineering Validation',owner: 'TOSPO ENG',  status: 'pending', note: '160 lm/W 热设计验证' },
  { id: 'g5', name: 'Certification',         owner: 'EVE (TISI)', status: 'pending', note: 'TISI 强制；EVE 本地持证' },
  { id: 'g6', name: 'Prototype',             owner: 'TOSPO ENG',  status: 'pending' },
  { id: 'g7', name: 'Sample',                owner: 'TOSPO',      status: 'pending' },
  { id: 'g8', name: 'Quotation',             owner: 'TOSPO Sales',status: 'pending' },
  { id: 'g9', name: 'Project Launch',        owner: 'Joint',      status: 'pending' },
]

// ─── Cockpit decisions ──────────────────────────────────────────────────────

export const RECENT_DECISIONS = [
  { ok: true as const, what: 'TARGET 160 lm/W', because: 'prof-band' },
  { ok: true as const, what: 'TARGET ฿1,890–2,190', because: 'price-window' },
  { ok: false as const, what: 'Warranty 5Y', because: '待 Commercial 场景验证' },
]

// ─── PK BENCH — 易车式品牌对决 ──────────────────────────────────────────────
// Ours column is computed from the LIVE config (ONE STATE): change 150W→200W
// or 5Y→3Y in the configurator and the PK table changes with it — including
// honest losses (e.g. Philips wins warranty if you cut ours to 3Y).

export interface PKCompetitor {
  id: string; name: string; brand: Brand
  priceMid: number
  efficacy: number | string   // string when claimed/unverified
  lumen: number | string
  pf: number
  ip: string; ipRank: number
  warrantyY: number
  tisi: '✓' | '✗' | '◐'
  trust: 0 | 2 | 3            // 0 标称存疑 · 2 官方标称 · 3 实测背书
  claimed?: boolean
  ev: string
}

export const PK_COMPETITORS: PKCompetitor[] = [
  { id: 'bec', name: 'BEC BHB-150', brand: 'BEC', priceMid: 2450, efficacy: 135, lumen: 20250, pf: 0.9, ip: 'IP65', ipRank: 3, warrantyY: 3, tisi: '✓', trust: 2, ev: 'bec-pos' },
  { id: 'lam', name: 'LAMPTAN HB-PRO', brand: 'LAMPTAN', priceMid: 2190, efficacy: 130, lumen: 19500, pf: 0.9, ip: 'IP65', ipRank: 3, warrantyY: 3, tisi: '✓', trust: 2, ev: 'lamptan-pos' },
  { id: 'phi', name: 'Philips GP 150', brand: 'Philips', priceMid: 3900, efficacy: 140, lumen: 21000, pf: 0.95, ip: 'IP65', ipRank: 3, warrantyY: 5, tisi: '✓', trust: 2, ev: 'philips-pos' },
  { id: 'wl', name: '白牌 "150W"', brand: 'White-label', priceMid: 1250, efficacy: '"160"', lumen: '"24,000"', pf: 0.5, ip: 'IP54?', ipRank: 2, warrantyY: 1, tisi: '✗', trust: 0, claimed: true, ev: 'whitelabel-claims' },
]

export interface PKColumn {
  id: string; name: string; ours?: boolean; claimed?: boolean; ev: string
  cells: Record<string, { disp: string; num: number }>
}

export interface PKRowDef { key: string; label: string; better: 'high' | 'low'; ev: string }

export const PK_ROWS: PKRowDef[] = [
  { key: 'price', label: '参考价', better: 'low', ev: 'price-window' },
  { key: 'pklm', label: '每千流明价', better: 'low', ev: 'price-window' },
  { key: 'efficacy', label: '光效 lm/W', better: 'high', ev: 'prof-band' },
  { key: 'pf', label: '功率因数', better: 'high', ev: 'eve-pf' },
  { key: 'warranty', label: '质保', better: 'high', ev: 'warranty-bench' },
  { key: 'ip', label: '防护等级', better: 'high', ev: 'tisi' },
  { key: 'trust', label: '标称可信度', better: 'high', ev: 'lab-proof' },
  { key: 'tisi', label: 'TISI 认证', better: 'high', ev: 'tisi' },
]

function cellsOf(c: PKCompetitor): Record<string, { disp: string; num: number }> {
  const lumenNum = typeof c.lumen === 'number' ? c.lumen : 24000
  return {
    price: { disp: fmtTHB(c.priceMid), num: c.priceMid },
    pklm: { disp: `฿${Math.round(c.priceMid / (lumenNum / 1000))}`, num: c.priceMid / (lumenNum / 1000) },
    efficacy: { disp: `${c.efficacy}`, num: typeof c.efficacy === 'number' ? c.efficacy : 112 },
    pf: { disp: `PF ${c.pf}`, num: c.pf },
    warranty: { disp: `${c.warrantyY}Y`, num: c.warrantyY },
    ip: { disp: c.ip, num: c.ipRank },
    trust: { disp: c.trust === 3 ? '实测背书' : c.trust === 2 ? '官方标称' : '标称存疑', num: c.trust },
    tisi: { disp: c.tisi === '◐' ? '◐ 办理中' : c.tisi, num: c.tisi === '✓' ? 2 : c.tisi === '◐' ? 1 : 0 },
  }
}

/** Ours — built from live config + scenario */
export function ourPKColumn(config: Config, scenario: CommercialScenario): PKColumn {
  const lumen = config.power * EFFICACY_TARGET
  const band = bandOf(config)
  const cells: Record<string, { disp: string; num: number }> = {
    price: { disp: `${fmtTHB(band[0])}–${fmtTHB(band[1]).slice(1)}`, num: scenario.retail },
    pklm: { disp: `฿${Math.round(scenario.retail / (lumen / 1000))}`, num: scenario.retail / (lumen / 1000) },
    efficacy: { disp: `${EFFICACY_TARGET}`, num: EFFICACY_TARGET },
    pf: { disp: 'PF ≥0.95', num: 0.95 },
    warranty: { disp: `${config.warranty}Y`, num: config.warranty },
    ip: { disp: 'IP65', num: 3 },
    trust: { disp: '实测背书', num: 3 },
    tisi: { disp: '◐ EVE 主体办理', num: 1 },
  }
  return { id: 'ours', name: `EVE NEXT ${config.power}W`, ours: true, ev: 'target-160', cells }
}

export function compPKColumn(c: PKCompetitor): PKColumn {
  return { id: c.id, name: c.name, claimed: c.claimed, ev: c.ev, cells: cellsOf(c) }
}

/** winners per row: set of column ids; claimed columns can never win */
export function pkWinners(cols: PKColumn[]): Record<string, Set<string>> {
  const out: Record<string, Set<string>> = {}
  for (const row of PK_ROWS) {
    const eligible = cols.filter((c) => !c.claimed)
    const vals = eligible.map((c) => c.cells[row.key].num)
    const best = row.better === 'high' ? Math.max(...vals) : Math.min(...vals)
    out[row.key] = new Set(eligible.filter((c) => c.cells[row.key].num === best).map((c) => c.id))
  }
  return out
}

/** verdict counts from OURS perspective */
export function pkVerdict(cols: PKColumn[]): { win: number; tie: number; lose: number } {
  const w = pkWinners(cols)
  let win = 0, tie = 0, lose = 0
  for (const row of PK_ROWS) {
    const winners = w[row.key]
    if (!winners.has('ours')) lose++
    else if (winners.size === 1) win++
    else tie++
  }
  return { win, tie, lose }
}

// ─── THE ANSWER: 1–3 recommended products ───────────────────────────────────
// One family, three roles. Restraint is the judgment: we also list what we
// recommend NOT doing.

export interface ProductRec {
  id: 'core100' | 'hero150' | 'future200'
  concept: ConceptId
  name: string
  role: string
  roleEn: string
  positioning: string
  config: Config
  whyThis: string[]
  evs: string[]
}

export const PRODUCTS: ProductRec[] = [
  {
    id: 'hero150', concept: 'B', name: 'EVE NEXT HIGHBAY 150',
    role: '主力利润款', roleEn: 'HERO SKU',
    positioning: '正面占据主流专业层空位的主力 SKU',
    config: { power: 150, cct: 5000, beam: 90, control: '0-10V', warranty: 5 },
    whyThis: ['฿1,890–2,190 × 160 lm/W 窗口内唯一可信玩家', '性能×成本×制造风险×延展性最平衡', 'EVE 现有客群升级的自然落点'],
    evs: ['price-window', 'target-160', 'eve-assets'],
  },
  {
    id: 'core100', concept: 'A', name: 'EVE NEXT HIGHBAY 100',
    role: '走量入门款', roleEn: 'VOLUME SKU',
    positioning: '用现有电商客群低门槛进入专业层',
    config: { power: 100, cct: 5000, beam: 90, control: 'ON/OFF', warranty: 3 },
    whyThis: ['成熟平台复用，最快上市', '฿1,490–1,690 衔接 EVE 现有价格带', '为 HERO 款引流与攒评价'],
    evs: ['eve-efficacy', 'price-window'],
  },
  {
    id: 'future200', concept: 'C', name: 'EVE NEXT HIGHBAY 200 DALI',
    role: '项目平台款', roleEn: 'PLATFORM SKU',
    positioning: 'Sensor/DALI Ready，为衍生 SKU 做平台',
    config: { power: 200, cct: 5000, beam: 90, control: 'DALI', warranty: 5 },
    whyThis: ['项目渠道与智能楼宇标案的门票', 'Modular Driver + Replaceable Optics', 'HERO 验证热平台后再放量'],
    evs: ['prof-band', 'order-flow'],
  },
]

/* Lab teardown culture — claimed vs measured (demonstration data) */
export const LAB_TESTS = [
  { sku: 'WL "100W" 投光灯', claimed: '100W · 20,000 lm', measured: '实测 28W · ≈3,100 lm' },
  { sku: 'WL "150W" Highbay', claimed: '160 lm/W', measured: '实测 ≈112 lm/W' },
  { sku: 'WL "200W" 路灯', claimed: '200W', measured: '实测 76W' },
]

/* What we recommend NOT doing — PM judgment is also what you cut */
export const KILLS: { what: string; why: string }[] = [
  { what: '太阳能感应壁灯（฿100–200）', why: '红海价格战，无差异化证据支撑 —— 不做。' },
  { what: '一体化太阳能路灯', why: '项目渠道与 EVE 主力错位 —— 先验证渠道，再议。' },
]

// ─── Story acts v2 — ANSWER → PROOF → TRUST → DECIDE ───────────────────────

export type ActKind =
  | 'answer' | 'whynow' | 'window' | 'fit' | 'hero' | 'pk'
  | 'form' | 'proof' | 'math' | 'derisk' | 'next'

export interface Act { n: number; kind: ActKind; dark: boolean; kicker: string; title: string; body?: string; ev?: string }

export const ACTS: Act[] = [
  { n: 1, kind: 'answer',  dark: true,  kicker: 'THE ANSWER',      title: 'EVE 的下一代，我们已经替你想好了' },
  { n: 2, kind: 'whynow',  dark: false, kicker: 'WHY NOW',         title: '品类在升级，你不在场', body: '每一个项目季，专业层订单都在流向有 130+ lm/W 产品线的品牌。', ev: 'order-flow' },
  { n: 3, kind: 'window',  dark: false, kicker: 'THE WINDOW',      title: '฿1,890–2,190 × 160 lm/W 是空位', body: '白牌有价格无可信性能，Philips 有性能但价格翻倍。这个窗口不会一直开着。', ev: 'price-window' },
  { n: 4, kind: 'fit',     dark: false, kicker: 'WHY EVE',         title: '门票你已经拿在手里', ev: 'eve-assets' },
  { n: 5, kind: 'hero',    dark: false, kicker: 'THE HERO',        title: '150W —— 主力利润款', ev: 'target-160' },
  { n: 6, kind: 'pk',      dark: false, kicker: 'HEAD-TO-HEAD',    title: '同档对决，胜负摆在桌面', ev: 'lab-proof' },
  { n: 7, kind: 'form',    dark: true,  kicker: 'WHY THIS FORM',   title: '形态来自工程，工程来自市场' },
  { n: 8, kind: 'proof',   dark: true,  kicker: 'THE PROOF',       title: '我们测过，不是听说', ev: 'lab-proof' },
  { n: 9, kind: 'math',    dark: false, kicker: 'THE MATH',        title: '账算给你看', body: '零售 → 渠道毛利 → 目标采购成本。Scenario，不是报价。' },
  { n: 10, kind: 'derisk', dark: false, kicker: 'DE-RISK',         title: '哪里可能错，怎么验证' },
  { n: 11, kind: 'next',   dark: false, kicker: 'NEXT STEP',       title: '选一款，4 周出样' },
]

// ─── Misc ───────────────────────────────────────────────────────────────────

export const PROJECT = {
  customer: 'EVE Lighting',
  market: 'Thailand',
  category: 'Highbay',
  title: 'NEXT GEN HIGHBAY',
  stage: 'Product Definition',
  owner: 'TOSPO PM',
}

export const fmtTHB = (n: number) => `฿${n.toLocaleString('en-US')}`

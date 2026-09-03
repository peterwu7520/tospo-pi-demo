// Desktop screens — EVIDENCE & DECISION phases (analysis register, warm paper).
import {
  BRAND_META, OPPORTUNITY_SCORE, OPPORTUNITY_WINDOW,
  SKUS, TARGET_SPECS, fmtTHB,
} from '../data/project'
import { useStore } from '../state/store'
import { Ev, EvLegend, EvPill, SecHead, WhyBtn, WhyChain } from '../components/primitives'
import { ChannelMatrix, DimBars, EvTypeNote, GapMap, MapLegend, PresenceBars, PricePerfMap, SpecLandscape } from '../components/charts'
import type { ScreenId } from './DesktopApp'

function NextStep({ to, label, go }: { to: ScreenId; label: string; go: (s: ScreenId) => void }) {
  return (
    <div className="mt-12 flex items-center justify-between hairline-t" style={{ paddingTop: 20 }}>
      <span className="micro">工作流下一步</span>
      <button className="btn-ink" onClick={() => go(to)}>{label} →</button>
    </div>
  )
}

/* ─────────────────────────── 01 MARKET ─────────────────────────── */
export function Market({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>02 · 为什么是这个方向</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>市场现在是什么结构？</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 28px', maxWidth: 560 }}>
        不是"市场规模多大" —— 而是谁在哪里、价格与性能如何分布、货架被谁占着。
        图上每一个点都可以点到证据。
      </p>

      <SecHead n="01.1" title="价格 × 性能地图" right={<EvPill t="CONFIRMED" />} />
      <PricePerfMap />
      <div className="flex items-center justify-between" style={{ margin: '10px 0 34px' }}>
        <MapLegend />
        <EvTypeNote />
      </div>
      <p style={{ fontSize: 13.5, maxWidth: 640, lineHeight: 1.7 }}>
        蓝色虚线框 = <Ev id="price-window">机会窗口</Ev>：
        白牌有价格无可信性能（虚线空心 = 标称未验证），Philips 有性能但价格翻倍。
        主流专业带 140–165 lm/W × ฿1,800–2,300 缺少可信玩家。
      </p>

      <SecHead n="01.2" title="规格全景 — 什么是主流 / 专业 / 高端" />
      <SpecLandscape />
      <p style={{ fontSize: 13.5, color: 'var(--graphite)', margin: '10px 0 34px' }}>
        专业层 = <Ev id="prof-band">130–160+ lm/W</Ev> —— 这是后面目标选 160 的唯一原因。
      </p>

      <SecHead n="01.3" title="渠道全景 — 不同品牌在哪里竞争" right={<EvPill t="PROXY" />} />
      <ChannelMatrix />

      <div className="hairline-t" style={{ marginTop: 36, paddingTop: 16 }}>
        <EvLegend />
      </div>
      <NextStep to="customer" label="市场有空位 → EVE 适合吗" go={go} />
    </div>
  )
}

/* ─────────────────────────── 02 CUSTOMER ────────────────────────── */
export function Customer({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>03 · 为什么是这个方向</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>EVE 现在在哪里？</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 28px', maxWidth: 560 }}>
        市场最火的产品 ≠ EVE 最适合做的产品。Market Opportunity × Customer Gap × Customer Fit = Product Opportunity。
      </p>

      <SecHead n="02.1" title="客户差距地图" right={<EvPill t="INFERENCE" />} />
      <GapMap />

      <SecHead n="02.2" title="读法" />
      <div className="grid grid-cols-3 gap-6" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
        <div>
          <div className="micro" style={{ color: 'var(--risk)', marginBottom: 4 }}>⚑ 差距</div>
          光效 / PF / 质保 —— 三个维度同时落后一个层级。这不是产品线更新问题，是层级跨越问题。
        </div>
        <div>
          <div className="micro" style={{ color: 'var(--brass)', marginBottom: 4 }}>上探空间</div>
          价格带上探空间真实存在：EVE 当前 ฿1,290–1,690，窗口 ฿1,890–2,190 不与其自相残杀。
        </div>
        <div>
          <div className="micro" style={{ marginBottom: 4 }}>匹配</div>
          电商强但工矿灯是工程生意 —— 渠道策略必须项目 + 分销双轨。
        </div>
      </div>

      <NextStep to="competition" label="差距即机会 → 谁会来抢" go={go} />
    </div>
  )
}

/* ─────────────────────────── 03 COMPETITION ─────────────────────── */
export function Competition({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>04 · 为什么是这个方向</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>谁在什么位置？</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 28px', maxWidth: 560 }}>
        每个品牌占有一个货架。找不到真实市场份额数据 —— 所以画存在度指数，不画份额饼图。
      </p>

      <SecHead n="03.1" title="玩家 — 每个品牌的货架声明" />
      {(Object.keys(BRAND_META) as (keyof typeof BRAND_META)[]).map((b) => {
        const sku = SKUS.filter((s) => s.brand === b)[0]
        return (
          <div key={b} className="flex items-baseline gap-4" style={{ borderTop: '1px solid var(--hairline-soft)', padding: '10px 0' }}>
            <span className="evdot" style={{ background: BRAND_META[b].color }} />
            <span style={{ width: 110, fontWeight: 600 }}>{b}</span>
            <span style={{ flex: 1, color: 'var(--graphite)', fontSize: 13.5 }}>{BRAND_META[b].shelf}</span>
            {sku && <Ev id={sku.ev}><span className="num" style={{ fontSize: 12.5 }}>{sku.efficacy} lm/W · {fmtTHB(sku.price)}</span></Ev>}
          </div>
        )
      })}

      <div style={{ marginTop: 34 }}>
        <SecHead n="03.2" title="市场存在指数" right={<EvPill t="PROXY" />} />
        <PresenceBars />
      </div>

      <p style={{ fontSize: 13.5, maxWidth: 640, lineHeight: 1.7, marginTop: 30 }}>
        <strong style={{ fontWeight: 600 }}>结论（分析结论）：</strong>
        Philips 占高端、白牌占低价、BEC/LAMPTAN 占专业层价格锚点 ——
        <Ev id="price-window">主流专业层"可信但可及"的位置是空的</Ev>。
      </p>

      <NextStep to="opportunity" label="位置成立 → 这个机会值多少分" go={go} />
    </div>
  )
}

/* ─────────────────────────── 04 OPPORTUNITY ─────────────────────── */
export function Opportunity({ go }: { go: (s: ScreenId) => void }) {
  const { openEvidence } = useStore()
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>05 · 为什么是这个方向</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>为什么是这个机会？</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 26px', maxWidth: 560 }}>
        评分不是黑盒。82 分由九个维度合成，每一维都可以展开到证据；缺内部数据的维度直接标示。
      </p>

      <div className="flex items-end gap-8" style={{ marginBottom: 26 }}>
        <div>
          <div className="disp num" style={{ fontSize: 84, lineHeight: 0.95, fontWeight: 700 }}>{OPPORTUNITY_SCORE}</div>
          <div className="micro" style={{ marginTop: 6 }}>/ 100 · 加权合成 <EvPill t="INFERENCE" /></div>
        </div>
        <WhyBtn label="为什么 82 分？▾" onClick={() => openEvidence('score-82')} />
      </div>

      <SecHead n="04.1" title="九个维度 — 点击展开证据" />
      <DimBars />

      <div style={{ marginTop: 36 }}>
        <SecHead n="04.2" title="机会窗口 — 五元组" />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--hairline)' }}>
          {OPPORTUNITY_WINDOW.map((w, i) => (
            <button key={w.k} onClick={() => openEvidence(w.ev)}
              style={{ background: i === 1 ? 'var(--brass-soft)' : 'none', border: 'none', borderLeft: i ? '1px solid var(--hairline)' : 'none', padding: '14px 12px', cursor: 'pointer', textAlign: 'left' }}>
              <div className="micro" style={{ marginBottom: 6, color: i === 1 ? 'var(--brass)' : 'var(--graphite)' }}>{w.k}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.55, fontWeight: 500 }}>{w.v}</div>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--graphite)', marginTop: 12 }}>
          这才是产品机会窗口：价格 × 规格 × 设计 × 渠道 × 定位 —— 不是一句"这个价格可以进入"。
        </p>
      </div>

      <NextStep to="strategy" label="机会成立 → 应该做成什么" go={go} />
    </div>
  )
}

/* ─────────────────────────── 05 STRATEGY ────────────────────────── */
export function Strategy({ go }: { go: (s: ScreenId) => void }) {
  const { openEvidence } = useStore()
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>06 · THE PRODUCTS</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>目标产品定义</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 26px', maxWidth: 560 }}>
        这些参数不是突然出现的。每一行背后都有一条 "市场发现 → 参数决策" 的链。
      </p>

      <SecHead n="05.1" title="目标规格 — 每行可问为什么" right={<EvPill t="TARGET" />} />
      <div>
        {TARGET_SPECS.map((s) => (
          <SpecRowD key={s.key} param={s.param} value={s.value} ev={s.ev} why={s.why} onWhy={() => openEvidence(s.ev)} />
        ))}
      </div>

      <div className="mt-8" style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 640 }}>
        <strong style={{ fontWeight: 600 }}>渠道与定位：</strong>
        <Ev id="channel-fit">项目 + 分销</Ev> · <Ev id="price-window">主流专业层</Ev>
      </div>

      <NextStep to="studio" label="参数定了 → 它应该长什么样" go={go} />
    </div>
  )
}

function SpecRowD({ param, value, why, onWhy }: { param: string; value: string; ev: string; why: string[]; onWhy: () => void }) {
  return (
    <details style={{ borderTop: '1px solid var(--hairline-soft)' }}>
      <summary style={{ listStyle: 'none', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 16, padding: '12px 0' }}>
        <span className="micro" style={{ width: 120, flex: 'none' }}>{param}</span>
        <span className="disp num" style={{ fontSize: 20, fontWeight: 500, flex: 1 }}>{value}</span>
        <WhyBtn onClick={onWhy} />
      </summary>
      <div style={{ padding: '2px 0 16px 136px' }}>
        {why.map((w, i) => (
          <div key={i} className="flex gap-2" style={{ fontSize: 13, color: 'var(--graphite)', lineHeight: 1.7 }}>
            <span style={{ color: 'var(--brass)' }}>{i === 0 ? '∵' : '·'}</span>{w}
          </div>
        ))}
      </div>
    </details>
  )
}

export { GapMap, WhyChain }

// Hand-rolled SVG charts — documentary register, tabular numerals, no chart-junk.
// Every mark that represents a fact is clickable into its evidence dossier.
import { useState } from 'react'
import {
  BRAND_META, GAP_ROWS, OPPORTUNITY_ZONE, SCORE_DIMS, SKUS, fmtTHB,
} from '../data/project'
import { useStore } from '../state/store'
import { EvPill } from './primitives'

const tickStyle = { fontFamily: 'var(--font-mono)', fontSize: 9.5, fill: 'var(--graphite)', letterSpacing: '0.06em' } as const

/* ── PRICE × PERFORMANCE MAP ─────────────────────────────────── */
export function PricePerfMap({ compact = false }: { compact?: boolean }) {
  const { openEvidence } = useStore()
  const [hover, setHover] = useState<string | null>(null)
  const W = compact ? 340 : 660
  const H = compact ? 300 : 380
  const m = { l: 44, r: 14, t: 18, b: 34 }
  const x = (p: number) => m.l + ((p - 500) / 4500) * (W - m.l - m.r)
  const y = (e: number) => H - m.b - ((e - 60) / 120) * (H - m.t - m.b)
  const z = OPPORTUNITY_ZONE

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* gridlines */}
      {[800, 1600, 2400, 3200, 4000, 4800].map((p) => (
        <g key={p}>
          <line x1={x(p)} y1={m.t} x2={x(p)} y2={H - m.b} stroke="var(--hairline-soft)" strokeWidth="1" />
          <text x={x(p)} y={H - m.b + 14} textAnchor="middle" style={tickStyle}>{p === 800 ? '฿800' : `${p / 1000}k`}</text>
        </g>
      ))}
      {[90, 110, 130, 160].map((e) => (
        <g key={e}>
          <line x1={m.l} y1={y(e)} x2={W - m.r} y2={y(e)} stroke="var(--hairline-soft)" strokeWidth="1" />
          <text x={m.l - 6} y={y(e) + 3} textAnchor="end" style={tickStyle}>{e}</text>
        </g>
      ))}
      <text x={m.l - 6} y={m.t - 6} textAnchor="end" style={{ ...tickStyle, fill: 'var(--ink)' }}>lm/W</text>

      {/* OPPORTUNITY ZONE */}
      <rect
        x={x(z.priceMin)} y={y(z.effMax)}
        width={x(z.priceMax) - x(z.priceMin)} height={y(z.effMin) - y(z.effMax)}
        fill="var(--brass-soft)" stroke="var(--brass)" strokeWidth="1.4" strokeDasharray="5 4"
      />
      <text x={x(z.priceMin) + 6} y={y(z.effMin) - 7} style={{ ...tickStyle, fill: 'var(--brass)', fontSize: 10, fontWeight: 500 }}>
        机会窗口
      </text>

      {/* TARGET marker */}
      <circle cx={x(2040)} cy={y(160)} r={compact ? 7 : 9} fill="none" stroke="var(--brass)" strokeWidth="2" />
      <circle cx={x(2040)} cy={y(160)} r="2.4" fill="var(--brass)" />
      {!compact && (
        <text x={x(2040)} y={y(165)} textAnchor="middle" style={{ ...tickStyle, fill: 'var(--brass)', fontWeight: 500 }}>目标 150W</text>
      )}

      {/* SKU bubbles */}
      {SKUS.map((s) => {
        const c = BRAND_META[s.brand].color
        const r = s.power === 100 ? 6.5 : s.power === 150 ? 8.5 : 10.5
        const isH = hover === s.id
        return (
          <g key={s.id}
            onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}
            onClick={() => openEvidence(s.ev)} style={{ cursor: 'pointer' }}
            opacity={hover && !isH ? 0.35 : 1}>
            <circle cx={x(s.price)} cy={y(s.efficacy)} r={r + 5} fill="transparent" />
            <circle cx={x(s.price)} cy={y(s.efficacy)} r={r}
              fill={s.claimed ? 'none' : c} stroke={c}
              strokeWidth={s.claimed ? 1.4 : 0} strokeDasharray={s.claimed ? '3 2' : undefined}
              opacity={s.claimed ? 0.8 : 0.92} />
            {(isH || !compact) && (
              <text x={x(s.price)} y={y(s.efficacy) - r - 4} textAnchor="middle"
                style={{ ...tickStyle, fill: isH ? 'var(--ink)' : 'var(--graphite)', fontWeight: isH ? 500 : 400 }}>
                {s.brand}
              </text>
            )}
            {isH && (
              <text x={x(s.price)} y={y(s.efficacy) + r + 13} textAnchor="middle" style={{ ...tickStyle, fill: 'var(--ink)' }}>
                {s.model} · {fmtTHB(s.price)}
              </text>
            )}
          </g>
        )
      })}

      {/* professional band hint */}
      <line x1={m.l} y1={y(130)} x2={W - m.r} y2={y(130)} stroke="var(--graphite)" strokeWidth="1" strokeDasharray="2 4" />
    </svg>
  )
}

/* ── SPEC LANDSCAPE ──────────────────────────────────────────── */
export function SpecLandscape() {
  const { openEvidence } = useStore()
  return (
    <div>
      {[
        { tier: '价值 / 主流层', eff: '90–110 lm/W', note: '白牌与电商款主战场 · PF 0.5–0.7', w: 100, ev: 'eve-efficacy' },
        { tier: '专业层', eff: '130–160+ lm/W', note: '工程与分销渠道要求 · PF ≥ 0.9', w: 58, ev: 'prof-band' },
        { tier: '高端层', eff: '160+ lm/W + 智能', note: 'DALI / 传感 / 平台化 · 项目标', w: 30, ev: 'philips-pos' },
      ].map((t, i) => (
        <button key={t.tier} onClick={() => openEvidence(t.ev)}
          className="flex w-full items-baseline gap-4 text-left"
          style={{ background: 'none', border: 'none', borderTop: i ? '1px solid var(--hairline-soft)' : 'none', padding: '10px 0', cursor: 'pointer' }}>
          <span className="micro" style={{ width: 150, flex: 'none' }}>{t.tier}</span>
          <span style={{ width: `${t.w}%`, maxWidth: 220, borderTop: '3px solid var(--ink)', transform: 'translateY(3px)', opacity: 0.85 - i * 0.28, flex: 'none' }} />
          <span className="num disp" style={{ fontWeight: 500, flex: 'none' }}>{t.eff}</span>
          <span style={{ color: 'var(--graphite)', fontSize: 12 }}>{t.note}</span>
        </button>
      ))}
    </div>
  )
}

/* ── CHANNEL LANDSCAPE — Brand × Channel presence ────────────── */
export function ChannelMatrix() {
  const channels = ['Shopee', 'Lazada', 'HomePro', 'Project']
  const rows: { b: keyof typeof BRAND_META; cells: (0 | 1 | 2)[]; price: string }[] = [
    { b: 'EVE', cells: [2, 2, 1, 0], price: '฿1,290–1,690' },
    { b: 'BEC', cells: [1, 1, 2, 2], price: '฿1,850–2,450' },
    { b: 'LAMPTAN', cells: [2, 1, 2, 1], price: '฿1,190–2,190' },
    { b: 'Philips', cells: [1, 1, 2, 2], price: '฿3,500–4,600' },
    { b: 'RACER', cells: [1, 0, 1, 2], price: '฿2,650+' },
    { b: 'White-label', cells: [2, 2, 0, 0], price: '฿890–1,690' },
  ]
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 420 }}>
        <thead>
          <tr>
            {['品牌', ...channels.map((c) => c.toUpperCase()), '价格带'].map((h) => (
              <th key={h} className="micro" style={{ textAlign: h === '品牌' ? 'left' : 'center', padding: '6px 10px', borderBottom: '1px solid var(--hairline)', fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.b}>
              <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline-soft)' }}>
                <span className="evdot" style={{ background: BRAND_META[r.b].color, marginRight: 8 }} />
                <span style={{ fontWeight: 500 }}>{r.b}</span>
              </td>
              {r.cells.map((c, i) => (
                <td key={i} style={{ textAlign: 'center', padding: '8px 10px', borderBottom: '1px solid var(--hairline-soft)' }}>
                  {c === 2 && <span className="evdot" style={{ background: 'var(--ink)' }} />}
                  {c === 1 && <span className="evdot" style={{ background: 'none', border: '1.5px solid var(--graphite)' }} />}
                  {c === 0 && <span style={{ color: 'var(--hairline)' }}>—</span>}
                </td>
              ))}
              <td className="num" style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline-soft)', fontSize: 12.5, textAlign: 'center' }}>{r.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="proto-note" style={{ marginTop: 10 }}>● 主力渠道 ◐ 有存在 — 无销量数据 · 观察指标，非市场份额</div>
    </div>
  )
}

/* ── MARKET PRESENCE INDEX (proxy, not share) ────────────────── */
export function PresenceBars() {
  const data = [
    { b: 'White-label', v: 71 }, { b: 'EVE', v: 62 }, { b: 'BEC', v: 48 },
    { b: 'LAMPTAN', v: 44 }, { b: 'Philips', v: 38 }, { b: 'RACER', v: 18 },
  ] as const
  return (
    <div>
      {data.map((d) => (
        <div key={d.b} className="flex items-center gap-3" style={{ padding: '5px 0' }}>
          <span className="micro" style={{ width: 88, flex: 'none', textAlign: 'right' }}>{d.b}</span>
          <div style={{ flex: 1, height: 10, background: 'var(--hairline-soft)' }}>
            <div style={{ width: `${d.v}%`, height: '100%', background: BRAND_META[d.b].color }} />
          </div>
          <span className="num mono" style={{ fontSize: 11, width: 24 }}>{d.v}</span>
        </div>
      ))}
      <div className="proto-note" style={{ marginTop: 12, lineHeight: 1.7 }}>
        市场存在指数 — 渠道覆盖 × SKU 数 × 电商存在 × 搜索可见度 × 价格覆盖。
        这不是市场份额，只是存在度观察指标。
      </div>
    </div>
  )
}

/* ── CUSTOMER GAP MAP (dumbbell) ─────────────────────────────── */
export function GapMap({ animate = false }: { animate?: boolean }) {
  const { openEvidence } = useStore()
  return (
    <div>
      <div className="flex items-baseline justify-between pb-2">
        <span className="micro">● EVE 现状</span>
        <span className="micro">○ 专业层基准</span>
      </div>
      {GAP_ROWS.map((g) => {
        const l = (g.eve / g.max) * 100
        const r = (g.bench / g.max) * 100
        return (
          <button key={g.dim} onClick={() => openEvidence(g.ev)}
            style={{ display: 'block', width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--hairline-soft)', padding: '12px 0', cursor: 'pointer', textAlign: 'left' }}>
            <div className="flex items-baseline justify-between" style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 500, fontSize: 13.5 }}>{g.dim} <span className="micro" style={{ marginLeft: 6 }}>{g.unit}</span></span>
              <span className="micro" style={{ color: g.gapType === 'GAP' ? 'var(--risk)' : g.gapType === 'HEADROOM' ? 'var(--brass)' : 'var(--graphite)' }}>
                {g.gapType === 'GAP' && '⚑ '}{g.gap}
              </span>
            </div>
            <div style={{ position: 'relative', height: 16 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 7, height: 2, background: 'var(--hairline-soft)' }} />
              <div className={animate ? 'grow-x' : undefined}
                style={{ position: 'absolute', left: `${Math.min(l, r)}%`, width: `${Math.abs(r - l)}%`, top: 7, height: 2, background: g.gapType === 'GAP' ? 'var(--risk)' : 'var(--brass)', opacity: 0.65 }} />
              <span className="evdot" style={{ position: 'absolute', left: `${l}%`, top: 4, background: 'var(--ink)', transform: 'translateX(-50%)' }} />
              <span className="evdot" data-t="TARGET" style={{ position: 'absolute', left: `${r}%`, top: 4, color: 'var(--ink)', transform: 'translateX(-50%)' }} />
              <span className="num mono" style={{ position: 'absolute', left: `${l}%`, top: 12, fontSize: 10, transform: 'translateX(-50%)', color: 'var(--graphite)' }}>{g.eveLabel}</span>
              <span className="num mono" style={{ position: 'absolute', left: `${r}%`, bottom: 10, fontSize: 10, transform: 'translateX(-50%)', color: 'var(--ink)' }}>{g.benchLabel}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ── WHY 82? dimension bars ──────────────────────────────────── */
export function DimBars() {
  const { openEvidence } = useStore()
  return (
    <div>
      {SCORE_DIMS.map((d) => (
        <button key={d.dim} onClick={() => openEvidence(d.evs[0])}
          style={{ display: 'block', width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--hairline-soft)', padding: '9px 0', cursor: 'pointer', textAlign: 'left' }}>
          <div className="flex items-baseline gap-3">
            <span style={{ width: 168, flex: 'none', fontSize: 13 }}>{d.dim}</span>
            <div style={{ flex: 1, height: 8, background: 'var(--hairline-soft)', position: 'relative' }}>
              {d.score !== null
                ? <div style={{ width: `${d.score * 10}%`, height: '100%', background: 'var(--ink)' }} />
                : <div style={{ width: '100%', height: '100%', border: '1px dashed var(--ev-internal)', boxSizing: 'border-box', background: 'none' }} />}
            </div>
            <span className="num mono" style={{ width: 34, textAlign: 'right', fontSize: 12 }}>
              {d.score !== null ? d.score.toFixed(1) : '—'}
            </span>
          </div>
          {d.score === null && (
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ev-internal)', marginTop: 5, marginLeft: 180 }}>
              需内部数据
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

/* ── COMMERCIAL WATERFALL ────────────────────────────────────── */
export function Waterfall() {
  const { scenario } = useStore()
  const steps = [
    { label: '零售价', v: scenario.retail, kind: 'abs' as const },
    { label: '零售毛利', v: -scenario.retailMargin, kind: 'delta' as const },
    { label: '分销毛利', v: -scenario.distMargin, kind: 'delta' as const },
    { label: '物流+税', v: -(scenario.logistics + scenario.tax), kind: 'delta' as const },
    { label: '目标成本', v: scenario.targetCost, kind: 'abs' as const },
  ]
  const max = scenario.retail * 1.08
  const H = 190
  let acc = 0
  const bars = steps.map((s) => {
    const from = s.kind === 'abs' ? 0 : acc
    const to = s.kind === 'abs' ? s.v : acc + s.v
    if (s.kind === 'delta') acc += s.v
    if (s.kind === 'abs' && s.label === '零售价') acc = s.v
    return { ...s, lo: Math.min(from, to), hi: Math.max(from, to) }
  })
  return (
    <svg viewBox={`0 0 560 ${H + 46}`} width="100%" style={{ display: 'block' }}>
      {bars.map((b, i) => {
        const bw = 84
        const gap = (560 - bars.length * bw) / (bars.length + 1)
        const x = gap + i * (bw + gap)
        const yHi = H - (b.hi / max) * H
        const yLo = H - (b.lo / max) * H
        const isFinal = b.label === '目标成本'
        return (
          <g key={b.label}>
            <rect x={x} y={yHi} width={bw} height={Math.max(2, yLo - yHi)}
              fill={isFinal ? 'var(--brass)' : b.kind === 'abs' ? 'var(--ink)' : 'var(--hairline)'} opacity={isFinal ? 0.9 : 1} />
            {i < bars.length - 1 && (
              <line x1={x + bw} y1={yLo} x2={x + bw + gap} y2={yLo} stroke="var(--graphite)" strokeWidth="1" strokeDasharray="2 3" />
            )}
            <text x={x + bw / 2} y={yHi - 8} textAnchor="middle" className="num"
              style={{ ...tickStyle, fontSize: 12, fill: isFinal ? 'var(--brass)' : 'var(--ink)', fontWeight: 500 }}>
              {fmtTHB(Math.abs(b.v))}
            </text>
            <text x={x + bw / 2} y={H + 16} textAnchor="middle" style={tickStyle}>
              {b.label.split(' ').map((w, j) => (
                <tspan key={j} x={x + bw / 2} dy={j ? 11 : 0}>{w}</tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── small legend for map ── */
export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {(Object.keys(BRAND_META) as (keyof typeof BRAND_META)[]).map((b) => (
        <span key={b} className="inline-flex items-center gap-1.5" style={{ fontSize: 12 }}>
          <span className="evdot" style={{ background: BRAND_META[b].color }} />{b}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, color: 'var(--graphite)' }}>
        <span className="evdot" style={{ background: 'none', border: '1.4px dashed var(--graphite)' }} />标称未验证
      </span>
      <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, color: 'var(--brass)' }}>
        ◎ 目标
      </span>
    </div>
  )
}

export function EvTypeNote() {
  return (
    <div className="flex items-center gap-2">
      <EvPill t="PROXY" />
      <span style={{ fontSize: 12, color: 'var(--graphite)' }}>气泡大小 = 功率档 · 虚线空心 = 白牌标称值（未验证）</span>
    </div>
  )
}

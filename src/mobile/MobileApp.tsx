// Mobile shell — STORY + PRODUCT + PK + PLAN. Never a shrunk desktop.
// PRODUCT follows the FindNiche detail template: render → name → price trio →
// available-info badge strip → spec rows (each opens evidence) → disclosure.
import { useState } from 'react'
import {
  CONCEPTS, CONFIG_OPTIONS, EVIDENCE, GATES, HOTSPOTS, PK_COMPETITORS, PRODUCTS,
  TARGET_SPECS, WHY_B_WINS, bandOf, compPKColumn, fmtTHB, ourPKColumn, pkVerdict,
} from '../data/project'
import { useStore } from '../state/store'
import { EvidenceCard, WhyChain } from '../components/primitives'
import { Waterfall } from '../components/charts'
import PKBench from '../components/PKBench'
import ProductRender from '../components/ProductRender'
import StoryDeck from '../components/StoryDeck'

type Tab = 'story' | 'product' | 'pk' | 'plan'
type Sheet = 'none' | 'evidence' | 'chain' | 'whyB'

const TABS: { id: Tab; label: string }[] = [
  { id: 'story', label: '故事' },
  { id: 'product', label: '产品' },
  { id: 'pk', label: '对决' },
  { id: 'plan', label: '方案' },
]

export default function MobileApp() {
  const [tab, setTab] = useState<Tab>('story')
  const { evidence, closeEvidence } = useStore()
  const [chainHs, setChainHs] = useState<string | null>(null)
  const [whyB, setWhyB] = useState(false)

  const sheet: Sheet = evidence ? 'evidence' : chainHs ? 'chain' : whyB ? 'whyB' : 'none'
  const closeSheet = () => { closeEvidence(); setChainHs(null); setWhyB(false) }
  const hot = HOTSPOTS.find((h) => h.id === chainHs)
  const darkSheet = sheet === 'chain' || sheet === 'whyB'

  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--paper)', overflow: 'hidden' }}>
      {/* tab content */}
      <div style={{ position: 'absolute', inset: '0 0 54px 0' }}>
        {tab === 'story' && <StoryDeck onOpenBrief={() => setTab('plan')} onOpenPK={() => setTab('pk')} />}
        {tab === 'product' && <MProduct onChain={setChainHs} onWhyB={() => setWhyB(true)} goPK={() => setTab('pk')} goPlan={() => setTab('plan')} />}
        {tab === 'pk' && <MPK />}
        {tab === 'plan' && <MPlan />}
      </div>

      {/* bottom navigation */}
      <nav className="flex" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 54, borderTop: '1px solid var(--hairline)', background: 'var(--paper)' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="micro"
            style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.id ? 'var(--ink)' : 'var(--graphite)',
              borderTop: tab === t.id ? '2px solid var(--brass)' : '2px solid transparent',
              fontWeight: tab === t.id ? 500 : 400, fontSize: 10.5,
            }}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* global sheets */}
      {sheet !== 'none' && <div className="sheet-mask" onClick={closeSheet} />}
      {sheet !== 'none' && (
        <div className={`sheet ${darkSheet ? 'on-dark-sheet on-dark' : ''}`}>
          <div className="sheet-grip" />
          {sheet === 'evidence' && evidence && <EvidenceCard ev={evidence} />}
          {sheet === 'chain' && hot && (
            <>
              <div className="micro" style={{ color: 'var(--brass)', marginBottom: 12 }}>{hot.label} — 为什么长这样</div>
              <WhyChain chain={hot.chain} />
            </>
          )}
          {sheet === 'whyB' && (
            <>
              <div className="micro" style={{ color: 'var(--brass)', marginBottom: 12 }}>为什么是 B</div>
              {WHY_B_WINS.map((w) => (
                <div key={w.k} style={{ borderTop: '1px solid var(--hairline-dark)', padding: '9px 0' }}>
                  <div className="micro micro-dark" style={{ marginBottom: 2 }}>{w.k}</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{w.v}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ── PRODUCT — FindNiche detail template: one fact, one module ── */
function MProduct({ onChain, onWhyB, goPK, goPlan }: {
  onChain: (id: string) => void
  onWhyB: () => void
  goPK: () => void
  goPlan: () => void
}) {
  const { concept, setConcept, config, scenario, openEvidence, deltaCount, resetConfig } = useStore()
  const c = CONCEPTS.find((x) => x.id === concept)!
  const rec = PRODUCTS.find((p) => p.concept === concept)!
  const band = bandOf(config)
  const verdict = pkVerdict([ourPKColumn(config, scenario), ...PK_COMPETITORS.map(compPKColumn)])
  const confirmedCount = EVIDENCE.filter((e) => e.type === 'CONFIRMED').length

  return (
    <div className="on-dark" style={{ height: '100%', overflowY: 'auto', background: 'var(--void)', color: 'var(--bone)', padding: '14px 20px 24px' }}>
      {/* concept selector — our thumbnail strip */}
      <div className="flex justify-center gap-2" style={{ marginBottom: 4 }}>
        {CONCEPTS.map((x) => (
          <button key={x.id} className={`ctab ${concept === x.id ? 'on' : ''}`} style={{ padding: '8px 13px' }} onClick={() => setConcept(x.id)}>
            {x.id}{x.recommended ? ' ◈' : ''}
          </button>
        ))}
      </div>

      {/* product field — lit by its own beam; hotspots = selling-point anatomy */}
      <div style={{ position: 'relative', width: '88%', margin: '0 auto' }}>
        <div key={`${concept}-${config.beam}-${config.cct}`} className="rise-in">
          <ProductRender concept={concept} width={340} lit beamDeg={config.beam} cct={config.cct} sensor={config.control === 'Sensor Ready' || config.control === 'DALI'} />
        </div>
        {HOTSPOTS.map((h) => (
          <button key={h.id} className="hotspot" style={{ left: `${h.x}%`, top: `${h.y}%` }} onClick={() => onChain(h.id)} aria-label={h.label} />
        ))}
      </div>

      {/* name + role */}
      <div className="text-center" style={{ marginTop: 2 }}>
        <div className="micro" style={{ color: 'var(--brass)' }}>概念 {c.id} — {c.name}{c.recommended ? ' · 推荐' : ''}</div>
        <div className="disp" style={{ fontSize: 21, fontWeight: 600, marginTop: 4 }}>{rec.name}</div>
        <div className="micro" style={{ color: 'var(--stone)', marginTop: 3 }}>{rec.role} · {rec.roleEn}</div>
      </div>

      {/* price trio — cost is the hero */}
      <div className="flex" style={{ marginTop: 14, border: '1px solid var(--hairline-dark)', borderRadius: 14, overflow: 'hidden' }}>
        {[
          ['零售价格带', `${fmtTHB(band[0])}–${fmtTHB(band[1]).slice(1)}`, false],
          ['目标采购成本', fmtTHB(scenario.targetCost), true],
          ['≈ FOB 美元', `$${scenario.targetCostUSD}`, false],
        ].map(([label, value, hero], i) => (
          <div key={label as string} className="text-center" style={{
            flex: 1, padding: '10px 4px 9px',
            borderLeft: i > 0 ? '1px solid var(--hairline-dark)' : 'none',
            background: hero ? 'var(--brass-soft)' : 'none',
          }}>
            <div className="disp num" style={{ fontSize: hero ? 19 : 16, fontWeight: hero ? 700 : 500, color: hero ? 'var(--brass)' : 'var(--bone)' }}>{value as string}</div>
            <div className="micro" style={{ fontSize: 8.5, marginTop: 3, color: hero ? 'var(--brass)' : 'var(--stone)' }}>{label as string}</div>
          </div>
        ))}
      </div>

      {/* available-info badge strip */}
      <div className="flex justify-center flex-wrap gap-2" style={{ marginTop: 12 }}>
        <button className="evpill" style={{ cursor: 'pointer', background: 'none' }} onClick={() => openEvidence('lab-proof')}>实测背书</button>
        <button className="evpill" style={{ cursor: 'pointer', background: 'none', borderColor: 'var(--brass)', color: 'var(--brass)' }} onClick={goPK}>对决 {verdict.win} 胜 →</button>
        <button className="evpill" style={{ cursor: 'pointer', background: 'none' }} onClick={() => openEvidence('score-82')}>证据 {confirmedCount} ✓</button>
      </div>

      {/* SPEC — every row has a source */}
      <div style={{ marginTop: 20 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
          <span className="micro" style={{ color: 'var(--stone)' }}>目标规格 — 每行都有出处</span>
          {deltaCount > 0 && (
            <button className="whybtn" onClick={resetConfig}><span className="delta-dot" />Δ{deltaCount} 重置</button>
          )}
        </div>
        {TARGET_SPECS.map((s) => (
          <button key={s.key} onClick={() => openEvidence(s.ev)}
            style={{ display: 'flex', alignItems: 'baseline', gap: 12, width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--hairline-dark)', padding: '9px 0', cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
            <span className="micro" style={{ width: 104, flex: 'none', color: 'var(--stone)' }}>{s.param}</span>
            <span className="num" style={{ fontSize: 14.5, fontWeight: 500, flex: 1, color: 'var(--bone)' }}>{s.value}</span>
            <span className="micro" style={{ color: 'var(--brass)', fontSize: 9 }}>为什么？</span>
          </button>
        ))}
      </div>

      {/* progressive disclosure */}
      <div style={{ marginTop: 18 }}>
        {[
          ['为什么是 B', onWhyB],
          ['为什么长这样', () => onChain('heatsink')],
          ['配置与方案', goPlan],
        ].map(([label, fn]) => (
          <button key={label as string} onClick={fn as () => void}
            className="flex w-full items-center justify-between"
            style={{ background: 'none', border: 'none', borderTop: '1px solid var(--hairline-dark)', padding: '15px 2px', cursor: 'pointer', color: 'var(--bone)' }}>
            <span className="micro" style={{ color: 'var(--bone)', fontSize: 11.5 }}>{label as string}</span>
            <span style={{ color: 'var(--brass)' }}>▸</span>
          </button>
        ))}
        <div style={{ borderTop: '1px solid var(--hairline-dark)' }} />
      </div>
    </div>
  )
}

/* ── PK — 易车式品牌对决（移动优先） ── */
function MPK() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 26px' }}>
      <div className="micro" style={{ marginBottom: 4 }}>正面对决</div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>我们的方案好在哪里</div>
      <div style={{ fontSize: 12.5, color: 'var(--graphite)', marginBottom: 16, lineHeight: 1.6 }}>
        同档对手逐项对决，胜出蓝色高亮；我们输的项也如实标红 —— 这才是产品经理，不是销售话术。
      </div>
      <PKBench />
    </div>
  )
}

/* ── PLAN — DECIDE + BRIEF, one scroll: configure → consequence → math → brief → gates ── */
function MPlan() {
  const { concept, config, setConfig, resetConfig, lumen, scenario, risks, isDelta, deltaCount } = useStore()
  const band = bandOf(config)
  const done = GATES.filter((g) => g.status === 'done').length
  const groups: { title: string; pill: string; items: [string, string][] }[] = [
    {
      title: '机会与差距', pill: '■ 市场已证实',
      items: [['机会', '82/100 — 主流专业层空位'], ['EVE 现状', '90 lm/W · PF 0.5 · 2Y'], ['窗口', '฿1,890–2,190 × 160 lm/W']],
    },
    {
      title: '目标规格', pill: '○ 目标值',
      items: [
        ['功率 / 光通量', `${config.power}W · ${lumen.toLocaleString()} lm`],
        ['光效 / PF', '160 lm/W · ≥0.95'],
        ['配光 / 色温', `${config.beam}° · ${config.cct}K`],
        ['控制 / 质保', `${config.control} · ${config.warranty}Y`],
      ],
    },
    {
      title: '设计与工程', pill: '◐ 待工程验证',
      items: [['概念', `概念 ${concept} — ${CONCEPTS.find((c) => c.id === concept)!.name}`], ['形态', '放射鳍片 · 品牌蓝光学环 · 家族化'], ['工程', '短热路径 · 独立驱动腔 · IP65']],
    },
    {
      title: '商业情景', pill: '◈ 商业情景',
      items: [['零售带', `${fmtTHB(band[0])}–${fmtTHB(band[1]).slice(1)}`], ['目标采购成本', `${fmtTHB(scenario.targetCost)} ≈ FOB $${scenario.targetCostUSD}`]],
    },
    {
      title: '风险与待确认', pill: '△ 待客户确认',
      items: [
        ['风险', risks.length ? risks.map((r) => r.text).join('；') : '无新增风险'],
        ['待确认', 'TOSPO 能力匹配（内部数据）· EVE 工程渠道资源'],
      ],
    },
  ]

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '14px 20px 24px' }}>
      {/* product recedes but stays visible */}
      <div className="flex items-center gap-4" style={{ marginBottom: 8 }}>
        <div style={{ width: 110, flex: 'none' }}>
          <ProductRender concept={concept} width={110} sensor={config.control === 'Sensor Ready'} />
        </div>
        <div>
          <div className="micro">概念 {concept} · {config.power}W</div>
          <div className="disp num" style={{ fontSize: 19, fontWeight: 500 }}>{lumen.toLocaleString()} lm</div>
          {deltaCount > 0 && (
            <button className="whybtn" onClick={resetConfig} style={{ marginTop: 4 }}>重置目标 <span className="delta-dot" />Δ{deltaCount}</button>
          )}
        </div>
      </div>

      {/* configurator */}
      {([
        ['功率', 'power', CONFIG_OPTIONS.power, (v: number) => `${v}W`],
        ['色温', 'cct', CONFIG_OPTIONS.cct, (v: number) => `${v}K`],
        ['配光', 'beam', CONFIG_OPTIONS.beam, (v: number) => `${v}°`],
        ['控制', 'control', CONFIG_OPTIONS.control, (v: string) => v],
        ['质保', 'warranty', CONFIG_OPTIONS.warranty, (v: number) => `${v}Y`],
      ] as const).map(([label, key, opts, fmt]) => (
        <div key={key} style={{ borderTop: '1px solid var(--hairline-soft)', padding: '12px 0' }}>
          <div className="micro" style={{ marginBottom: 8 }}>
            {isDelta(key) && <span className="delta-dot" />}{label}{isDelta(key) && <span style={{ color: 'var(--brass)' }}> Δ</span>}
          </div>
          <div className="seg" style={{ display: 'flex' }}>
            {(opts as readonly (number | string)[]).map((v) => (
              <button key={v} style={{ flex: 1, minHeight: 44 }}
                className={config[key] === v ? 'on' : ''}
                onClick={() => setConfig({ [key]: v } as never)}>
                {(fmt as (x: never) => string)(v as never)}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* consequences */}
      <div style={{ borderTop: '2px solid var(--ink)', marginTop: 6, paddingTop: 14 }}>
        <div className="micro" style={{ marginBottom: 10 }}>实时后果</div>
        <div className="flex gap-6">
          <div><div className="micro">光通量</div><div className="disp num" style={{ fontSize: 20 }}>{lumen.toLocaleString()}</div></div>
          <div><div className="micro">零售价</div><div className="disp num" style={{ fontSize: 20 }}>{fmtTHB(band[0])}–{fmtTHB(band[1]).slice(1)}</div></div>
          <div><div className="micro">成本</div><div className="disp num" style={{ fontSize: 20, color: 'var(--brass)' }}>{fmtTHB(scenario.targetCost)}</div></div>
        </div>
        {risks.map((r) => (
          <div key={r.id} style={{ color: 'var(--risk)', fontSize: 12.5, marginTop: 9, lineHeight: 1.5 }}>⚑ {r.text}</div>
        ))}
      </div>

      {/* the math — collapsed by default */}
      <details style={{ borderTop: '1px solid var(--hairline)', marginTop: 14 }}>
        <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '13px 0' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontWeight: 600, fontSize: 14 }}>成本瀑布</span>
            <span style={{ color: 'var(--brass)' }}>▾</span>
          </div>
          <div className="micro" style={{ fontSize: 9, marginTop: 3 }}>◈ 商业情景 · 零售价 → 目标采购成本</div>
        </summary>
        <Waterfall />
        <div className="flex items-baseline gap-5" style={{ marginTop: 4, paddingBottom: 10 }}>
          <span className="micro">目标采购成本</span>
          <span className="disp num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--brass)' }}>{fmtTHB(scenario.targetCost)}</span>
          <span className="num" style={{ color: 'var(--graphite)' }}>≈ FOB ${scenario.targetCostUSD}</span>
        </div>
      </details>

      {/* BRIEF — collapsed groups */}
      <div className="micro" style={{ marginTop: 18, marginBottom: 2, color: 'var(--graphite)' }}>产品定义简报 — 研究已经变成产品需求</div>
      {groups.map((g) => (
        <details key={g.title} style={{ borderTop: '1px solid var(--hairline)' }}>
          <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '13px 0' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontWeight: 600, fontSize: 14 }}>{g.title}</span>
              <span style={{ color: 'var(--brass)' }}>▾</span>
            </div>
            <div className="micro" style={{ fontSize: 9, marginTop: 3 }}>{g.pill}</div>
          </summary>
          <div style={{ paddingBottom: 14 }}>
            {g.items.map(([k, v]) => (
              <div key={k} className="flex gap-3" style={{ padding: '7px 0', borderTop: '1px solid var(--hairline-soft)' }}>
                <span className="micro" style={{ width: 96, flex: 'none' }}>{k}</span>
                <span style={{ fontSize: 13, lineHeight: 1.6 }}>{v}</span>
              </div>
            ))}
          </div>
        </details>
      ))}

      {/* MOVE TO PROJECT */}
      <details style={{ borderTop: '2px solid var(--ink)', marginTop: 10 }}>
        <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '15px 0' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontWeight: 700, fontSize: 15 }}>立项闸门</span>
            <span className="num mono" style={{ fontSize: 11, color: 'var(--brass)' }}>{done}/{GATES.length}</span>
          </div>
        </summary>
        {GATES.map((g, i) => (
          <div key={g.id} className="flex items-baseline gap-3" style={{ padding: '8px 0', borderTop: '1px solid var(--hairline-soft)' }}>
            <span className="mono num" style={{ fontSize: 10, color: 'var(--graphite)' }}>G{i + 1}</span>
            <span style={{ flex: 1, fontSize: 13.5 }}>{g.name}</span>
            <span className="micro" style={{ color: g.status === 'done' ? 'var(--brass)' : 'var(--graphite)' }}>
              {g.status === 'done' ? '●' : g.status === 'active' ? '◐' : '○'}
            </span>
          </div>
        ))}
      </details>

      <div className="proto-note" style={{ marginTop: 22, lineHeight: 1.8 }}>
        PROTOTYPE · 演示数据基于公开信息估计<br />不是报价 · 不是最终工程
      </div>
    </div>
  )
}

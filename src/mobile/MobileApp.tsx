// Mobile shell — EXPLORE + PRESENT + DECIDE. Never a shrunk desktop.
// Bottom nav 4 tabs + global evidence bottom-sheet. Product-first layouts.
import { useState } from 'react'
import {
  CONCEPTS, CONFIG_OPTIONS, GATES, HOTSPOTS, WHY_B_WINS, bandOf, fmtTHB,
} from '../data/project'
import { useStore } from '../state/store'
import { EvidenceCard, WhyChain } from '../components/primitives'
import PKBench from '../components/PKBench'
import ProductRender from '../components/ProductRender'
import StoryDeck from '../components/StoryDeck'

type Tab = 'story' | 'product' | 'pk' | 'decide' | 'brief'
type Sheet = 'none' | 'evidence' | 'chain' | 'whyB'

const TABS: { id: Tab; label: string }[] = [
  { id: 'story', label: 'STORY' },
  { id: 'product', label: 'PRODUCT' },
  { id: 'pk', label: 'PK' },
  { id: 'decide', label: 'DECIDE' },
  { id: 'brief', label: 'BRIEF' },
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
        {tab === 'story' && <StoryDeck onOpenBrief={() => setTab('brief')} />}
        {tab === 'product' && <MProduct onChain={(id) => setChainHs(id)} onWhyB={() => setWhyB(true)} goDecide={() => setTab('decide')} />}
        {tab === 'pk' && <MPK />}
        {tab === 'decide' && <MDecide goBrief={() => setTab('brief')} />}
        {tab === 'brief' && <MBrief />}
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
              <div className="micro" style={{ color: 'var(--brass)', marginBottom: 12 }}>{hot.label} — WHY IT LOOKS LIKE THIS</div>
              <WhyChain chain={hot.chain} />
            </>
          )}
          {sheet === 'whyB' && (
            <>
              <div className="micro" style={{ color: 'var(--brass)', marginBottom: 12 }}>WHY B WINS</div>
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

/* ── PRODUCT — mobile studio, product 55–65% of screen ── */
function MProduct({ onChain, onWhyB, goDecide }: { onChain: (id: string) => void; onWhyB: () => void; goDecide: () => void }) {
  const { concept, setConcept, config, lumen } = useStore()
  const c = CONCEPTS.find((x) => x.id === concept)!
  return (
    <div className="on-dark" style={{ height: '100%', overflowY: 'auto', background: 'var(--void)', color: 'var(--bone)', padding: '14px 20px 24px' }}>
      <div className="flex justify-center gap-2" style={{ marginBottom: 4 }}>
        {CONCEPTS.map((x) => (
          <button key={x.id} className={`ctab ${concept === x.id ? 'on' : ''}`} style={{ padding: '8px 13px' }} onClick={() => setConcept(x.id)}>
            {x.id}{x.recommended ? ' ◈' : ''}
          </button>
        ))}
      </div>

      {/* product field — 55–65% of the screen, lit by its own beam */}
      <div style={{ position: 'relative', width: '88%', margin: '0 auto' }}>
        <div key={`${concept}-${config.beam}-${config.cct}`} className="rise-in">
          <ProductRender concept={concept} width={340} lit beamDeg={config.beam} cct={config.cct} sensor={config.control === 'Sensor Ready' || config.control === 'DALI'} />
        </div>
        {HOTSPOTS.map((h) => (
          <button key={h.id} className="hotspot" style={{ left: `${h.x}%`, top: `${h.y}%` }} onClick={() => onChain(h.id)} aria-label={h.label} />
        ))}
      </div>

      {/* first layer only */}
      <div className="text-center" style={{ marginTop: 2 }}>
        <div className="micro" style={{ color: 'var(--brass)' }}>CONCEPT {c.id} — {c.name}{c.recommended ? ' · RECOMMENDED' : ''}</div>
        <div className="disp num" style={{ fontSize: 25, fontWeight: 500, marginTop: 4 }}>
          <span key={`${config.power}-${concept}`} className="num-pop" style={{ display: 'inline-block' }}>
            {config.power}W · {lumen.toLocaleString()} lm · 160 lm/W
          </span>
        </div>
        <div className="num" style={{ color: 'var(--stone)' }}>{fmtTHB(bandOf(config)[0])}–{fmtTHB(bandOf(config)[1]).slice(1)}</div>
        {/* spec-sheet ribbon — lighting trade language */}
        <div className="flex flex-wrap justify-center gap-1" style={{ marginTop: 10 }}>
          {[`IP65`, 'IK08', `${config.cct}K`, 'Ra80', `${config.beam}°`, config.control].map((s) => (
            <span key={s} className="evpill" style={{ borderColor: 'var(--hairline-dark)', color: 'var(--stone)' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* progressive disclosure */}
      <div style={{ marginTop: 18 }}>
        {[
          ['WHY B WINS', onWhyB],
          ['WHY DOES IT LOOK LIKE THIS', () => onChain('heatsink')],
          ['CONFIGURE', goDecide],
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
      <div className="micro" style={{ marginBottom: 4 }}>HEAD-TO-HEAD PK</div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>我们的方案好在哪里</div>
      <div style={{ fontSize: 12.5, color: 'var(--graphite)', marginBottom: 16, lineHeight: 1.6 }}>
        同档对手逐项对决，胜出黄铜高亮；我们输的项也如实标红 —— 这才是产品经理，不是销售话术。
      </div>
      <PKBench />
    </div>
  )
}

/* ── DECIDE — configurator + live consequences ── */
function MDecide({ goBrief }: { goBrief: () => void }) {
  const { concept, config, setConfig, resetConfig, lumen, scenario, risks, isDelta, deltaCount } = useStore()
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '14px 20px 24px' }}>
      {/* product recedes but stays visible */}
      <div className="flex items-center gap-4" style={{ marginBottom: 8 }}>
        <div style={{ width: 110, flex: 'none' }}>
          <ProductRender concept={concept} width={110} sensor={config.control === 'Sensor Ready'} />
        </div>
        <div>
          <div className="micro">CONCEPT {concept} · {config.power}W</div>
          <div className="disp num" style={{ fontSize: 19, fontWeight: 500 }}>{lumen.toLocaleString()} lm</div>
          {deltaCount > 0 && (
            <button className="whybtn" onClick={resetConfig} style={{ marginTop: 4 }}>RESET TARGET <span className="delta-dot" />Δ{deltaCount}</button>
          )}
        </div>
      </div>

      {([
        ['POWER', 'power', CONFIG_OPTIONS.power, (v: number) => `${v}W`],
        ['CCT', 'cct', CONFIG_OPTIONS.cct, (v: number) => `${v}K`],
        ['BEAM', 'beam', CONFIG_OPTIONS.beam, (v: number) => `${v}°`],
        ['CONTROL', 'control', CONFIG_OPTIONS.control, (v: string) => v],
        ['WARRANTY', 'warranty', CONFIG_OPTIONS.warranty, (v: number) => `${v}Y`],
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
        <div className="micro" style={{ marginBottom: 10 }}>CONSEQUENCE — 实时</div>
        <div className="flex gap-6">
          <div><div className="micro">LUMEN</div><div className="disp num" style={{ fontSize: 20 }}>{lumen.toLocaleString()}</div></div>
          <div><div className="micro">RETAIL</div><div className="disp num" style={{ fontSize: 20 }}>{fmtTHB(bandOf(config)[0])}–{fmtTHB(bandOf(config)[1]).slice(1)}</div></div>
          <div><div className="micro">COST</div><div className="disp num" style={{ fontSize: 20, color: 'var(--brass)' }}>{fmtTHB(scenario.targetCost)}</div></div>
        </div>
        {risks.map((r) => (
          <div key={r.id} style={{ color: 'var(--risk)', fontSize: 12.5, marginTop: 9, lineHeight: 1.5 }}>⚑ {r.text}</div>
        ))}
      </div>

      <button className="btn-ink" style={{ width: '100%', justifyContent: 'center', marginTop: 22, padding: 16 }} onClick={goBrief}>
        以当前配置生成 BRIEF →
      </button>
    </div>
  )
}

/* ── BRIEF — the landing point ── */
function MBrief() {
  const { config, concept, lumen, scenario, risks } = useStore()
  const groups: { title: string; pill: string; items: [string, string][] }[] = [
    {
      title: 'OPPORTUNITY & GAP', pill: '■ MARKET CONFIRMED',
      items: [['机会', '82/100 — 主流专业层空位'], ['EVE 现状', '90 lm/W · PF 0.5 · 2Y'], ['窗口', '฿1,890–2,190 × 160 lm/W']],
    },
    {
      title: 'TARGET SPEC', pill: '○ TARGET',
      items: [
        ['功率 / 光通量', `${config.power}W · ${lumen.toLocaleString()} lm`],
        ['光效 / PF', '160 lm/W · ≥0.95'],
        ['配光 / CCT', `${config.beam}° · ${config.cct}K`],
        ['控制 / 质保', `${config.control} · ${config.warranty}Y`],
      ],
    },
    {
      title: 'DESIGN & ENGINEERING', pill: '◐ TO VALIDATE',
      items: [['概念', `Concept ${concept} — ${CONCEPTS.find((c) => c.id === concept)!.name}`], ['形态', 'Radial fin · 黄铜光学环 · 家族化'], ['工程', '短热路径 · 独立驱动腔 · IP65']],
    },
    {
      title: 'COMMERCIAL', pill: '◈ SCENARIO',
      items: [['零售带', `${fmtTHB(bandOf(config)[0])}–${fmtTHB(bandOf(config)[1]).slice(1)}`], ['目标采购成本', `${fmtTHB(scenario.targetCost)} ≈ FOB $${scenario.targetCostUSD}`]],
    },
    {
      title: 'RISK & OPEN QUESTIONS', pill: '△ TO CONFIRM',
      items: [
        ['风险', risks.length ? risks.map((r) => r.text).join('；') : '无新增风险'],
        ['待确认', 'TOSPO Capability（内部数据）· EVE 工程渠道资源'],
      ],
    },
  ]
  const done = GATES.filter((g) => g.status === 'done').length
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 20px 26px' }}>
      <div className="micro" style={{ marginBottom: 6 }}>PRODUCT DEFINITION BRIEF</div>
      <div className="disp" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>EVE NEXT HIGHBAY</div>
      <div style={{ fontSize: 12.5, color: 'var(--graphite)', marginBottom: 16 }}>研究已经变成产品需求。</div>

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
            <span style={{ fontWeight: 700, fontSize: 15 }}>MOVE TO PROJECT GATE</span>
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

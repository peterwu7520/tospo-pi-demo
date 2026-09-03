// Desktop screens — PRODUCT & PROJECT phases.
// PRODUCT STUDIO switches to the dark STUDIO register: data recedes, product takes the screen.
import { useRef, useState } from 'react'
import {
  CONCEPTS, ENGINEERING_INTENTS, GATES, HOTSPOTS, WHY_B_WINS, CONFIG_OPTIONS,
  bandOf, fmtTHB,
} from '../data/project'
import { useStore } from '../state/store'
import { EvPill, WhyChain } from '../components/primitives'
import { Waterfall } from '../components/charts'
import ProductRender from '../components/ProductRender'
import type { ScreenId } from './DesktopApp'

function NextStep({ to, label, go }: { to: ScreenId; label: string; go: (s: ScreenId) => void }) {
  return (
    <div className="mt-12 flex items-center justify-between hairline-t" style={{ paddingTop: 20 }}>
      <span className="micro">工作流下一步</span>
      <button className="btn-ink" onClick={() => go(to)}>{label} →</button>
    </div>
  )
}

/* ─────────────────────── 06 PRODUCT STUDIO (dark register) ─────────────────────── */
export function Studio({ go }: { go: (s: ScreenId) => void }) {
  const { concept, setConcept, config, setConfig, lumen, scenario, risks, isDelta, deltaCount, resetConfig } = useStore()
  const [hs, setHs] = useState<string | null>(null)
  const [whyB, setWhyB] = useState(false)
  const configRef = useRef<HTMLDivElement>(null)
  const c = CONCEPTS.find((x) => x.id === concept)!
  const hot = HOTSPOTS.find((h) => h.id === hs)

  return (
    <div className="on-dark" style={{ margin: '-32px -40px -80px', padding: '40px 44px 64px', background: 'var(--void)', color: 'var(--bone)', minHeight: '100%' }}>
      <div className="micro micro-dark" style={{ marginBottom: 8 }}>07 · THE PRODUCTS — STUDIO REGISTER</div>
      <h1 className="disp" style={{ fontSize: 30, margin: '0 0 4px', fontWeight: 700, color: 'var(--bone)' }}>数据已经变成产品。</h1>
      <p style={{ color: 'var(--stone)', margin: '0 0 22px', fontSize: 13.5 }}>
        三个概念不是三个价格版本 —— 是三个产品战略。同一张家族脸。
      </p>

      {/* concept strategy selector */}
      <div className="flex gap-3" style={{ marginBottom: 8 }}>
        {CONCEPTS.map((x) => (
          <button key={x.id} className={`ctab ${concept === x.id ? 'on' : ''}`} onClick={() => setConcept(x.id)}>
            {x.id} — {x.name}{x.recommended ? ' ◈' : ''}
          </button>
        ))}
      </div>
      <div className="micro" style={{ color: 'var(--brass)', marginBottom: 18 }}>{c.strategy}</div>

      <div className="grid gap-8" style={{ gridTemplateColumns: hot ? '1fr 300px' : '1fr', alignItems: 'start' }}>
        {/* product field */}
        <div>
          <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
            <div key={`${concept}-${config.beam}-${config.cct}`} className="rise-in">
              <ProductRender concept={concept} width={520} lit beamDeg={config.beam} cct={config.cct} sensor={config.control === 'Sensor Ready' || config.control === 'DALI'} />
            </div>
            {HOTSPOTS.map((h) => (
              <button key={h.id} className={`hotspot ${hs === h.id ? 'on' : ''}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onClick={() => setHs(hs === h.id ? null : h.id)}>
                <span className="hs-label">{h.label}</span>
              </button>
            ))}
          </div>

          {/* first-layer only: concept + 3 key params */}
          <div className="text-center" style={{ marginTop: 6 }}>
            <div className="micro" style={{ color: 'var(--brass)' }}>概念 {c.id} — {c.name}{c.recommended ? ' · 推荐' : ''}</div>
            <div className="disp num" style={{ fontSize: 30, fontWeight: 500, marginTop: 4 }}>
              <span key={`${config.power}-${concept}`} className="num-pop" style={{ display: 'inline-block' }}>
                {config.power}W · {lumen.toLocaleString()} lm · 160 lm/W
              </span>
            </div>
            <div className="num" style={{ color: 'var(--stone)', marginTop: 2 }}>{fmtTHB(bandOf(config)[0])}–{fmtTHB(bandOf(config)[1]).slice(1)} 零售</div>
          </div>

          {/* progressive disclosure entries */}
          <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 22 }}>
            <button className="btn-ghost" onClick={() => setWhyB(!whyB)}>{whyB ? '收起' : '为什么是 B'}</button>
            <button className="btn-ghost" onClick={() => setHs(hs ? null : 'heatsink')}>为什么长这样</button>
            <button className="btn-ink" onClick={() => configRef.current?.scrollIntoView({ behavior: 'smooth' })}>开始配置</button>
          </div>

          {whyB && (
            <div className="rise-in" style={{ marginTop: 24, borderTop: '1px solid var(--hairline-dark)', paddingTop: 16 }}>
              {WHY_B_WINS.map((w) => (
                <div key={w.k} className="flex gap-4" style={{ padding: '7px 0', borderBottom: '1px solid var(--hairline-dark-soft)' }}>
                  <span className="micro micro-dark" style={{ width: 130, flex: 'none' }}>{w.k}</span>
                  <span style={{ fontSize: 13, color: 'var(--bone)', lineHeight: 1.6 }}>{w.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* hotspot chain panel */}
        {hot && (
          <div className="rise-in" style={{ border: '1px solid var(--hairline-dark)', padding: '18px 18px 6px', borderRadius: 3 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <span className="micro" style={{ color: 'var(--brass)' }}>{hot.label}</span>
              <button className="whybtn" style={{ borderColor: 'var(--hairline-dark)', color: 'var(--stone)' }} onClick={() => setHs(null)}>关闭</button>
            </div>
            <WhyChain chain={hot.chain} />
            <div className="proto-note" style={{ color: 'var(--stone)', paddingBottom: 10 }}>市场 → 工程 → 形态</div>
          </div>
        )}
      </div>

      {/* CONFIGURATOR — automotive style, one state */}
      <div ref={configRef} style={{ marginTop: 40, borderTop: '1px solid var(--hairline-dark)', paddingTop: 22 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <span className="micro micro-dark">配置 — 改动同帧传播到 规格 / 商业 / 风险 / 简报</span>
          {deltaCount > 0 && (
            <button className="whybtn" style={{ borderColor: 'var(--brass)', color: 'var(--brass)' }} onClick={resetConfig}>
              重置为目标 <span className="delta-dot" />Δ{deltaCount}
            </button>
          )}
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          <CfgRow label="功率" delta={isDelta('power')}>
            <div className="seg">{CONFIG_OPTIONS.power.map((v) => <button key={v} className={config.power === v ? 'on' : ''} onClick={() => setConfig({ power: v })}>{v}W</button>)}</div>
          </CfgRow>
          <CfgRow label="色温" delta={isDelta('cct')}>
            <div className="seg">{CONFIG_OPTIONS.cct.map((v) => <button key={v} className={config.cct === v ? 'on' : ''} onClick={() => setConfig({ cct: v })}>{v}K</button>)}</div>
          </CfgRow>
          <CfgRow label="配光" delta={isDelta('beam')}>
            <div className="seg">{CONFIG_OPTIONS.beam.map((v) => <button key={v} className={config.beam === v ? 'on' : ''} onClick={() => setConfig({ beam: v })}>{v}°</button>)}</div>
          </CfgRow>
          <CfgRow label="控制" delta={isDelta('control')}>
            <div className="seg">{CONFIG_OPTIONS.control.map((v) => <button key={v} className={config.control === v ? 'on' : ''} onClick={() => setConfig({ control: v })}>{v}</button>)}</div>
          </CfgRow>
          <CfgRow label="质保" delta={isDelta('warranty')}>
            <div className="seg">{CONFIG_OPTIONS.warranty.map((v) => <button key={v} className={config.warranty === v ? 'on' : ''} onClick={() => setConfig({ warranty: v })}>{v}Y</button>)}</div>
          </CfgRow>
        </div>

        {/* live consequences */}
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2" style={{ marginTop: 20, borderTop: '1px solid var(--hairline-dark-soft)', paddingTop: 14 }}>
          <span className="micro micro-dark">实时后果</span>
          <span className="num disp" style={{ fontSize: 18 }}>{lumen.toLocaleString()} lm</span>
          <span className="num disp" style={{ fontSize: 18 }}>{fmtTHB(bandOf(config)[0])}–{fmtTHB(bandOf(config)[1]).slice(1)}</span>
          <span className="num disp" style={{ fontSize: 18, color: 'var(--brass)' }}>成本 ≈ {fmtTHB(scenario.targetCost)}</span>
        </div>
        {risks.map((r) => (
          <div key={r.id} className="num" style={{ color: 'var(--risk)', fontSize: 12.5, marginTop: 8 }}>⚑ {r.text}</div>
        ))}
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 36, borderTop: '1px solid var(--hairline-dark)', paddingTop: 20 }}>
        <span className="micro micro-dark">工作流下一步</span>
        <div className="flex gap-3">
          <button className="btn-ghost" onClick={() => go('engineering')}>07 工程</button>
          <button className="btn-ghost" onClick={() => go('commercial')}>08 商业</button>
          <button className="btn-ink" onClick={() => go('brief')}>生成产品简报 →</button>
        </div>
      </div>
    </div>
  )
}

function CfgRow({ label, delta, children }: { label: string; delta: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="micro micro-dark" style={{ marginBottom: 6 }}>{delta && <span className="delta-dot" />}{label}{delta && <span style={{ color: 'var(--brass)' }}> Δ 偏离目标</span>}</div>
      {children}
    </div>
  )
}

/* ─────────────────────────── 07 ENGINEERING ─────────────────────────── */
export function Engineering({ go }: { go: (s: ScreenId) => void }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>08 · THE PRODUCTS</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 14px', fontWeight: 700 }}>工程意图</h1>
      <div style={{ border: '1px solid var(--brass)', background: 'var(--brass-soft)', padding: '10px 14px', marginBottom: 26 }}
        className="micro">
        工程意图 — 待工程验证。这不是 CAD，不是最终结构。
      </div>

      {ENGINEERING_INTENTS.map((e) => {
        const hs = HOTSPOTS.find((h) => h.id === e.hs)
        return (
          <div key={e.id} style={{ borderTop: '1px solid var(--hairline-soft)' }}>
            <button onClick={() => setOpen(open === e.id ? null : e.id)}
              className="flex w-full items-baseline gap-5"
              style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', textAlign: 'left' }}>
              <span className="micro" style={{ width: 170, flex: 'none' }}>{e.t}</span>
              <span style={{ flex: 1, fontSize: 13.5 }}>{e.d}</span>
              <span className="micro" style={{ color: 'var(--brass)' }}>{open === e.id ? '− 为什么链' : '+ 为什么链'}</span>
            </button>
            {open === e.id && hs && (
              <div className="rise-in" style={{ padding: '4px 0 18px 190px', maxWidth: 420 }}>
                <WhyChain chain={hs.chain} />
              </div>
            )}
          </div>
        )
      })}

      <NextStep to="commercial" label="工程意图成立 → 商业场景能否闭合" go={go} />
    </div>
  )
}

/* ─────────────────────────── 08 COMMERCIAL ─────────────────────────── */
export function Commercial({ go }: { go: (s: ScreenId) => void }) {
  const { config, setConfig, adj, setAdj, scenario } = useStore()
  const band = [1890, 2190]
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>09 · THE PRODUCTS</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 14px', fontWeight: 700 }}>商业情景</h1>
      <div style={{ border: '1px solid var(--brass)', background: 'var(--brass-soft)', padding: '10px 14px', marginBottom: 26 }}
        className="micro">
        情景模型 — 不是报价。<EvPill t="ESTIMATE" />
      </div>

      <Waterfall />

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 26 }}>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>零售价格点</div>
          <input type="range" min={band[0]} max={band[1]} step={10}
            value={scenario.retail}
            onChange={(e) => setAdj({ retailPoint: +e.target.value })}
            style={{ width: '100%', accentColor: 'var(--brass)' }} />
          <div className="num disp" style={{ fontSize: 22 }}>{fmtTHB(scenario.retail)}</div>
        </div>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>零售毛利 / 分销毛利</div>
          <div className="seg" style={{ marginRight: 8 }}>
            {[25, 30, 35].map((v) => <button key={v} className={adj.retailMarginPct === v ? 'on' : ''} onClick={() => setAdj({ retailMarginPct: v })}>{v}%</button>)}
          </div>
          <div className="seg">
            {[15, 18, 22].map((v) => <button key={v} className={adj.distMarginPct === v ? 'on' : ''} onClick={() => setAdj({ distMarginPct: v })}>{v}%</button>)}
          </div>
        </div>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>质保（单一状态 — 同步全局）</div>
          <div className="seg">{[3, 5].map((v) => <button key={v} className={config.warranty === v ? 'on' : ''} onClick={() => setConfig({ warranty: v })}>{v}Y</button>)}</div>
        </div>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>控制（单一状态 — 同步全局）</div>
          <div className="seg">{['ON/OFF', '0-10V', 'DALI', 'Sensor Ready'].map((v) => <button key={v} className={config.control === v ? 'on' : ''} onClick={() => setConfig({ control: v })}>{v}</button>)}</div>
        </div>
      </div>

      <div className="flex items-baseline gap-8 hairline-t" style={{ marginTop: 26, paddingTop: 16 }}>
        <span className="micro">目标采购成本</span>
        <span className="disp num" style={{ fontSize: 34, fontWeight: 700, color: 'var(--brass)' }}>{fmtTHB(scenario.targetCost)}</span>
        <span className="num" style={{ color: 'var(--graphite)' }}>≈ FOB ${scenario.targetCostUSD}</span>
        {scenario.controlDelta > 0 && <span className="num" style={{ color: 'var(--risk)', fontSize: 12.5 }}>含控制/质保附加 +{fmtTHB(scenario.controlDelta)}</span>}
      </div>

      <NextStep to="brief" label="场景闭合 → 生成产品定义简报" go={go} />
    </div>
  )
}

/* ─────────────────────────── 09 PRODUCT BRIEF ─────────────────────── */
const BRIEF_CLASS = ['市场已证实', '目标值', '待工程验证', '待商业验证', '待客户确认'] as const

export function Brief({ go }: { go: (s: ScreenId) => void }) {
  const { config, concept, lumen, scenario, risks } = useStore()
  const c = CONCEPTS.find((x) => x.id === concept)!
  const rows: [string, string, number][] = [
    ['机会', '82/100 — 主流专业层空位（为什么 82 分？九维可展开）', 0],
    ['客户差距', 'EVE 90 lm/W / PF 0.5 → 专业层 130–160+ / PF≥0.9', 0],
    ['目标用户', '泰国厂房/仓储业主 · 工程商 · 分销渠道', 4],
    ['定位', '主流专业层 — 可信但可及', 1],
    ['零售价', `${fmtTHB(bandOf(config)[0])}–${fmtTHB(bandOf(config)[1]).slice(1)} · 价格点 ${fmtTHB(scenario.retail)}`, 3],
    ['目标采购成本', `${fmtTHB(scenario.targetCost)} ≈ FOB $${scenario.targetCostUSD}`, 3],
    ['功率 / 光通量', `${config.power}W · ${lumen.toLocaleString()} lm`, 1],
    ['光效 / PF', `160 lm/W · PF ≥ 0.95`, 1],
    ['IP / IK / 配光', `IP65 · IK08 · ${config.beam}°`, 2],
    ['色温 / 控制', `${config.cct}K · ${config.control}`, 1],
    ['质保', `${config.warranty}Y`, 3],
    ['CMF', '哑黑压铸铝 · 品牌蓝光学环 · 家族化边缘语言', 1],
    ['设计意图', `概念 ${c.id} ${c.name} — ${c.strategy}`, 1],
    ['工程意图', '放射鳍片短热路径 · 独立驱动腔 · IP65 密封', 2],
    ['风险', risks.length ? risks.map((r) => r.text).join('；') : '无新增风险 — 当前配置 = 目标值', 2],
    ['待确认问题', 'TOSPO 能力匹配评分待内部 BOM/产线数据；EVE 工程渠道资源待确认', 4],
  ]
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>10 · DECIDE & LAUNCH</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>产品定义简报</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 22px', maxWidth: 560 }}>
        市场研究已经变成一个产品需求。每一项都带分类标注 —— 已确认、目标、还是待验证。
      </p>

      <div className="flex flex-wrap gap-2" style={{ marginBottom: 20 }}>
        {BRIEF_CLASS.map((k, i) => <span key={k} className="evpill">{['■', '○', '◐', '◈', '△'][i]} {k}</span>)}
      </div>

      <div style={{ borderTop: '2px solid var(--ink)' }}>
        {rows.map(([k, v, ci]) => (
          <div key={k} className="flex items-baseline gap-5" style={{ borderBottom: '1px solid var(--hairline-soft)', padding: '11px 0' }}>
            <span className="micro" style={{ width: 190, flex: 'none' }}>{k}</span>
            <span style={{ flex: 1, fontSize: 13.5, lineHeight: 1.6 }}>{v}</span>
            <span className="micro" style={{ fontSize: 8.5, color: ci === 1 ? 'var(--brass)' : 'var(--graphite)' }}>{['■', '○', '◐', '◈', '△'][ci]} {BRIEF_CLASS[ci]}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between hairline-t" style={{ paddingTop: 20 }}>
        <span style={{ fontSize: 13.5, color: 'var(--graphite)' }}>系统不能停在 Brief。下一步是立项闸门。</span>
        <button className="btn-ink" onClick={() => go('gate')}>进入立项闸门 →</button>
      </div>
    </div>
  )
}

/* ─────────────────────────── 10 PROJECT GATE ──────────────────────── */
export function Gate() {
  const done = GATES.filter((g) => g.status === 'done').length
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>11 · DECIDE & LAUNCH</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>立项闸门</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 24px', maxWidth: 560 }}>
        有了闸门，系统才从"AI 建议工具"变成产品立项系统。
      </p>

      <div className="flex items-center gap-3" style={{ marginBottom: 22 }}>
        <div style={{ flex: 1, height: 4, background: 'var(--hairline-soft)', position: 'relative' }}>
          <div style={{ width: `${(done / GATES.length) * 100}%`, height: '100%', background: 'var(--brass)' }} />
        </div>
        <span className="num mono" style={{ fontSize: 12 }}>{done}/{GATES.length}</span>
      </div>

      {GATES.map((g, i) => (
        <div key={g.id} className="flex items-baseline gap-4" style={{ borderTop: '1px solid var(--hairline-soft)', padding: '12px 0' }}>
          <span className="mono num" style={{ fontSize: 11, color: 'var(--graphite)' }}>G{i + 1}</span>
          <span style={{ width: 210, fontWeight: 600, fontSize: 14 }}>{g.name}</span>
          <span className="micro" style={{ width: 130 }}>{g.owner.toUpperCase()}</span>
          <span className="micro" style={{
            color: g.status === 'done' ? 'var(--brass)' : g.status === 'active' ? 'var(--ink)' : 'var(--graphite)',
          }}>
            {g.status === 'done' ? '● 已通过' : g.status === 'active' ? '◐ 进行中' : '○ 待启动'}
          </span>
          {g.note && <span style={{ flex: 1, textAlign: 'right', fontSize: 12, color: 'var(--graphite)' }}>{g.note}</span>}
        </div>
      ))}

      <p style={{ fontSize: 13, color: 'var(--graphite)', marginTop: 26, lineHeight: 1.7 }}>
        公开数据启动决策，内部数据锐化决策。<br />
        G3 / G4 等待得邦内部数据接入 —— 接入后不是重做系统，而是提高置信度。
      </p>
    </div>
  )
}

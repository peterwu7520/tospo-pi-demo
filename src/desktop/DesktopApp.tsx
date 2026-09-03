// Desktop shell — three-pane product-manager workstation.
// Left: workflow rail (grouped by the mainline) · Center: workspace · Right: evidence & decision rail.
import { useState, type ReactNode } from 'react'
import { useStore } from '../state/store'
import { EvidenceCard } from '../components/primitives'
import { EVIDENCE, evById, PROJECT } from '../data/project'
import { Market, Customer, Competition, Opportunity, Strategy } from './screens-evidence'
import { Recommendation, PKScreen } from './screens-answer'
import { Studio, Engineering, Commercial, Brief, Gate } from './screens-product'

export type ScreenId =
  | 'recommend' | 'pk' | 'market' | 'customer' | 'competition'
  | 'opportunity' | 'strategy'
  | 'studio' | 'engineering' | 'commercial'
  | 'brief' | 'gate'

interface RailEntry { id: ScreenId; n: string; label: string; status: 'done' | 'active' | 'pending' }
interface RailGroup { phase: string; items: RailEntry[] }

const RAIL: RailGroup[] = [
  {
    phase: '为什么是这个方向 — 证据与推理',
    items: [
      { id: 'market', n: '02', label: '市场', status: 'done' },
      { id: 'customer', n: '03', label: '客户', status: 'active' },
      { id: 'competition', n: '04', label: '竞争', status: 'done' },
      { id: 'opportunity', n: '05', label: '机会', status: 'done' },
    ],
  },
  {
    phase: '推荐产品 — 三款怎么落地',
    items: [
      { id: 'strategy', n: '06', label: '目标规格', status: 'active' },
      { id: 'studio', n: '07', label: '产品工作室', status: 'active' },
      { id: 'engineering', n: '08', label: '工程', status: 'pending' },
      { id: 'commercial', n: '09', label: '商业', status: 'pending' },
    ],
  },
  {
    phase: '拍板与立项',
    items: [
      { id: 'brief', n: '10', label: '产品简报', status: 'pending' },
      { id: 'gate', n: '11', label: '立项闸门', status: 'pending' },
    ],
  },
]

const STATUS_DOT = { done: '●', active: '◐', pending: '○' } as const

/* screen → default evidence shown in right rail */
const SCREEN_EVIDENCE: Record<ScreenId, string[]> = {
  recommend: ['lab-proof', 'price-window', 'eve-assets'],
  pk: ['bec-pos', 'lamptan-pos', 'lab-proof'],
  market: ['prof-band', 'price-window', 'whitelabel-claims'],
  customer: ['eve-efficacy', 'eve-pf', 'warranty-bench'],
  competition: ['philips-pos', 'bec-pos', 'lamptan-pos'],
  opportunity: ['score-82', 'tospo-capability', 'price-window'],
  strategy: ['target-160', 'target-price', 'warranty-bench'],
  studio: ['target-160', 'prof-band', 'whitelabel-claims'],
  engineering: ['prof-band', 'tisi', 'tospo-capability'],
  commercial: ['target-price', 'price-window', 'tospo-capability'],
  brief: ['target-160', 'target-price', 'tisi'],
  gate: ['tisi', 'tospo-capability', 'score-82'],
}

export default function DesktopApp() {
  const [screen, setScreen] = useState<ScreenId>('recommend')
  const { evidence, closeEvidence, setPresenting, deltaCount } = useStore()

  const confirmed = EVIDENCE.filter((e) => e.type === 'CONFIRMED').length
  const missingInternal = EVIDENCE.filter((e) => e.type === 'INTERNAL').length

  const screens: Record<ScreenId, ReactNode> = {
    recommend: <Recommendation go={setScreen} />,
    pk: <PKScreen />,
    market: <Market go={setScreen} />,
    customer: <Customer go={setScreen} />,
    competition: <Competition go={setScreen} />,
    opportunity: <Opportunity go={setScreen} />,
    strategy: <Strategy go={setScreen} />,
    studio: <Studio go={setScreen} />,
    engineering: <Engineering go={setScreen} />,
    commercial: <Commercial go={setScreen} />,
    brief: <Brief go={setScreen} />,
    gate: <Gate />,
  }

  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--paper)' }}>
      {/* ── PROJECT HEADER ── */}
      <header className="flex flex-none items-center gap-5 px-5 hairline-b" style={{ height: 56 }}>
        <div className="micro" style={{ color: 'var(--ink)', fontWeight: 500 }}>TOSPO · 产品情报</div>
        <div className="flex items-center gap-2" style={{ fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{PROJECT.customer}</span>
          <span style={{ color: 'var(--graphite)' }}>· {PROJECT.market} · {PROJECT.category} ·</span>
          <span className="disp" style={{ fontWeight: 700, letterSpacing: '0.02em' }}>{PROJECT.title}</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="micro">阶段 · {PROJECT.stage}</span>
          <span className="micro" title="证据置信度">
            已证实 <span className="num" style={{ color: 'var(--ink)' }}>{confirmed}✓</span>
            {missingInternal > 0 && <span style={{ color: 'var(--ev-internal)' }}> · {missingInternal} 待内部</span>}
          </span>
          {deltaCount > 0 && (
            <span className="micro" style={{ color: 'var(--brass)' }} title="配置器已偏离目标值">
              <span className="delta-dot" />Δ {deltaCount}
            </span>
          )}
          <span className="micro">{PROJECT.owner}</span>
          <button className="btn-ink" style={{ padding: '8px 16px' }} onClick={() => setPresenting(true)}>演示 ▸</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ── WORKFLOW RAIL ── */}
        <nav className="flex-none overflow-y-auto py-3" style={{ width: 232, borderRight: '1px solid var(--hairline)' }}>
          <div className="micro" style={{ padding: '0 14px 6px', fontSize: 9.5, color: 'var(--brass)' }}>我们的建议 — 先给答案</div>
          <button className={`rail-item ${screen === 'recommend' ? 'on' : ''}`} onClick={() => setScreen('recommend')}>
            <span className="micro" style={{ width: 22 }}>00</span>
            <span className="rl" style={{ fontSize: 12.5, letterSpacing: '0.08em', fontWeight: 600, flex: 1 }}>推荐方案</span>
            <span style={{ fontSize: 9, color: 'var(--brass)' }}>●</span>
          </button>
          <button className={`rail-item ${screen === 'pk' ? 'on' : ''}`} onClick={() => setScreen('pk')}>
            <span className="micro" style={{ width: 22 }}>01</span>
            <span className="rl" style={{ fontSize: 12.5, letterSpacing: '0.08em', fontWeight: 500, flex: 1 }}>对决台</span>
            <span style={{ fontSize: 9, color: 'var(--brass)' }}>●</span>
          </button>
          {RAIL.map((g) => (
            <div key={g.phase} className="mt-4">
              <div className="micro" style={{ padding: '0 14px 6px', fontSize: 9.5 }}>{g.phase}</div>
              {g.items.map((it) => (
                <button key={it.id} className={`rail-item ${screen === it.id ? 'on' : ''}`} onClick={() => setScreen(it.id)}>
                  <span className="micro" style={{ width: 22 }}>{it.n}</span>
                  <span className="rl" style={{ fontSize: 12.5, letterSpacing: '0.08em', fontWeight: 500, flex: 1 }}>{it.label}</span>
                  <span style={{ fontSize: 9, color: it.status === 'active' ? 'var(--brass)' : 'var(--graphite)' }}>{STATUS_DOT[it.status]}</span>
                </button>
              ))}
            </div>
          ))}
          <div className="proto-note" style={{ padding: '28px 14px 8px', lineHeight: 1.8 }}>
            原型 · 高保真<br />证据 → 决策 → 产品
          </div>
        </nav>

        {/* ── MAIN WORKSPACE ── */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div key={screen} className="rise-in" style={{ maxWidth: 960, padding: '32px 40px 80px' }}>
            {screens[screen]}
          </div>
        </main>

        {/* ── EVIDENCE & DECISION RAIL ── */}
        <aside className="flex-none overflow-y-auto" style={{ width: 320, borderLeft: '1px solid var(--hairline)', background: 'var(--paper-2)' }}>
          <div className="p-5">
            {evidence ? (
              <>
                <button className="btn-ghost" style={{ marginBottom: 14, padding: '6px 10px' }} onClick={closeEvidence}>← 返回</button>
                <EvidenceCard ev={evidence} />
              </>
            ) : (
              <>
                <div className="micro" style={{ marginBottom: 12 }}>本屏关键证据</div>
                {SCREEN_EVIDENCE[screen].map((id) => <RailEvidence key={id} id={id} />)}
                <div className="hairline-t" style={{ marginTop: 18, paddingTop: 14 }}>
                  <div className="micro" style={{ marginBottom: 8 }}>怎么读</div>
                  <p style={{ fontSize: 12, color: 'var(--graphite)', lineHeight: 1.7, margin: 0 }}>
                    任何带蓝色虚线下划线的数字都可以点击，档案会在这里打开。
                    未归类的数据不允许出现在这个系统里。
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function RailEvidence({ id }: { id: string }) {
  const { openEvidence } = useStore()
  const ev = evById(id)!
  return (
    <button onClick={() => openEvidence(id)}
      style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', borderTop: '1px solid var(--hairline-soft)', padding: '10px 0', cursor: 'pointer' }}>
      <div className="flex items-center justify-between gap-2">
        <span style={{ fontSize: 12, color: 'var(--graphite)' }}>{ev.label}</span>
        <span className="evdot" data-t={ev.type} />
      </div>
      <div className="disp num" style={{ fontSize: 17, fontWeight: 500, marginTop: 2 }}>{ev.value}</div>
    </button>
  )
}

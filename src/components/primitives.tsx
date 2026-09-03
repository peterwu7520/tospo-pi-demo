// Shared primitives — every interactive number speaks the evidence language.
import type { ReactNode } from 'react'
import { useStore } from '../state/store'
import { CHAIN_STAGES, EVIDENCE_TYPE_META, type Evidence, type EvType } from '../data/project'

/* Evidence type display names — 中文 */
export const EV_TYPE_CN: Record<EvType, string> = {
  CONFIRMED: '已证实',
  PROXY: '观察指标',
  ESTIMATE: '推算',
  INFERENCE: '分析结论',
  TARGET: '目标值',
  INTERNAL: '待内部数据',
}

const CONFIDENCE_CN: Record<string, string> = { High: '高', Medium: '中', Low: '低', '—': '—' }

/* Evidence type pill with coded dot */
export function EvPill({ t }: { t: EvType }) {
  return (
    <span className="evpill" title={EVIDENCE_TYPE_META[t].desc}>
      <span className="evdot" data-t={t} />
      {EV_TYPE_CN[t]}
    </span>
  )
}

/* Clickable evidence-bearing value — dotted brass underline, opens dossier */
export function Ev({ id, children }: { id: string; children: ReactNode }) {
  const { openEvidence } = useStore()
  return (
    <button className="ev" onClick={(e) => { e.stopPropagation(); openEvidence(id) }} title="打开证据档案">
      {children}
    </button>
  )
}

/* WHY button — opens a WHY chain or evidence */
export function WhyBtn({ onClick, label = '为什么？' }: { onClick: () => void; label?: string }) {
  return <button className="whybtn" onClick={(e) => { e.stopPropagation(); onClick() }}>{label}</button>
}

/* Numbered section header with hairline */
export function SecHead({ n, title, right }: { n?: string; title: string; right?: ReactNode }) {
  return (
    <div className="sechead">
      {n && <span className="micro" style={{ color: 'var(--brass)' }}>{n}</span>}
      <span className="micro" style={{ fontSize: 11.5, color: 'inherit', fontWeight: 500 }}>{title}</span>
      {right}
    </div>
  )
}

/* 市场 → 需求 → 工程 → 形态 chain */
export function WhyChain({ chain }: { chain: [string, string, string, string] }) {
  return (
    <div>
      {chain.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center" style={{ width: 14, flex: 'none' }}>
            <span className="evdot" style={{ background: i === 3 ? 'var(--brass)' : 'currentColor', opacity: i === 3 ? 1 : 0.4 }} />
            {i < 3 && <span style={{ width: 1, flex: 1, background: 'currentColor', opacity: 0.18, minHeight: 14 }} />}
          </div>
          <div className="pb-4">
            <div className="micro" style={{ marginBottom: 3 }}>{CHAIN_STAGES[i]}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{step}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* Full evidence dossier — identical fields on desktop rail & mobile sheet */
export function EvidenceCard({ ev }: { ev: Evidence }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-3 hairline-b" style={{ marginBottom: 14 }}>
        <span className="micro">证据 #{ev.id.toUpperCase()}</span>
        <EvPill t={ev.type} />
      </div>
      <div className="disp num" style={{ fontSize: 30, lineHeight: 1.1, marginBottom: 4 }}>{ev.value}</div>
      <div style={{ fontSize: 13, marginBottom: 16, color: 'var(--graphite)' }}>{ev.label}</div>
      <dl style={{ margin: 0 }}>
        {([
          ['来源', ev.source],
          ['日期', ev.date],
          ['置信度', CONFIDENCE_CN[ev.confidence] ?? ev.confidence],
          ['推理', ev.reasoning],
        ] as const).map(([k, v]) => (
          <div key={k} className="pb-3" style={{ borderBottom: '1px solid var(--hairline-soft)', marginBottom: 12 }}>
            <dt className="micro" style={{ marginBottom: 3 }}>{k}</dt>
            <dd style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{v}</dd>
            {k === '来源' && (
              ev.url ? (
                <dd style={{ margin: '6px 0 0', fontSize: 12.5 }}>
                  <a href={ev.url} target="_blank" rel="noreferrer"
                    style={{ color: 'var(--brass)', textDecoration: 'none', borderBottom: '1px solid var(--brass)' }}
                    onClick={(e) => e.stopPropagation()}>
                    打开原始来源 ↗
                  </a>
                </dd>
              ) : (
                <dd className="micro" style={{ margin: '6px 0 0', fontSize: 9, opacity: 0.75 }}>
                  {ev.type === 'CONFIRMED' ? '内部实测 / 演示数据，无外部链接' : '分析结论，无外部链接'}
                </dd>
              )
            )}
          </div>
        ))}
        {ev.supports && (
          <div>
            <dt className="micro" style={{ marginBottom: 3, color: 'var(--brass)' }}>支撑决策</dt>
            <dd style={{ margin: 0, fontSize: 13 }}>{ev.supports}</dd>
          </div>
        )}
      </dl>
      <div className="proto-note" style={{ marginTop: 18 }}>每个决策都可溯源。</div>
    </div>
  )
}

/* Legend for the evidence taxonomy */
export function EvLegend() {
  const types: EvType[] = ['CONFIRMED', 'PROXY', 'ESTIMATE', 'INFERENCE', 'TARGET', 'INTERNAL']
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((t) => <EvPill key={t} t={t} />)}
    </div>
  )
}

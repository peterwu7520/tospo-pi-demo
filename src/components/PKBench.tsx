// PK BENCH — 易车式品牌对决。我们的方案 vs 各品牌，逐项参数、胜负高亮。
// Ours column is LIVE: it reads the one configurator state — change the config
// and the PK result changes, including honest losses.
import { useState } from 'react'
import {
  PK_COMPETITORS, PK_ROWS, compPKColumn, ourPKColumn, pkVerdict, pkWinners,
  BRAND_META, type PKColumn,
} from '../data/project'
import { useStore } from '../state/store'
import ProductRender from './ProductRender'

export default function PKBench({ wide = false, compact = false }: { wide?: boolean; compact?: boolean }) {
  const { config, scenario, openEvidence } = useStore()
  const maxComps = compact ? 2 : wide ? 3 : 2
  const [sel, setSel] = useState<string[]>(compact ? ['lam', 'phi'] : wide ? ['bec', 'lam', 'phi'] : ['lam', 'phi'])
  const [diffOnly, setDiffOnly] = useState(false)

  const toggle = (id: string) => {
    if (compact) return
    setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s.slice(-(maxComps - 1)), id])
  }

  const ours = ourPKColumn(config, scenario)
  const cols: PKColumn[] = [ours, ...PK_COMPETITORS.filter((c) => sel.includes(c.id)).map(compPKColumn)]
  const winners = pkWinners(cols)
  const verdict = pkVerdict(cols)
  const rows = compact ? PK_ROWS.filter((r) => ['efficacy', 'pf', 'warranty', 'trust'].includes(r.key)) : PK_ROWS
  const visibleRows = diffOnly
    ? rows.filter((r) => new Set(cols.map((c) => c.cells[r.key].disp)).size > 1)
    : rows

  const labelW = wide ? 128 : 86

  return (
    <div>
      {/* verdict strip */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1" style={{ marginBottom: 14 }}>
        <span className="micro">正面对决 · 同档对比</span>
        <span className="num" style={{ fontSize: 13 }}>
          <strong style={{ color: 'var(--brass)', fontSize: 18 }}>{verdict.win}</strong> 项领先
          · <strong>{verdict.tie}</strong> 项持平
          · <strong style={{ color: verdict.lose ? 'var(--risk)' : 'inherit' }}>{verdict.lose}</strong> 项待办/落后
        </span>
        <span className="micro" style={{ fontSize: 9 }}>如实标注 · 存疑标称不参与胜出</span>
      </div>

      {/* competitor chips — 易车式加选 */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 14 }}>
          <span className="micro" style={{ marginRight: 2 }}>对手（最多{maxComps}）:</span>
          {PK_COMPETITORS.map((c) => {
            const on = sel.includes(c.id)
            return (
              <button key={c.id} onClick={() => toggle(c.id)}
                className="evpill"
                style={{
                  cursor: 'pointer', padding: '5px 10px',
                  borderColor: on ? 'var(--brass)' : 'var(--hairline)',
                  background: on ? 'var(--brass-soft)' : 'none', color: 'inherit',
                }}>
                <span className="evdot" style={{ background: BRAND_META[c.brand].color }} />
                {c.name}
                {on ? ' ✕' : ' +'}
              </button>
            )
          })}
          <label className="micro flex items-center gap-1" style={{ marginLeft: 'auto', cursor: 'pointer' }}>
            <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} style={{ accentColor: 'var(--brass)' }} />
            只看差异
          </label>
        </div>
      )}

      {/* header row */}
      <div style={{ display: 'grid', gridTemplateColumns: `${labelW}px repeat(${cols.length}, 1fr)`, borderTop: '2px solid var(--ink)', borderBottom: '1px solid var(--hairline)' }}>
        <div className="micro" style={{ padding: '10px 6px 8px 0', alignSelf: 'end' }}>VS</div>
        {cols.map((c) => (
          <div key={c.id} style={{ padding: '8px 4px', textAlign: 'center', background: c.ours ? 'var(--brass-soft)' : 'none', borderLeft: c.ours ? '1px solid var(--brass)' : 'none', borderRight: c.ours ? '1px solid var(--brass)' : 'none' }}>
            {c.ours && (
              <ProductRender concept="B" width={wide ? 76 : 54} lit beamDeg={config.beam} cct={config.cct} sensor={config.control === 'Sensor Ready' || config.control === 'DALI'} />
            )}
            <div className="micro" style={{ fontSize: wide ? 10 : 8.5, color: c.ours ? 'var(--brass)' : 'var(--graphite)', marginTop: 4, lineHeight: 1.4 }}>
              {c.ours ? '◈ 我们的方案' : c.name}
            </div>
            {c.ours && <div className="disp num" style={{ fontSize: wide ? 14 : 11.5, fontWeight: 700 }}>{c.name}</div>}
          </div>
        ))}
      </div>

      {/* param rows */}
      {visibleRows.map((r) => (
        <div key={r.key} style={{ display: 'grid', gridTemplateColumns: `${labelW}px repeat(${cols.length}, 1fr)`, borderBottom: '1px solid var(--hairline-soft)' }}>
          <button className="micro" onClick={() => openEvidence(r.ev)}
            style={{ background: 'none', border: 'none', padding: '11px 6px 11px 0', textAlign: 'left', cursor: 'pointer', alignSelf: 'center', fontSize: 9.5 }}>
            {r.label} <span style={{ color: 'var(--brass)' }}>▸</span>
          </button>
          {cols.map((c) => {
            const cell = c.cells[r.key]
            const isWin = winners[r.key].has(c.id)
            const oursLose = c.ours && !isWin
            return (
              <button key={c.id} onClick={() => openEvidence(c.ev)}
                style={{
                  background: isWin ? 'var(--brass-soft)' : c.ours ? 'rgba(0,103,165,0.05)' : 'none',
                  border: 'none', borderLeft: c.ours ? '1px solid var(--brass)' : 'none', borderRight: c.ours ? '1px solid var(--brass)' : 'none',
                  padding: '11px 4px', cursor: 'pointer', textAlign: 'center',
                }}>
                <span className="num" style={{
                  fontSize: wide ? 14 : 12, fontWeight: isWin ? 600 : 400,
                  color: oursLose ? 'var(--risk)' : 'inherit',
                  borderBottom: c.claimed ? '1px dashed var(--risk)' : 'none',
                }}>
                  {cell.disp}
                </span>
                {isWin && !(r.key === 'tisi' && cell.disp === '✓') && <span style={{ color: 'var(--brass)', fontSize: 10 }}> ✓</span>}
                {c.claimed && <div className="micro" style={{ fontSize: 8, color: 'var(--risk)' }}>存疑</div>}
              </button>
            )
          })}
        </div>
      ))}

      <div className="proto-note" style={{ marginTop: 12, lineHeight: 1.8 }}>
        我们的方案列 = 当前配置器实时配置（单一状态）· 虚线 = 标称存疑 · 点任何单元格看证据
      </div>
    </div>
  )
}

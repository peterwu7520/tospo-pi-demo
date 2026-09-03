// StoryDeck v3 — 5 acts, each fact told exactly once:
// ANSWER → WHY NOW → PROOF → VERDICT → NEXT.
// Spec sheet / hotspots / waterfall / full PK table live in PRODUCT / PK / PLAN.
// Shared by Desktop PRESENT mode (wide) and Mobile STORY tab (narrow).
import { useEffect, useState } from 'react'
import {
  ACTS, KILLS, LAB_TESTS, PRODUCTS, PK_COMPETITORS, PK_ROWS,
  bandOf, compPKColumn, fmtTHB, ourPKColumn, pkVerdict, pkWinners,
  type Act, type ProductRec,
} from '../data/project'
import { useStore } from '../state/store'
import { Ev } from './primitives'
import ProductRender from './ProductRender'

export default function StoryDeck({ wide = false, onExit, onOpenBrief, onOpenPK }: {
  wide?: boolean
  onExit?: () => void
  onOpenBrief?: () => void
  onOpenPK?: () => void
}) {
  const [idx, setIdx] = useState(0)
  const act = ACTS[idx]
  const dark = act.dark

  const next = () => setIdx((i) => Math.min(i + 1, ACTS.length - 1))
  const prev = () => setIdx((i) => Math.max(i - 1, 0))

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Escape') onExit?.()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onExit])

  const [touchX, setTouchX] = useState<number | null>(null)

  return (
    <div
      className={`present-stage ${dark ? 'is-dark on-dark' : ''}`}
      style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        transition: 'background .6s ease, color .6s ease', overflow: 'hidden',
      }}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return
        const dx = e.changedTouches[0].clientX - touchX
        if (dx < -48) next()
        if (dx > 48) prev()
        setTouchX(null)
      }}
    >
      {/* top: kicker + progress */}
      <div className="flex items-center gap-4 px-5" style={{ paddingTop: 16, flex: 'none' }}>
        <span className="micro" style={{ color: dark ? 'var(--stone)' : 'var(--graphite)' }}>
          {String(act.n).padStart(2, '0')} / {ACTS.length} {act.kicker && `· ${act.kicker}`}
        </span>
        <div className="flex gap-1" style={{ marginLeft: 'auto' }}>
          {ACTS.map((a, i) => <span key={a.n} className={`tick ${i <= idx ? 'on' : ''}`} />)}
        </div>
        {onExit && <button className="whybtn" style={{ marginLeft: 12 }} onClick={onExit}>退出</button>}
      </div>

      {/* act body */}
      <div key={act.n} className="rise-in" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: wide ? '24px 64px' : '18px 22px' }}>
        <ActBody act={act} wide={wide} onOpenBrief={onOpenBrief} onOpenPK={onOpenPK} />
      </div>

      {/* bottom nav */}
      <div className="flex items-center justify-between px-5" style={{ paddingBottom: 16, flex: 'none' }}>
        <button className="btn-ghost" onClick={prev} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>← 上一页</button>
        <span className="micro" style={{ color: dark ? 'var(--stone)' : 'var(--graphite)' }}>{wide ? '空格 →' : '滑动'}</span>
        <button className="btn-ghost" onClick={next} disabled={idx === ACTS.length - 1} style={{ opacity: idx === ACTS.length - 1 ? 0.3 : 1 }}>下一页 →</button>
      </div>
    </div>
  )
}

/* ─────────────────────────── act renderers ─────────────────────────── */

function ActBody({ act, wide, onOpenBrief, onOpenPK }: {
  act: Act
  wide: boolean
  onOpenBrief?: () => void
  onOpenPK?: () => void
}) {
  const { config, scenario, setConcept, setConfig, openEvidence } = useStore()

  const pick = (p: ProductRec) => { setConcept(p.concept); setConfig({ ...p.config }) }

  switch (act.kind) {
    /* ACT 1 — THE ANSWER: three products, one family. Name / role / price only. */
    case 'answer':
      return (
        <div style={{ maxWidth: wide ? 860 : 420, margin: '0 auto' }}>
          <div className="disp" style={{ fontSize: wide ? 44 : 27, lineHeight: 1.1, fontWeight: 700, textAlign: 'center', margin: '6px 0 4px' }}>
            {act.title}
          </div>
          <div className="micro" style={{ textAlign: 'center', color: 'var(--brass)', marginBottom: 18 }}>
            一个家族 · 三种角色 · 其余的我们已经替你砍掉了
          </div>
          <div className="flex justify-center" style={{ gap: wide ? 36 : 10 }}>
            {PRODUCTS.map((p) => {
              const band = bandOf(p.config)
              const hero = p.id === 'hero150'
              return (
                <button key={p.id} onClick={() => pick(p)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textAlign: 'center', width: wide ? 240 : 118 }}>
                  <div style={{
                    border: hero ? '1.5px solid var(--brass)' : '1px solid var(--hairline-dark)',
                    background: hero ? 'var(--brass-soft)' : 'rgba(240,247,252,0.05)',
                    padding: '10px 4px 2px', borderRadius: 16,
                  }}>
                    <ProductRender concept={p.concept} width={wide ? 200 : 100} lit beamDeg={p.config.beam} cct={p.config.cct} sensor={p.config.control === 'DALI'} />
                  </div>
                  <div className="micro" style={{ marginTop: 8, color: hero ? 'var(--brass)' : 'var(--stone)' }}>
                    {hero && '◈ '}{p.role}
                  </div>
                  <div className="disp num" style={{ fontSize: wide ? 15 : 12, fontWeight: 600 }}>{p.name}</div>
                  <div className="num" style={{ fontSize: wide ? 14 : 12, color: hero ? 'var(--brass)' : 'var(--stone)', marginTop: 2 }}>
                    {fmtTHB(band[0])}–{fmtTHB(band[1]).slice(1)}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="proto-note" style={{ textAlign: 'center', color: 'var(--stone)', marginTop: 20 }}>
            数据长成了产品 · 往右滑，我告诉你为什么
          </div>
        </div>
      )

    /* ACT 2 — WHY NOW: the gap, in the customer's own numbers */
    case 'whynow':
      return (
        <div style={{ maxWidth: 600, marginTop: wide ? 40 : 10 }}>
          <div className="disp" style={{ fontSize: wide ? 46 : 32, fontWeight: 700, marginBottom: 22 }}>{act.title}</div>
          {[
            { k: '光效', a: '90', au: 'lm/W · EVE 现状', b: '130–160+', bu: 'lm/W · 专业层', ev: 'eve-efficacy' },
            { k: '功率因数', a: '0.5', au: 'PF · EVE 现状', b: '≥ 0.9', bu: 'PF · 项目标底线', ev: 'eve-pf' },
            { k: '质保', a: '2Y', au: 'EVE 现状', b: '3–5Y', bu: '专业层基准', ev: 'warranty-bench' },
          ].map((r) => (
            <button key={r.k} onClick={() => openEvidence(r.ev)}
              style={{ display: 'flex', alignItems: 'baseline', gap: 14, width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--hairline-soft)', padding: '14px 0', cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
              <span className="micro" style={{ width: 64, flex: 'none' }}>{r.k}</span>
              <span className="disp num" style={{ fontSize: wide ? 40 : 30, fontWeight: 700, color: 'var(--risk)' }}>{r.a}</span>
              <span style={{ color: 'var(--graphite)', fontSize: 18 }}>→</span>
              <span className="disp num" style={{ fontSize: wide ? 40 : 30, fontWeight: 700 }}>{r.b}</span>
              <span className="micro" style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 9 }}>{r.au}<br />{r.bu}</span>
            </button>
          ))}
          <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 16, color: 'var(--graphite)' }}>{act.body}</p>
          <Ev id="order-flow"><span className="micro" style={{ color: 'var(--brass)' }}>订单正在流向谁 →</span></Ev>
          <div style={{ borderTop: '1px solid var(--hairline-soft)', marginTop: 16, paddingTop: 12, fontSize: 12.5, color: 'var(--graphite)', lineHeight: 1.6 }}>
            <span className="micro" style={{ color: 'var(--risk)' }}>✕ 不做</span>
            <span style={{ marginLeft: 8 }}>我们也替你砍掉了：{KILLS.map((k) => k.what.split('（')[0]).join(' · ')}</span>
          </div>
        </div>
      )

    /* ACT 3 — THE PROOF: the window is real, the claims are not (dark) */
    case 'proof':
      return (
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div className="disp" style={{ fontSize: wide ? 44 : 30, fontWeight: 700, marginBottom: 10 }}>{act.title}</div>
          <p style={{ fontSize: 14, color: 'var(--stone)', marginBottom: 6, lineHeight: 1.7 }}>
            窗口真实存在：<Ev id="price-window">฿1,890–2,190 × 160 lm/W</Ev> ——
            白牌有价格、无可信性能；Philips 有性能、价格翻倍。中间没有人。
          </p>
          <p style={{ fontSize: 14, color: 'var(--stone)', marginBottom: 16, lineHeight: 1.7 }}>
            我们购入热销白牌送实验室拆解，标称普遍虚高 30%+：
          </p>
          {LAB_TESTS.map((t) => (
            <div key={t.sku} className="flex items-baseline gap-3" style={{ borderTop: '1px solid var(--hairline-dark)', padding: '11px 0' }}>
              <span className="micro" style={{ width: wide ? 150 : 108, flex: 'none', color: 'var(--stone)' }}>{t.sku}</span>
              <span className="num" style={{ flex: 1, fontSize: 13.5, textDecoration: 'line-through', textDecorationColor: 'var(--risk)', color: 'var(--stone)' }}>标称 {t.claimed}</span>
              <span className="num" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--bone)' }}>{t.measured}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--hairline-dark)', marginTop: 4, paddingTop: 14, fontSize: 13.5, lineHeight: 1.75 }}>
            EVE 下一代产品的每一页详情，都可以附上<strong style={{ color: 'var(--brass)' }}>实测报告编号</strong> ——
            这是白牌永远无法复制的一行字。
            {act.ev && <span style={{ marginLeft: 8 }}><Ev id={act.ev}><span className="micro" style={{ color: 'var(--brass)' }}>证据 →</span></Ev></span>}
          </div>
        </div>
      )

    /* ACT 4 — VERDICT: the PK outcome. The full table lives in the PK tab. */
    case 'verdict': {
      const cols = [ourPKColumn(config, scenario), ...PK_COMPETITORS.map(compPKColumn)]
      const winners = pkWinners(cols)
      const v = pkVerdict(cols)
      const winRows = PK_ROWS.filter((r) => winners[r.key].has('ours') && winners[r.key].size === 1)
      const tieRows = PK_ROWS.filter((r) => winners[r.key].has('ours') && winners[r.key].size > 1)
      const loseRows = PK_ROWS.filter((r) => !winners[r.key].has('ours'))
      const nameOf = (id: string) => cols.find((c) => c.id === id)?.name ?? id
      const namesOf = (ids: string[]) => ids.length > 1 ? `${nameOf(ids[0])} 等 ${ids.length} 家` : nameOf(ids[0])
      return (
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div className="disp" style={{ fontSize: wide ? 40 : 27, fontWeight: 700, marginBottom: 4 }}>{act.title}</div>
          <div className="micro" style={{ marginBottom: 18, color: 'var(--graphite)' }}>
            EVE NEXT {config.power}W vs 同档三家 · {PK_ROWS.length} 项对决 · 白牌标称存疑不参与胜场
          </div>
          <div className="flex" style={{ gap: wide ? 44 : 28, marginBottom: 18 }}>
            <div>
              <span className="disp num" style={{ fontSize: wide ? 56 : 42, fontWeight: 700, color: 'var(--brass)' }}>{v.win}</span>
              <span className="micro" style={{ marginLeft: 6 }}>胜</span>
            </div>
            <div>
              <span className="disp num" style={{ fontSize: wide ? 56 : 42, fontWeight: 700 }}>{v.tie}</span>
              <span className="micro" style={{ marginLeft: 6 }}>平</span>
            </div>
            <div>
              <span className="disp num" style={{ fontSize: wide ? 56 : 42, fontWeight: 700, color: v.lose > 0 ? 'var(--risk)' : undefined }}>{v.lose}</span>
              <span className="micro" style={{ marginLeft: 6 }}>负</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
            {winRows.map((r) => (
              <span key={r.key} className="evpill" style={{ borderColor: 'var(--brass)', color: 'var(--brass)' }}>{r.label} · 胜</span>
            ))}
          </div>
          {tieRows.map((r) => (
            <div key={r.key} className="flex" style={{ gap: 10, alignItems: 'baseline', borderTop: '1px solid var(--hairline-soft)', padding: '9px 0', fontSize: 13, lineHeight: 1.6 }}>
              <span className="micro" style={{ flex: 'none', minWidth: 96 }}>{r.label} · 平</span>
              <span>与 {namesOf([...winners[r.key]].filter((id) => id !== 'ours'))} 打平（{cols[0].cells[r.key].disp}）</span>
            </div>
          ))}
          {loseRows.map((r) => {
            const w = [...winners[r.key]]
            return (
              <div key={r.key} className="flex" style={{ gap: 10, alignItems: 'baseline', borderTop: '1px solid var(--hairline-soft)', padding: '9px 0', fontSize: 13, lineHeight: 1.6 }}>
                <span className="micro" style={{ flex: 'none', minWidth: 96, color: 'var(--risk)' }}>{r.label} · 负</span>
                <span>{namesOf(w)} {cols.find((c) => c.id === w[0])?.cells[r.key].disp} —— 我们 {cols[0].cells[r.key].disp}，如实标注</span>
              </div>
            )
          })}
          {(onOpenPK ?? onOpenBrief) && (
            <div style={{ marginTop: 20 }}>
              <button className="btn-ink" style={{ padding: '13px 22px' }} onClick={onOpenPK ?? onOpenBrief}>看完整对决 →</button>
            </div>
          )}
        </div>
      )
    }

    /* ACT 5 — NEXT: pick one, sample in 4 weeks */
    case 'next':
      return (
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div className="disp" style={{ fontSize: wide ? 52 : 34, fontWeight: 700, margin: '12px 0 6px' }}>{act.title}</div>
          <p style={{ fontSize: 14, color: 'var(--graphite)', marginBottom: 20 }}>
            选定一款 → TOSPO 输出样品与实测报告 → 通过立项闸门 → 项目启动。
          </p>
          <div className="flex justify-center flex-wrap" style={{ gap: 12 }}>
            {PRODUCTS.map((p) => (
              <button key={p.id} className="btn-ghost" onClick={() => pick(p)} style={{ padding: '12px 18px' }}>
                {p.role} · {p.config.power}W
              </button>
            ))}
          </div>
          {onOpenBrief && (
            <div style={{ marginTop: 22 }}>
              <button className="btn-ink" style={{ padding: '14px 26px' }} onClick={onOpenBrief}>打开方案 →</button>
            </div>
          )}
          <div className="proto-note" style={{ marginTop: 26 }}>TOSPO = 产品共创伙伴</div>
        </div>
      )
  }
}

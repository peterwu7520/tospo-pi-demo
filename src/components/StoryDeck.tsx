// StoryDeck v2 — the persuasion order: ANSWER → PROOF → TRUST → DECIDE.
// Shared by Desktop PRESENT mode (wide) and Mobile STORY tab (narrow).
// Dark register belongs to the product: act 1 opens in the studio, acts 6–7
// return to it for form & proof. Evidence stays one tap away in every act.
import { useEffect, useState } from 'react'
import {
  ACTS, GATES, HOTSPOTS, KILLS, LAB_TESTS, PRODUCTS, TARGET_SPECS,
  bandOf, fmtTHB, scenarioOf, type Act, type ProductRec,
} from '../data/project'
import { useStore } from '../state/store'
import { Ev, EvPill, WhyChain } from './primitives'
import { PricePerfMap, Waterfall } from './charts'
import PKBench from './PKBench'
import ProductRender from './ProductRender'

export default function StoryDeck({ wide = false, onExit, onOpenBrief }: {
  wide?: boolean
  onExit?: () => void
  onOpenBrief?: () => void
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
        {onExit && <button className="whybtn" style={{ marginLeft: 12 }} onClick={onExit}>EXIT</button>}
      </div>

      {/* act body */}
      <div key={act.n} className="rise-in" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: wide ? '24px 64px' : '18px 22px' }}>
        <ActBody act={act} wide={wide} onOpenBrief={onOpenBrief} />
      </div>

      {/* bottom nav */}
      <div className="flex items-center justify-between px-5" style={{ paddingBottom: 16, flex: 'none' }}>
        <button className="btn-ghost" onClick={prev} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>← BACK</button>
        <span className="micro" style={{ color: dark ? 'var(--stone)' : 'var(--graphite)' }}>{wide ? 'SPACE →' : 'SWIPE'}</span>
        <button className="btn-ghost" onClick={next} disabled={idx === ACTS.length - 1} style={{ opacity: idx === ACTS.length - 1 ? 0.3 : 1 }}>NEXT →</button>
      </div>
    </div>
  )
}

/* ─────────────────────────── act renderers ─────────────────────────── */

function ActBody({ act, wide, onOpenBrief }: { act: Act; wide: boolean; onOpenBrief?: () => void }) {
  const { config, scenario, setConcept, setConfig, openEvidence } = useStore()

  const pick = (p: ProductRec) => { setConcept(p.concept); setConfig({ ...p.config }) }

  switch (act.kind) {
    /* ACT 1 — THE ANSWER: three products, one family, first thing seen */
    case 'answer':
      return (
        <div style={{ maxWidth: wide ? 860 : 420, margin: '0 auto' }}>
          <div className="disp" style={{ fontSize: wide ? 44 : 27, lineHeight: 1.1, fontWeight: 700, textAlign: 'center', margin: '6px 0 4px' }}>
            {act.title}
          </div>
          <div className="micro" style={{ textAlign: 'center', color: 'var(--brass)', marginBottom: 18 }}>
            ONE FAMILY · THREE ROLES · 我们只推荐这三款，其余的我们已经替你砍掉了
          </div>
          <div className="flex justify-center" style={{ gap: wide ? 36 : 10 }}>
            {PRODUCTS.map((p) => {
              const band = bandOf(p.config)
              const hero = p.id === 'hero150'
              return (
                <button key={p.id} onClick={() => pick(p)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textAlign: 'center', width: wide ? 240 : 118 }}>
                  <div style={{ border: hero ? '1.5px solid var(--brass)' : '1px solid var(--hairline-dark)', padding: '10px 4px 2px', borderRadius: 3 }}>
                    <ProductRender concept={p.concept} width={wide ? 200 : 100} lit beamDeg={p.config.beam} cct={p.config.cct} sensor={p.config.control === 'DALI'} />
                  </div>
                  <div className="micro" style={{ marginTop: 8, color: hero ? 'var(--brass)' : 'var(--stone)' }}>
                    {hero && '◈ '}{p.role}
                  </div>
                  <div className="disp num" style={{ fontSize: wide ? 15 : 12, fontWeight: 600 }}>{p.name}</div>
                  <div className="num" style={{ fontSize: wide ? 13 : 11, color: 'var(--stone)' }}>
                    {p.config.power}W · 160 lm/W · {fmtTHB(band[0])}–{fmtTHB(band[1]).slice(1)}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="proto-note" style={{ textAlign: 'center', color: 'var(--stone)', marginTop: 20 }}>
            DATA BECAME PRODUCT · 往右滑，我告诉你为什么
          </div>
        </div>
      )

    /* ACT 2 — WHY NOW: the category is moving up without you */
    case 'whynow':
      return (
        <div style={{ maxWidth: 600, marginTop: wide ? 40 : 10 }}>
          <div className="disp" style={{ fontSize: wide ? 46 : 32, fontWeight: 700, marginBottom: 22 }}>{act.title}</div>
          {[
            { k: '光效', a: '90', au: 'lm/W · EVE 现状', b: '130–160+', bu: 'lm/W · Professional 层', ev: 'eve-efficacy' },
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
        </div>
      )

    /* ACT 3 — THE WINDOW: the empty seat, in money terms */
    case 'window':
      return (
        <div style={{ maxWidth: 640 }}>
          <div className="disp num" style={{ fontSize: wide ? 40 : 26, fontWeight: 700, marginBottom: 12 }}>{act.title}</div>
          <PricePerfMap compact={!wide} />
          <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 10 }}>{act.body}</p>
          {act.ev && <Ev id={act.ev}><span className="micro" style={{ color: 'var(--brass)' }}>窗口的证据 →</span></Ev>}
        </div>
      )

    /* ACT 4 — WHY EVE: assets that match the window */
    case 'fit':
      return (
        <div style={{ maxWidth: 600, marginTop: wide ? 40 : 10 }}>
          <div className="disp" style={{ fontSize: wide ? 46 : 32, fontWeight: 700, marginBottom: 20 }}>{act.title}</div>
          {[
            ['TISI 持证主体', 'LED 灯具泰国强制认证，须本地注册公司 —— EVE 具备', 'tisi'],
            ['电商头部心智', '"可信品牌"位置空缺，EVE 的品牌资产正好填进去', 'lab-proof'],
            ['本地仓与渠道流量', '上新成本低、交付快 —— 窗口期里最值钱的两件事', 'eve-assets'],
          ].map(([k, v, ev]) => (
            <button key={k} onClick={() => openEvidence(ev)}
              style={{ display: 'flex', gap: 12, width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--hairline-soft)', padding: '13px 0', cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
              <span style={{ color: 'var(--brass)' }}>✓</span>
              <span style={{ width: 132, flex: 'none', fontWeight: 600, fontSize: 14 }}>{k}</span>
              <span style={{ fontSize: 13, color: 'var(--graphite)', lineHeight: 1.6 }}>{v}</span>
            </button>
          ))}
          <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 18 }}>
            缺口倒过来看就是上探空间：EVE 现在卖 ฿1,290–1,690，窗口在 <Ev id="price-window">฿1,890–2,190</Ev> —— 不相残，只升级。
          </p>
        </div>
      )

    /* ACT 5 — THE HERO: 150W deep-dive, every param has a WHY */
    case 'hero': {
      const hero = PRODUCTS[0]
      const band = bandOf(hero.config)
      const sc = scenarioOf(hero.config)
      return (
        <div style={{ maxWidth: 640 }}>
          <div className="micro" style={{ color: 'var(--brass)', marginBottom: 4 }}>◈ FIRST PRIORITY · {hero.role}</div>
          <div className="disp" style={{ fontSize: wide ? 38 : 26, fontWeight: 700, marginBottom: 14 }}>{act.title}</div>
          {TARGET_SPECS.map((s) => (
            <button key={s.key} onClick={() => openEvidence(s.ev)}
              style={{ display: 'flex', alignItems: 'baseline', gap: 14, width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--hairline-soft)', padding: '9px 0', cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
              <span className="micro" style={{ width: 110, flex: 'none' }}>{s.param}</span>
              <span className="disp num" style={{ fontSize: 18, fontWeight: 500, flex: 1 }}>{s.value}</span>
              <span className="micro" style={{ color: 'var(--brass)' }}>WHY?</span>
            </button>
          ))}
          <div className="flex items-baseline gap-6" style={{ marginTop: 16, borderTop: '2px solid var(--ink)', paddingTop: 12 }}>
            <span className="num disp" style={{ fontSize: 22, fontWeight: 600 }}>{fmtTHB(band[0])}–{fmtTHB(band[1]).slice(1)}</span>
            <span className="num" style={{ color: 'var(--graphite)' }}>成本 ≈ {fmtTHB(sc.targetCost)}</span>
            <EvPill t="TARGET" />
          </div>
        </div>
      )
    }

    /* ACT 6 — HEAD-TO-HEAD: the PK, numbers on the table */
    case 'pk':
      return (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="disp" style={{ fontSize: wide ? 40 : 27, fontWeight: 700, marginBottom: 14 }}>{act.title}</div>
          <PKBench compact />
          {act.ev && <Ev id={act.ev}><span className="micro" style={{ color: 'var(--brass)' }}>可信度这一行怎么来的 →</span></Ev>}
        </div>
      )

    /* ACT 7 — WHY THIS FORM: hotspots (dark) */
    case 'form': {
      return <FormAct wide={wide} />
    }

    /* ACT 7 — THE PROOF: claimed vs measured (dark) */
    case 'proof':
      return (
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div className="disp" style={{ fontSize: wide ? 44 : 30, fontWeight: 700, marginBottom: 8 }}>{act.title}</div>
          <p style={{ fontSize: 14, color: 'var(--stone)', marginBottom: 18, lineHeight: 1.7 }}>
            我们购入热销白牌送实验室拆解。虚标成风，恰恰说明"消费者能相信的品牌"位置空缺。
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

    /* ACT 8 — THE MATH: the scenario, in customer's currency */
    case 'math':
      return (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="disp" style={{ fontSize: wide ? 44 : 30, fontWeight: 700, marginBottom: 4 }}>{act.title}</div>
          <div className="micro" style={{ marginBottom: 10 }}>当前配置：{config.power}W · {config.control} · {config.warranty}Y <EvPill t="ESTIMATE" /></div>
          <Waterfall />
          <div className="flex items-baseline gap-5" style={{ marginTop: 8 }}>
            <span className="micro">TARGET PURCHASE COST</span>
            <span className="disp num" style={{ fontSize: 28, fontWeight: 700, color: 'var(--brass)' }}>{fmtTHB(scenario.targetCost)}</span>
            <span className="num" style={{ color: 'var(--graphite)' }}>≈ FOB ${scenario.targetCostUSD}</span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--graphite)', marginTop: 10 }}>{act.body}</p>
        </div>
      )

    /* ACT 9 — DE-RISK: honesty + gates + kills */
    case 'derisk': {
      const done = GATES.filter((g) => g.status === 'done').length
      return (
        <div style={{ maxWidth: 620 }}>
          <div className="disp" style={{ fontSize: wide ? 42 : 28, fontWeight: 700, marginBottom: 16 }}>{act.title}</div>
          <div className="flex flex-wrap gap-2" style={{ marginBottom: 16 }}>
            {(['CONFIRMED', 'PROXY', 'ESTIMATE', 'INFERENCE', 'TARGET', 'INTERNAL'] as const).map((t) => <EvPill key={t} t={t} />)}
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.75, marginBottom: 14 }}>
            每个数字都有类型与出处；<Ev id="tospo-capability">TOSPO Capability 标的是 INTERNAL DATA REQUIRED</Ev> —— 我们不假装。
            立项前有 {GATES.length} 道闸门，已过 {done} 道：市场验证完成，客户验证进行中。
          </p>
          {KILLS.map((k) => (
            <div key={k.what} className="flex items-baseline gap-3" style={{ borderTop: '1px solid var(--hairline-soft)', padding: '9px 0' }}>
              <span className="micro" style={{ color: 'var(--risk)', flex: 'none' }}>✕ NO-GO</span>
              <span style={{ fontWeight: 500, fontSize: 13.5, width: 200, flex: 'none' }}>{k.what}</span>
              <span style={{ fontSize: 12.5, color: 'var(--graphite)' }}>{k.why}</span>
            </div>
          ))}
        </div>
      )
    }

    /* ACT 10 — NEXT STEP: pick one, sample in 4 weeks */
    case 'next':
      return (
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div className="disp" style={{ fontSize: wide ? 52 : 34, fontWeight: 700, margin: '12px 0 6px' }}>{act.title}</div>
          <p style={{ fontSize: 14, color: 'var(--graphite)', marginBottom: 20 }}>
            选定一款 → TOSPO 输出样品与实测报告 → 通过立项闸门 → PROJECT LAUNCH。
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
              <button className="btn-ink" style={{ padding: '14px 26px' }} onClick={onOpenBrief}>OPEN PRODUCT BRIEF →</button>
            </div>
          )}
          <div className="proto-note" style={{ marginTop: 26 }}>TOSPO = PRODUCT CREATION PARTNER</div>
        </div>
      )
  }
}

/* form act needs its own hotspot state */
function FormAct({ wide }: { wide: boolean }) {
  const { concept, config } = useStore()
  const [hs, setHs] = useState<string | null>(null)
  const hot = HOTSPOTS.find((h) => h.id === hs)
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="disp" style={{ fontSize: wide ? 36 : 24, fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>形态来自工程，工程来自市场</div>
      <div style={{ position: 'relative', maxWidth: wide ? 380 : 290, margin: '0 auto' }}>
        <ProductRender concept={concept} width={wide ? 380 : 290} lit beamDeg={config.beam} cct={config.cct} sensor={config.control === 'Sensor Ready' || config.control === 'DALI'} />
        {HOTSPOTS.map((h) => (
          <button key={h.id} className={`hotspot ${hs === h.id ? 'on' : ''}`}
            style={{ left: `${h.x}%`, top: `${h.y}%` }} onClick={() => setHs(hs === h.id ? null : h.id)}>
            <span className="hs-label">{h.label}</span>
          </button>
        ))}
      </div>
      {hot ? (
        <div className="rise-in" style={{ maxWidth: 420, margin: '14px auto 0', border: '1px solid var(--hairline-dark)', padding: '14px 16px 2px', borderRadius: 3 }}>
          <div className="micro" style={{ color: 'var(--brass)', marginBottom: 8 }}>{hot.label}</div>
          <WhyChain chain={hot.chain} />
        </div>
      ) : (
        <div className="proto-note" style={{ textAlign: 'center', color: 'var(--stone)', marginTop: 10 }}>点产品上的热点 —— 每个形状都有来历</div>
      )}
    </div>
  )
}

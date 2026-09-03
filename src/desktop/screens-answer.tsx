// THE ANSWER — screens 00 & 01. The customer sees the recommendation first;
// all evidence hangs off the products as WHY. This is the PM's proposal,
// not an analyst's status page.
import { KILLS, PRODUCTS, bandOf, fmtTHB, scenarioOf, type ProductRec } from '../data/project'
import { useStore } from '../state/store'
import { Ev, EvPill, SecHead } from '../components/primitives'
import PKBench from '../components/PKBench'
import ProductRender from '../components/ProductRender'
import type { ScreenId } from './DesktopApp'

/* ─────────────────────── 01 PK BENCH (desktop wrapper) ─────────────────────── */
export function PKScreen() {
  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>01 · 我们的建议</div>
      <h1 className="disp" style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 700 }}>我们的方案好在哪里？</h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 24px', maxWidth: 600, fontSize: 14 }}>
        易车式同档对决：逐项参数、胜负高亮、输的项如实标红。
        我们这一列随配置器实时变化 —— 客户改配置，对决结果跟着变。
      </p>
      <PKBench wide />
    </div>
  )
}

export function Recommendation({ go }: { go: (s: ScreenId) => void }) {
  const { setConcept, setConfig, openEvidence } = useStore()

  const pick = (p: ProductRec) => {
    setConcept(p.concept)
    setConfig({ ...p.config })
    go('studio')
  }

  return (
    <div>
      <div className="micro" style={{ marginBottom: 8 }}>00 · 我们的建议</div>
      <h1 className="disp" style={{ fontSize: 38, lineHeight: 1.08, margin: '0 0 8px', fontWeight: 700 }}>
        我们建议 EVE 下一代做这三款。
      </h1>
      <p style={{ color: 'var(--graphite)', margin: '0 0 26px', maxWidth: 620, fontSize: 14.5 }}>
        一张家族脸、一个价格阶梯、三种渠道角色。不是我们列了二十个机会让你挑 ——
        是我们替你砍到三款。每一款都可以追问到底。
      </p>

      {/* the three product cards */}
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {PRODUCTS.map((p) => {
          const band = bandOf(p.config)
          const sc = scenarioOf(p.config)
          const hero = p.id === 'hero150'
          return (
            <div key={p.id} style={{
              border: hero ? '1.5px solid var(--brass)' : '1px solid var(--hairline)',
              background: hero ? 'var(--brass-soft)' : 'transparent',
              borderRadius: 14, overflow: 'hidden',
              padding: '0 0 16px', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ background: 'var(--void)', padding: '18px 10px 6px', position: 'relative' }}>
                {hero && <span className="micro" style={{ position: 'absolute', top: 10, left: 12, color: 'var(--brass)' }}>◈ 第一优先</span>}
                <ProductRender concept={p.concept} width={210} lit beamDeg={p.config.beam} cct={p.config.cct} sensor={p.config.control === 'DALI'} />
              </div>
              <div style={{ padding: '14px 16px 0' }}>
                <div className="flex items-baseline justify-between">
                  <span className="micro" style={{ color: hero ? 'var(--brass)' : 'var(--graphite)' }}>{p.roleEn}</span>
                  <span className="micro" style={{ fontSize: 9 }}>{p.role}</span>
                </div>
                <div className="disp" style={{ fontSize: 17, fontWeight: 700, margin: '4px 0 2px' }}>{p.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--graphite)', lineHeight: 1.55, minHeight: 40 }}>{p.positioning}</div>

                <div className="num" style={{ fontSize: 13, lineHeight: 2, marginTop: 10, borderTop: '1px solid var(--hairline-soft)', paddingTop: 8 }}>
                  {p.config.power}W · {(p.config.power * 160).toLocaleString()} lm · 160 lm/W<br />
                  PF≥0.95 · IP65 · {p.config.beam}° · {p.config.warranty}Y · {p.config.control}
                </div>

                <div className="flex items-baseline justify-between" style={{ marginTop: 10 }}>
                  <div>
                    <div className="micro" style={{ fontSize: 9 }}>零售价 <EvPill t="TARGET" /></div>
                    <div className="disp num" style={{ fontSize: 19, fontWeight: 600 }}>{fmtTHB(band[0])}–{fmtTHB(band[1]).slice(1)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="micro" style={{ fontSize: 9 }}>成本 <EvPill t="ESTIMATE" /></div>
                    <div className="disp num" style={{ fontSize: 19, fontWeight: 600, color: 'var(--brass)' }}>≈{fmtTHB(sc.targetCost)}</div>
                  </div>
                </div>

                <details style={{ marginTop: 12, borderTop: '1px solid var(--hairline-soft)', paddingTop: 10 }}>
                  <summary style={{ listStyle: 'none', cursor: 'pointer' }}>
                    <span className="micro" style={{ color: 'var(--brass)' }}>为什么是这款 ▾</span>
                  </summary>
                  <div style={{ paddingTop: 8 }}>
                    {p.whyThis.map((w, i) => (
                      <div key={i} className="flex gap-2" style={{ fontSize: 12.5, color: 'var(--graphite)', lineHeight: 1.65 }}>
                        <span style={{ color: 'var(--brass)' }}>∵</span>{w}
                      </div>
                    ))}
                    <div className="flex gap-2" style={{ marginTop: 8 }}>
                      {p.evs.map((id) => (
                        <button key={id} className="whybtn" onClick={() => openEvidence(id)}>证据</button>
                      ))}
                    </div>
                  </div>
                </details>

                <button className="btn-ink" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '11px 0' }} onClick={() => pick(p)}>
                  选这款 · 深拆 →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* kills — judgment is also what you cut */}
      <div style={{ marginTop: 34 }}>
        <SecHead n="00.2" title="我们不建议 EVE 现在做" />
        {KILLS.map((k) => (
          <div key={k.what} className="flex items-baseline gap-4" style={{ borderTop: '1px solid var(--hairline-soft)', padding: '9px 0' }}>
            <span className="micro" style={{ color: 'var(--risk)', flex: 'none' }}>✕ 不做</span>
            <span style={{ width: 240, fontWeight: 500, fontSize: 13.5 }}>{k.what}</span>
            <span style={{ color: 'var(--graphite)', fontSize: 13 }}>{k.why}</span>
          </div>
        ))}
      </div>

      {/* why you can trust this recommendation */}
      <div style={{ marginTop: 34 }}>
        <SecHead n="00.3" title="为什么可以相信这个建议" />
        <div className="grid grid-cols-3 gap-6" style={{ fontSize: 13, lineHeight: 1.7 }}>
          <div>
            <div className="micro" style={{ marginBottom: 4, color: 'var(--brass)' }}>实测文化</div>
            白牌标称 <Ev id="lab-proof">160 lm/W，我们实测 ≈112</Ev>。TOSPO 实验室拆解，不看广告看疗效。
          </div>
          <div>
            <div className="micro" style={{ marginBottom: 4 }}>数据分级</div>
            每个数字都带六级证据标注；<Ev id="price-window">哪些是事实、哪些是推算</Ev>，一目了然。
          </div>
          <div>
            <div className="micro" style={{ marginBottom: 4, color: 'var(--ev-internal)' }}>缺数据直说</div>
            <Ev id="tospo-capability">TOSPO 能力匹配 = 需内部数据</Ev> —— 承认不知道，比假装知道更可信。
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between hairline-t" style={{ paddingTop: 20 }}>
        <span className="micro">想追问 "为什么是这个方向"？</span>
        <button className="btn-ink" onClick={() => go('market')}>为什么是这个方向 →</button>
      </div>
    </div>
  )
}

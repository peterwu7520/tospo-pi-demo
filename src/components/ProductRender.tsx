// Product render — code-drawn SVG highbay luminaire, lighting-industry edition.
// Signature: the emitted light itself is UI — beam cone follows config.beam,
// tint follows config.cct. ONE FAMILY: shared hook, driver-cap geometry,
// fin rhythm, optical ring, CMF. THREE STRATEGIES: A reduced / B hero / C modular.
import { useId } from 'react'
import type { ConceptId } from '../data/project'

interface Fin { x1: number; y1: number; x2: number; y2: number; w: number; tone: number }

function finsFor(concept: ConceptId): Fin[] {
  const cx = 200
  const topY = 148
  const rimY = 262
  const count = concept === 'A' ? 11 : concept === 'B' ? 19 : 15
  const out: Fin[] = []
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const ang = Math.PI * (0.12 + 0.76 * t)
    const rimX = cx + Math.cos(ang) * 148
    const topX = cx + Math.cos(ang) * 34
    if (concept === 'C') {
      const moduleIdx = Math.floor(t * 5)
      const local = (t * 5) % 1
      if (local > 0.82 && moduleIdx < 5) continue
    }
    out.push({ x1: topX, y1: topY, x2: rimX, y2: rimY - Math.sin(ang) * 6, w: concept === 'A' ? 3.2 : 2.4, tone: i % 2 })
  }
  return out
}

const CCT_TINT: Record<number, string> = {
  4000: '#FFDFA8',
  5000: '#FFF3DC',
  6500: '#E8F0FF',
}

export default function ProductRender({
  concept, width = 400, sensor = false, lit = false, beamDeg = 90, cct = 5000,
}: {
  concept: ConceptId; width?: number; sensor?: boolean; lit?: boolean; beamDeg?: number; cct?: number
}) {
  const uid = useId().replace(/[:]/g, '')
  const fins = finsFor(concept)
  const brass = '#B08D3E'
  const tint = CCT_TINT[cct] ?? CCT_TINT[5000]

  // beam cone geometry — real beam angle drives the drawing
  const halfRad = ((beamDeg / 2) * Math.PI) / 180
  const hw = Math.min(150 * Math.tan(halfRad), 186)
  const floorY = 448

  return (
    <svg viewBox={lit ? '0 0 400 472' : '0 0 400 340'} width={width} role="img" aria-label={`Concept ${concept} highbay render`}
      style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFCBC1" />
          <stop offset="38%" stopColor="#8F8B82" />
          <stop offset="72%" stopColor="#4A463E" />
          <stop offset="100%" stopColor="#23211C" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B7B3A9" />
          <stop offset="55%" stopColor="#6E6A61" />
          <stop offset="100%" stopColor="#2E2B26" />
        </linearGradient>
        <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3A3833" />
          <stop offset="50%" stopColor="#9B978D" />
          <stop offset="100%" stopColor="#3A3833" />
        </linearGradient>
        <radialGradient id={`lens-${uid}`} cx="0.5" cy="0.35" r="0.8">
          <stop offset="0%" stopColor={lit ? tint : '#F4EFE3'} />
          <stop offset="60%" stopColor="#B9B2A2" />
          <stop offset="100%" stopColor="#4C463C" />
        </radialGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.42" />
          <stop offset="70%" stopColor={tint} stopOpacity="0.10" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`pool-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={tint} stopOpacity="0.55" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* emitted light — the signature of a lighting tool */}
      {lit && (
        <g key={`${beamDeg}-${cct}`} className="rise-in">
          <path d={`M ${200 - 52} 296 L ${200 - hw} ${floorY} Q 200 ${floorY + 16} ${200 + hw} ${floorY} L ${200 + 52} 296 Z`}
            fill={`url(#beam-${uid})`} />
          <ellipse cx="200" cy={floorY} rx={hw} ry="13" fill={`url(#pool-${uid})`} />
          <text x="384" y={floorY - 14} textAnchor="end"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', fill: tint, opacity: 0.85 }}>
            {beamDeg}° · {cct}K
          </text>
        </g>
      )}
      {!lit && <ellipse cx="200" cy="322" rx="120" ry="10" fill="#000" opacity="0.28" />}

      {/* HOOK — shared family interface */}
      <path d="M200 8 c-10 0 -14 7 -14 14 v10 h28 v-10 c0 -7 -4 -14 -14 -14 z" fill="none" stroke="#9B978D" strokeWidth="4" />
      <rect x="188" y="34" width="24" height="14" rx="3" fill={`url(#cap-${uid})`} />

      {/* DRIVER CAP — shared geometry, C adds module seams */}
      <path d="M162 52 L238 52 L252 96 Q200 112 148 96 Z" fill={`url(#cap-${uid})`} />
      <path d="M162 52 L238 52 L240 60 L160 60 Z" fill="#D8D4CA" opacity="0.5" />
      {/* neck — connects driver cap to fin dome */}
      <path d="M172 100 L228 100 L224 146 L176 146 Z" fill={`url(#cap-${uid})`} />
      <line x1="176" y1="142" x2="224" y2="142" stroke="#17140F" strokeWidth="1.2" opacity="0.5" />
      {concept === 'C' && (
        <>
          <line x1="176" y1="54" x2="170" y2="98" stroke="#17140F" strokeWidth="1.4" opacity="0.7" />
          <line x1="224" y1="54" x2="230" y2="98" stroke="#17140F" strokeWidth="1.4" opacity="0.7" />
          <rect x="240" y="66" width="16" height="9" rx="2" fill="#2A2721" stroke="#55504A" strokeWidth="0.8" />
        </>
      )}

      {/* FIN DOME — radial rhythm */}
      <path d="M52 262 Q56 160 200 142 Q344 160 348 262 Q200 296 52 262 Z" fill={`url(#metal-${uid})`} />
      {fins.map((f, i) => (
        <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
          stroke={f.tone ? '#1E1C17' : '#5A564D'} strokeWidth={f.w} opacity={f.tone ? 0.55 : 0.5} strokeLinecap="round" />
      ))}
      <path d="M62 240 Q80 172 168 150" fill="none" stroke="#E7E3D8" strokeWidth="1.6" opacity="0.55" />

      {/* rim band */}
      <path d="M52 262 Q200 296 348 262 L348 272 Q200 308 52 272 Z" fill={`url(#rim-${uid})`} />

      {/* OPTICAL RING — family anchor; brass on B, plain on A, segmented on C */}
      {concept === 'B' ? (
        <ellipse cx="200" cy="284" rx="86" ry="14" fill="none" stroke={brass} strokeWidth="4" />
      ) : concept === 'C' ? (
        <>
          <path d="M114 284 A86 14 0 0 1 286 284" fill="none" stroke={brass} strokeWidth="4" strokeDasharray="34 10" />
          <path d="M286 284 A86 14 0 0 1 114 284" fill="none" stroke="#6E6A61" strokeWidth="4" strokeDasharray="34 10" />
        </>
      ) : (
        <ellipse cx="200" cy="284" rx="86" ry="14" fill="none" stroke="#55504A" strokeWidth="4" />
      )}

      {/* lens — lit by its own light */}
      <ellipse cx="200" cy="290" rx="70" ry="12" fill={`url(#lens-${uid})`} opacity="0.95" />
      <ellipse cx="200" cy="289" rx="44" ry="7.5" fill={lit ? tint : '#F7F3E8'} opacity={lit ? 0.95 : 0.85} />

      {/* SENSOR POD — Concept C / Sensor Ready */}
      {(concept === 'C' || sensor) && (
        <g>
          <rect x="190" y="300" width="20" height="12" rx="3" fill="#2A2721" stroke="#55504A" strokeWidth="0.8" />
          <circle cx="200" cy="314" r="5" fill="#1E1C17" stroke={brass} strokeWidth="1.2" />
        </g>
      )}
    </svg>
  )
}

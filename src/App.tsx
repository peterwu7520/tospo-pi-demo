// App shell — ONE INTELLIGENCE LAYER, TWO NATIVE EXPERIENCES.
// Device toggle is prototype chrome: it demonstrates that Desktop and Mobile
// are two different native experiences over the same data model.
import { useEffect, useState } from 'react'
import { StoreProvider, useStore } from './state/store'
import DesktopApp from './desktop/DesktopApp'
import MobileApp from './mobile/MobileApp'
import StoryDeck from './components/StoryDeck'

type Device = 'desktop' | 'mobile'

function Shell() {
  const { presenting, setPresenting } = useStore()
  const [device, setDevice] = useState<Device>(() => (window.innerWidth < 900 ? 'mobile' : 'desktop'))
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const onResize = () => {
      setScale(Math.min(1, (window.innerHeight - 72) / 880, (window.innerWidth - 40) / 420))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div style={{ height: '100dvh', overflow: 'hidden' }}>
      {device === 'desktop' ? (
        <DesktopApp />
      ) : (
        <div className="flex flex-col items-center justify-center" style={{ height: '100%', background: 'var(--void)', gap: 14 }}>
          <div className="micro mobile-label" style={{ color: 'var(--stone)' }}>手机原生体验 — 探索 · 演示 · 决策</div>
          <div className="phone" style={{ transform: `scale(${scale})`, flex: 'none' }}>
            <MobileApp />
          </div>
        </div>
      )}

      {/* prototype device switcher */}
      <div className="seg" style={{ position: 'fixed', right: 18, bottom: 16, zIndex: 90, background: 'var(--paper)', boxShadow: '0 6px 24px rgba(10,34,51,.18)' }}>
        {(['desktop', 'mobile'] as const).map((d) => (
          <button key={d} className={device === d ? 'on' : ''} onClick={() => setDevice(d)}>
            {d === 'desktop' ? '电脑版' : '手机版'}
          </button>
        ))}
      </div>

      {/* PRESENT mode — fullscreen interactive story, navigation disappears */}
      {presenting && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <StoryDeck wide onExit={() => setPresenting(false)} onOpenBrief={() => setPresenting(false)} />
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}

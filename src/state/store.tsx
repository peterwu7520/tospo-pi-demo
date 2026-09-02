// ONE STATE — the only state store. Every screen is a view over it.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  DEFAULT_ADJ, DEFAULT_CONFIG, EVIDENCE, lumenOf, risksOf, scenarioOf,
  type ConceptId, type Config, type Evidence, type RiskFlag, type CommercialScenario, type ScenarioAdj,
} from '../data/project'

interface Store {
  concept: ConceptId
  setConcept: (c: ConceptId) => void
  config: Config
  setConfig: (patch: Partial<Config>) => void
  resetConfig: () => void
  adj: ScenarioAdj
  setAdj: (patch: Partial<ScenarioAdj>) => void
  evidence: Evidence | null
  openEvidence: (id: string) => void
  closeEvidence: () => void
  presenting: boolean
  setPresenting: (v: boolean) => void
  // derived
  lumen: number
  scenario: CommercialScenario
  risks: RiskFlag[]
  isDelta: (key: keyof Config) => boolean
  deltaCount: number
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [concept, setConcept] = useState<ConceptId>('B')
  const [config, setConfigState] = useState<Config>({ ...DEFAULT_CONFIG })
  const [adj, setAdjState] = useState<ScenarioAdj>({ ...DEFAULT_ADJ })
  const [evidenceId, setEvidenceId] = useState<string | null>(null)
  const [presenting, setPresenting] = useState(false)

  const setConfig = (patch: Partial<Config>) => setConfigState((c) => ({ ...c, ...patch }))
  const setAdj = (patch: Partial<ScenarioAdj>) => setAdjState((a) => ({ ...a, ...patch }))
  const resetConfig = () => setConfigState({ ...DEFAULT_CONFIG })
  const openEvidence = (id: string) => setEvidenceId(id)
  const closeEvidence = () => setEvidenceId(null)

  const value = useMemo<Store>(() => {
    const lumen = lumenOf(config)
    const scenario = scenarioOf(config, adj)
    const risks = risksOf(config)
    const isDelta = (key: keyof Config) => config[key] !== DEFAULT_CONFIG[key]
    const deltaCount = (Object.keys(DEFAULT_CONFIG) as (keyof Config)[]).filter((k) => config[k] !== DEFAULT_CONFIG[k]).length
    return {
      concept, setConcept,
      config, setConfig, resetConfig,
      adj, setAdj,
      evidence: EVIDENCE.find((e) => e.id === evidenceId) ?? null,
      openEvidence, closeEvidence,
      presenting, setPresenting,
      lumen, scenario, risks, isDelta, deltaCount,
    }
  }, [concept, config, adj, evidenceId, presenting])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside provider')
  return s
}

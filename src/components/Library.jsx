import { useMemo, useState } from 'react'
import { initialState } from '../engine/animation'
import { maxScore } from '../engine/game'
import { personalise, pitchName, shirtOf, suitsPosition } from '../profile'
import { medalFor, todayISO } from '../progress'
import { load, save } from '../storage'
import { FAZY, FUNDAMENTY, GRUPY, POZIOMY, POZYCJE, faza, filterScenarios, fundament, fundamentyOf } from '../taxonomy'
import Pitch from './Pitch'
import { Medal } from './ProgressScreen'

const TABS = [
  { id: '', label: 'Wszystkie' },
  { id: 'atak', label: 'Atak' },
  { id: 'obrona', label: 'Obrona' },
  { id: 'przejscia', label: 'Przejścia' },
  { id: 'stale-fragmenty', label: 'Stałe fragmenty' },
]

const EMPTY = { q: '', faza: '', fundament: '', pozycja: '', liczebnosc: '', poziom: '', status: '' }

const groupOf = (sc) => fundament(sc.stages[0].fundament)?.grupa ?? 'inne'

/** All situations, by phase of play and fundamental, with filters — built for hundreds of situations. */
export default function Library({ scenarios, profile, progress, onPlay }) {
  const [f, setF] = useState(() => {
    try {
      return { ...EMPTY, ...load('filters', {}) }
    } catch {
      return EMPTY
    }
  })
  const set = (patch) => {
    const next = { ...f, ...patch }
    setF(next)
    save('filters', next)
  }
  const today = todayISO()
  const keysOf = (sc) => sc.stages.map((st) => `${sc.id}/${st.id}`)
  const played = (sc) => keysOf(sc).some((k) => progress.items[k])
  const due = (sc) => keysOf(sc).some((k) => progress.items[k]?.due <= today)

  const list = useMemo(() => filterScenarios(scenarios, f, { played, due }), [scenarios, f, progress]) // eslint-disable-line react-hooks/exhaustive-deps
  const counts = (tab) => filterScenarios(scenarios, { faza: tab }).length
  const numbers = [...new Set(scenarios.map((s) => s.liczebnosc))].sort()
  const active = Object.entries(f).some(([k, v]) => v && k !== 'faza')
  const groups = GRUPY.map((g) => ({ ...g, items: list.filter((sc) => groupOf(sc) === g.id) })).filter((g) => g.items.length)

  return (
    <section aria-label="Biblioteka sytuacji">
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={f.faza === t.id} className={`tab ${f.faza === t.id ? 'tab-on' : ''}`} onClick={() => set({ faza: t.id })}>
            {t.label} <span className="opacity-60">{counts(t.id)}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <input className="select lg:col-span-2" type="search" placeholder="Szukaj: np. asekuracja, 2 na 1…" value={f.q} onChange={(e) => set({ q: e.target.value })} aria-label="Szukaj sytuacji" />
        <select className="select" value={f.fundament} onChange={(e) => set({ fundament: e.target.value })} aria-label="Fundament">
          <option value="">Wszystkie fundamenty</option>
          {GRUPY.map((g) => (
            <optgroup key={g.id} label={g.label}>
              {FUNDAMENTY.filter((x) => x.grupa === g.id).map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <select className="select" value={f.pozycja} onChange={(e) => set({ pozycja: e.target.value })} aria-label="Pozycja">
          <option value="">Każda pozycja</option>
          {POZYCJE.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <select className="select" value={f.liczebnosc} onChange={(e) => set({ liczebnosc: e.target.value })} aria-label="Liczebność">
          <option value="">Każda liczebność</option>
          {numbers.map((n) => (
            <option key={n} value={n}>
              {n.replace('v', ' na ')}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <select className="select" value={f.poziom} onChange={(e) => set({ poziom: e.target.value })} aria-label="Poziom">
            <option value="">Poziom</option>
            {POZIOMY.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select className="select" value={f.status} onChange={(e) => set({ status: e.target.value })} aria-label="Status">
            <option value="">Wszystkie</option>
            <option value="nowe">Nierozegrane</option>
            <option value="powtorki">Do powtórki</option>
          </select>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <span>
          {list.length} {list.length === 1 ? 'sytuacja' : list.length % 10 >= 2 && list.length % 10 <= 4 && (list.length < 10 || list.length > 20) ? 'sytuacje' : 'sytuacji'}
        </span>
        {profile?.position && profile.position !== 'wszystkie' && f.pozycja !== profile.position && (
          <button type="button" className="btn-chip" onClick={() => set({ pozycja: profile.position })}>
            Tylko moja pozycja
          </button>
        )}
        {active && (
          <button type="button" className="btn-chip" onClick={() => set({ ...EMPTY, faza: f.faza })}>
            Wyczyść filtry
          </button>
        )}
      </div>

      {groups.length === 0 && (
        <div className="panel mt-4 text-center text-slate-400">
          {f.faza === 'stale-fragmenty' ? 'Sytuacje ze stałych fragmentów gry są w przygotowaniu.' : 'Brak sytuacji dla tych filtrów.'}
        </div>
      )}

      {groups.map((g) => (
        <div key={g.id} className="mt-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">{g.label}</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {g.items.map((sc) => (
              <ScenarioCard key={sc.id} sc={sc} profile={profile} progress={progress} onPlay={onPlay} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function ScenarioCard({ sc, profile, progress, onPlay }) {
  const best = load(`best:${sc.id}`, null)
  const mine = profile?.position && profile.position !== 'wszystkie' && suitsPosition(sc, profile)
  return (
    <article className="panel flex gap-3 !p-3" data-testid="scenario-card">
      <div className="w-28 shrink-0 sm:w-32">
        <Pitch entities={personalise(sc.entities, profile)} world={initialState(sc)} label={`Podgląd: ${sc.title}`} homeShirt={shirtOf(profile)} youLabel={pitchName(profile)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h4 className="font-extrabold leading-tight text-white">{sc.title}</h4>
        <p className="line-clamp-2 text-xs leading-snug text-slate-400">{sc.subtitle}</p>
        <div className="flex flex-wrap gap-1">
          {mine && <span className="tag-sm !bg-lime-400/15 !text-lime-300">Twoja pozycja</span>}
          <span className="tag-sm">{faza(sc.faza)?.label}</span>
          <span className="tag-sm">{sc.liczebnosc.replace('v', ' na ')}</span>
          <span className="tag-sm">{sc.level}</span>
        </div>
        <p className="line-clamp-1 text-xs text-slate-500">{fundamentyOf(sc).map((id) => fundament(id)?.label).join(' · ')}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="flex items-center gap-1" aria-label="Medale">
            {sc.stages.map((st) => (
              <Medal key={st.id} small medal={medalFor(progress.items[`${sc.id}/${st.id}`])} />
            ))}
            {best != null && (
              <span className="ml-1 text-[11px] text-slate-500">
                {best}/{maxScore(sc)}
              </span>
            )}
          </span>
          <button type="button" className="btn-primary !min-h-[38px] !px-4 text-sm" onClick={() => onPlay(sc.id)}>
            Graj
          </button>
        </div>
      </div>
    </article>
  )
}

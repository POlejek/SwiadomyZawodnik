import { useMemo, useRef, useState } from 'react'
import { DAILY_XP, comesBack, itemKey } from '../progress'
import { findScenario } from '../scenarios'
import GameScreen from './GameScreen'

const MIN_SECONDS = 8
const STEP = 3

/**
 * Daily training: a few single decisions in a row. The decision time follows the player:
 * every best answer shortens it by a few seconds ("tempo meczu"), any other answer brings it back.
 */
export default function TrainingSession({ items, profile, baseSeconds, progress, onDecision, onWhatIfAll, onFinish, onExit }) {
  const [index, setIndex] = useState(0)
  const [seconds, setSeconds] = useState(baseSeconds)
  const [results, setResults] = useState([])
  const [done, setDone] = useState(false)
  const finished = useRef(false)
  const item = items[index]
  const scenario = useMemo(() => findScenario(item?.scenarioId), [item])

  const decision = (r) => {
    onDecision(r)
    setResults((cur) => [...cur, { ...r, key: itemKey(r.scenarioId, r.stageId) }])
    if (baseSeconds) setSeconds((s) => (r.quality === 3 ? Math.max(MIN_SECONDS, s - STEP) : baseSeconds))
  }

  const next = () => {
    if (index + 1 < items.length) setIndex(index + 1)
    else {
      setDone(true)
      if (!finished.current) {
        finished.current = true
        onFinish()
      }
    }
  }

  if (done) return <TrainingSummary items={items} results={results} progress={progress} onExit={onExit} seconds={seconds} baseSeconds={baseSeconds} />

  return (
    <GameScreen
      key={`${index}-${item.key}`}
      scenario={scenario}
      single={{ stageIndex: item.stageIndex }}
      sessionLabel={`Trening dnia · ${index + 1}/${items.length}${baseSeconds ? ` · tempo ${seconds} s` : ''}${item.repeat ? ' · powtórka' : ''}`}
      decisionSeconds={seconds}
      profile={profile}
      onDecision={decision}
      onWhatIfAll={onWhatIfAll}
      onSingleDone={next}
      onExit={onExit}
    />
  )
}

function TrainingSummary({ items, results, progress, onExit, seconds, baseSeconds }) {
  const best = results.filter((r) => r.quality === 3).length
  const xp = results.reduce((s, r) => s + (r.points ?? 0), 0) + DAILY_XP
  const today = progress.trainingDays[progress.trainingDays.length - 1]
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8" data-testid="training-summary">
      <div className="panel space-y-5 text-center">
        <p className="eyebrow">Trening dnia ukończony</p>
        <p className="text-5xl font-black text-white">
          {best}
          <span className="text-2xl text-slate-500"> / {items.length}</span>
        </p>
        <p className="text-slate-300">najlepszych decyzji za pierwszym razem</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="tag !bg-lime-400/15 !text-lime-300">+{xp} XP</span>
          {baseSeconds > 0 && seconds < baseSeconds && <span className="tag">Tempo meczu: {seconds} s na decyzję</span>}
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {items.map((it) => {
          const r = results.find((x) => x.key === it.key)
          const tone = r?.quality === 3 ? 'bg-lime-400' : r?.quality > 0 ? 'bg-amber-400' : 'bg-red-500'
          return (
            <div key={it.key} className="panel flex items-center gap-3 !p-3">
              <span className={`h-3 w-3 shrink-0 rounded-full ${tone}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{it.title}</p>
                <p className="truncate text-xs text-slate-400">{it.scenarioTitle}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">wróci {comesBack(progress.items[it.key], today)}</span>
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-center text-sm text-slate-400">Błędne decyzje wrócą jutro — tak najlepiej się zapamiętuje.</p>
      <div className="mt-6 flex justify-center">
        <button type="button" className="btn-primary" onClick={onExit}>
          Wróć do menu
        </button>
      </div>
    </div>
  )
}

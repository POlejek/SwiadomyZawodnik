import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { endState, eventsAt, stateAt } from '../engine/animation'
import { DECISION_SECONDS, choiceResult, currentStage, gameReducer, maxScore, startGame, stars } from '../engine/game'
import { load, save } from '../storage'
import Pitch from './Pitch'
import { useClipPlayer } from './useClipPlayer'

const LETTERS = ['A', 'B', 'C', 'D']

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GameScreen({ scenario, timerOn, onExit }) {
  const [state, dispatch] = useReducer(gameReducer, scenario, (s) => startGame(s))
  const stage = currentStage(state)
  const entities = scenario.entities
  const result = choiceResult(stage, state.choice)

  // Which clip is playing, and from which world state it starts.
  const playing = state.phase === 'intro' || state.phase === 'outcome'
  const clip = state.phase === 'intro' ? stage.intro : state.phase === 'outcome' ? result.clip : null
  const clipStart = state.phase === 'intro' ? state.introStart : state.questionState

  const { t, skip } = useClipPlayer(clip, {
    active: playing,
    playKey: `${state.runId}-${state.playId}-${state.phase}`,
    speed: state.slow ? 0.5 : 1,
    hold: state.phase === 'outcome' ? 1.1 : 0.15,
    onEnd: () => dispatch({ type: state.phase === 'intro' ? 'INTRO_DONE' : 'OUTCOME_DONE' }),
  })

  const world = useMemo(() => {
    if (playing && clip) return stateAt(clip, clipStart, entities, Math.min(t, clip.duration))
    if (state.phase === 'feedback' || state.phase === 'summary') return endState(result?.clip, state.questionState, entities)
    return state.questionState
  }, [playing, clip, clipStart, entities, t, state.phase, state.questionState, result])

  // Each caption goes to the end of the pitch away from where the ball is when it appears.
  const placedEvents = useMemo(
    () =>
      clip && {
        events: (clip.events ?? []).map((ev) => ({
          ...ev,
          pos: stateAt(clip, clipStart, entities, ev.t).ball.y < 24 ? 'bottom' : 'top',
        })),
      },
    [clip, clipStart, entities],
  )
  const captions = playing && clip ? eventsAt(placedEvents, t) : []
  const highlights = state.phase === 'feedback' ? result.highlights : []

  // Answers in random order every run, so players learn the football, not the button position.
  const options = useMemo(() => shuffle(stage.options), [stage, state.runId])

  // Decision clock.
  const [elapsed, setElapsed] = useState(0)
  const askedAt = useRef(0)
  useEffect(() => {
    if (state.phase !== 'question') return undefined
    askedAt.current = performance.now()
    setElapsed(0)
    if (!timerOn) return undefined
    const id = setInterval(() => {
      const ms = performance.now() - askedAt.current
      setElapsed(ms)
      if (ms >= DECISION_SECONDS * 1000) {
        clearInterval(id)
        dispatch({ type: 'TIMEOUT' })
      }
    }, 100)
    return () => clearInterval(id)
  }, [state.phase, state.playId, timerOn])

  const choose = (optionId) =>
    dispatch({ type: 'CHOOSE', optionId, timeMs: performance.now() - askedAt.current, timerOn })

  // Keyboard: 1–4 or A–D picks an answer.
  useEffect(() => {
    if (state.phase !== 'question') return undefined
    const onKey = (e) => {
      const k = e.key.toUpperCase()
      const i = '1234'.includes(k) && k !== '' ? Number(k) - 1 : LETTERS.indexOf(k)
      if (i >= 0 && i < options.length) choose(options[i].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Remember the best score.
  useEffect(() => {
    if (state.phase !== 'summary') return
    const best = load(`best:${scenario.id}`, 0)
    if (state.score > best) save(`best:${scenario.id}`, state.score)
  }, [state.phase, state.score, scenario.id])

  if (state.phase === 'summary') {
    return <Summary state={state} onRestart={() => dispatch({ type: 'RESTART' })} onExit={onExit} />
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8">
      <TopBar scenario={scenario} state={state} onExit={onExit} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <div className="pitch-frame">
          <Pitch entities={entities} world={world} highlights={highlights} captions={captions} />
          <Legend />
        </div>
        <section className="panel" aria-label="Decyzja">
          {state.phase === 'intro' && <Watching onSkip={skip} stage={stage} />}
          {state.phase === 'question' && (
            <Question stage={stage} options={options} onChoose={choose} timerOn={timerOn} elapsed={elapsed} />
          )}
          {state.phase === 'outcome' && <Playing result={result} choice={state.choice} slow={state.slow} onSkip={skip} />}
          {state.phase === 'feedback' && (
            <Feedback
              stage={stage}
              result={result}
              choice={state.choice}
              tries={state.attempts[stage.id] ?? 0}
              last={state.stageIndex === scenario.stages.length - 1}
              dispatch={dispatch}
            />
          )}
        </section>
      </div>
    </div>
  )
}

function TopBar({ scenario, state, onExit }) {
  return (
    <header className="flex items-center gap-3 py-4">
      <button type="button" onClick={onExit} className="btn-ghost" aria-label="Wróć do listy sytuacji">
        ←
      </button>
      <div className="min-w-0 flex-1">
        <p className="eyebrow">{scenario.category}</p>
        <h1 className="truncate text-lg font-extrabold leading-tight text-white sm:text-xl">{scenario.title}</h1>
      </div>
      <ol className="flex items-center gap-1.5" aria-label="Etapy">
        {scenario.stages.map((s, i) => {
          const r = state.results.find((x) => x.stageId === s.id)
          const cls =
            i === state.stageIndex ? 'step-current' : r ? (r.correct ? 'step-good' : 'step-bad') : i < state.stageIndex ? 'step-bad' : 'step-todo'
          return (
            <li key={s.id} className={`step ${cls}`} title={s.title}>
              <span className="sr-only">
                Etap {i + 1}: {s.title}
              </span>
            </li>
          )
        })}
      </ol>
      <div className="score" aria-label={`Punkty: ${state.score}`}>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">pkt</span>
        <span className="tabular-nums">{state.score}</span>
      </div>
    </header>
  )
}

function Legend() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-slate-400">
      <span className="flex items-center gap-1.5">
        <i className="dot bg-blue-600 ring-2 ring-yellow-300" /> Ty (nr 4)
      </span>
      <span className="flex items-center gap-1.5">
        <i className="dot bg-blue-600" /> Twoja drużyna
      </span>
      <span className="flex items-center gap-1.5">
        <i className="dot bg-red-600" /> Rywale
      </span>
      <span className="flex items-center gap-1.5">
        <i className="dot bg-yellow-400" /> Bramkarz
      </span>
    </div>
  )
}

function Watching({ stage, onSkip }) {
  return (
    <div className="space-y-4">
      <p className="eyebrow">{stage.title}</p>
      <p className="text-lg font-semibold text-slate-200">Obserwuj sytuację…</p>
      <p className="text-sm text-slate-400">Za chwilę akcja się zatrzyma i podejmiesz decyzję.</p>
      <button type="button" className="btn-secondary" onClick={onSkip}>
        Pomiń animację
      </button>
    </div>
  )
}

function Question({ stage, options, onChoose, timerOn, elapsed }) {
  const left = Math.max(0, DECISION_SECONDS - elapsed / 1000)
  const pct = (left / DECISION_SECONDS) * 100
  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">{stage.title}</p>
        <h2 className="mt-1 text-lg font-bold leading-snug text-white sm:text-xl">{stage.question}</h2>
      </div>
      {timerOn && (
        <div className="flex items-center gap-3" aria-label={`Pozostały czas: ${Math.ceil(left)} s`}>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${left < 3 ? 'bg-red-500' : 'bg-lime-400'}`} style={{ width: `${pct}%` }} />
          </div>
          <span className={`w-8 text-right text-sm font-bold tabular-nums ${left < 3 ? 'text-red-400' : 'text-slate-300'}`}>
            {Math.ceil(left)}s
          </span>
        </div>
      )}
      <div className="grid gap-2.5">
        {options.map((o, i) => (
          <button key={o.id} type="button" className="answer" onClick={() => onChoose(o.id)}>
            <span className="answer-key">{LETTERS[i]}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
      <p className="hidden text-xs text-slate-500 sm:block">Skrót: klawisze 1–4 lub A–D</p>
    </div>
  )
}

function Playing({ result, choice, slow, onSkip }) {
  return (
    <div className="space-y-4">
      <p className="eyebrow">{choice.timedOut ? 'Koniec czasu' : choice.revealed ? 'Dobra decyzja' : slow ? 'Powtórka' : 'Twoja decyzja'}</p>
      <p className="text-lg font-semibold text-white">{choice.timedOut ? 'Nie zdążyłeś zdecydować…' : result.label}</p>
      <button type="button" className="btn-secondary" onClick={onSkip}>
        Pomiń animację
      </button>
    </div>
  )
}

function Feedback({ stage, result, choice, tries, last, dispatch }) {
  const primary = useRef(null)
  useEffect(() => primary.current?.focus(), [])
  const good = result.correct
  const badge = choice.revealed ? 'Tak należało zagrać' : good ? 'Dobra decyzja' : choice.timedOut ? 'Za późno' : 'Zła decyzja'
  return (
    <div className="space-y-4" data-testid="feedback">
      <div className={`badge ${good ? 'badge-good' : 'badge-bad'}`}>
        <span aria-hidden>{good ? '✓' : choice.timedOut ? '⏱' : '✗'}</span> {badge}
      </div>
      <h2 className={`text-2xl font-extrabold leading-tight ${good ? 'text-lime-300' : 'text-red-300'}`}>{result.outcome}</h2>
      {!choice.timedOut && (
        <p className="text-sm text-slate-400">
          {choice.revealed ? 'Dobra decyzja' : 'Twój wybór'}: <span className="text-slate-200">{result.label}</span>
        </p>
      )}
      <p className="leading-relaxed text-slate-200">{result.feedback}</p>
      {good && (
        <div className="rounded-lg border border-lime-400/30 bg-lime-400/10 p-3 text-sm leading-relaxed text-lime-100">
          <span className="font-bold text-lime-300">Zasada: </span>
          {stage.lesson}
        </div>
      )}
      <div className="flex flex-wrap gap-2 pt-1">
        {good ? (
          <button ref={primary} type="button" className="btn-primary" onClick={() => dispatch({ type: 'NEXT' })}>
            {last ? 'Podsumowanie' : 'Dalej'} →
          </button>
        ) : (
          <button ref={primary} type="button" className="btn-primary" onClick={() => dispatch({ type: 'RETRY' })}>
            Spróbuj jeszcze raz
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={() => dispatch({ type: 'REPLAY' })}>
          Powtórka (zwolnione tempo)
        </button>
        {!good && tries >= 2 && (
          <button type="button" className="btn-secondary" onClick={() => dispatch({ type: 'REVEAL' })}>
            Pokaż dobrą decyzję
          </button>
        )}
      </div>
    </div>
  )
}

function Summary({ state, onRestart, onExit }) {
  const { scenario } = state
  const s = stars(state)
  const good = state.results.filter((r) => r.correct).length
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8" data-testid="summary">
      <button type="button" onClick={onExit} className="btn-ghost mb-4" aria-label="Wróć do listy sytuacji">
        ←
      </button>
      <div className="panel space-y-6 text-center">
        <p className="eyebrow">{scenario.title} · podsumowanie</p>
        <div className="flex justify-center gap-2 text-4xl" aria-label={`${s} z 3 gwiazdek`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < s ? 'text-yellow-300' : 'text-slate-700'}>
              ★
            </span>
          ))}
        </div>
        <div>
          <p className="text-5xl font-extrabold tabular-nums text-white">{state.score}</p>
          <p className="text-sm text-slate-400">na {maxScore(scenario)} możliwych punktów</p>
        </div>
        <p className="text-slate-300">
          Dobre decyzje za pierwszym razem: <b className="text-white">{good}</b> z {scenario.stages.length}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {scenario.stages.map((st, i) => {
          const r = state.results.find((x) => x.stageId === st.id)
          const label = r?.timedOut ? 'Brak decyzji (koniec czasu)' : st.options.find((o) => o.id === r?.optionId)?.label
          return (
            <div key={st.id} className="panel !p-4 text-left">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${r?.correct ? 'bg-lime-400 text-slate-900' : 'bg-red-500 text-white'}`}>
                  {r?.correct ? '✓' : '✗'}
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="font-bold text-white">
                    {i + 1}. {st.title}
                  </p>
                  <p className="text-sm text-slate-400">Twoja pierwsza decyzja: {label}</p>
                  <p className="text-sm leading-relaxed text-slate-300">{st.lesson}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" className="btn-primary" onClick={onRestart}>
          Zagraj ponownie
        </button>
        <button type="button" className="btn-secondary" onClick={onExit}>
          Inne sytuacje
        </button>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { endState, eventsAt, stateAt } from '../engine/animation'
import { GRADES, choiceResult, currentStage, gameReducer, maxScore, quality, singleStage, startGame, stars } from '../engine/game'
import { prepareRun } from '../engine/variants'
import { randomSeed, seeded, shuffleWith } from '../rng'
import { MoveIcon, iconFor } from '../icons'
import { personalise, pitchName, shirtOf } from '../profile'
import { buzz, canSpeak, playSound, speak, stopSpeaking } from '../sound'
import { faza, fundament, grupa } from '../taxonomy'
import { load, save } from '../storage'
import Pitch from './Pitch'
import { useClipPlayer } from './useClipPlayer'

const LETTERS = ['A', 'B', 'C', 'D']


const toneOf = (grade) => GRADES[grade]?.tone ?? 'bad'

/**
 * One situation. With `single` ({ stageIndex }) it plays just that stage (daily training) and calls onSingleDone.
 * Callbacks report progress: onDecision (first attempt of a stage), onWhatIfAll, onComplete (whole situation).
 */
export default function GameScreen({
  scenario: baseScenario,
  decisionSeconds,
  onExit,
  profile,
  single,
  sessionLabel,
  onDecision,
  onWhatIfAll,
  onComplete,
  onSingleDone,
  seed,
  challenge,
  onChallenge,
}) {
  const timerOn = decisionSeconds > 0
  // Every run is a fresh version: random cue variants and, half of the time, the mirrored side of the pitch.
  // Every run has a seed: the same seed replays the same version (used by challenge links).
  const prepare = () => {
    const runSeed = challenge?.seed ?? seed ?? randomSeed()
    const run = { ...prepareRun(baseScenario, seeded(runSeed)), seed: runSeed }
    return single ? singleStage(run, single.stageIndex) : run
  }
  const [state, dispatch] = useReducer(gameReducer, null, () => startGame(prepare()))
  const restart = () => dispatch({ type: 'START', scenario: prepare() })
  const { scenario } = state
  const stage = currentStage(state)
  const entities = useMemo(() => personalise(scenario.entities, profile), [scenario.entities, profile])
  const shirt = shirtOf(profile)
  const youLabel = pitchName(profile)
  const result = choiceResult(stage, state.choice)

  // Which clip is playing, and from which world state it starts.
  const playing = state.phase === 'intro' || state.phase === 'outcome'
  const clip = state.phase === 'intro' ? stage.intro : state.phase === 'outcome' ? result.clip : null
  const clipStart = state.phase === 'intro' ? state.introStart : state.questionState
  const playKey = `${state.runId}-${state.playId}-${state.phase}`

  const { t, skip } = useClipPlayer(clip, {
    active: playing,
    playKey,
    speed: state.slow ? 0.5 : 1,
    hold: state.phase === 'outcome' ? 1.1 : 0.15,
    onEnd: () => dispatch({ type: state.phase === 'intro' ? 'INTRO_DONE' : 'OUTCOME_DONE' }),
  })

  const world = useMemo(() => {
    if (playing && clip) return stateAt(clip, clipStart, entities, Math.min(t, clip.duration), scenario.facingUp)
    if (state.phase === 'feedback' || state.phase === 'summary') return endState(result?.clip, state.questionState, entities, scenario.facingUp)
    return state.questionState
  }, [playing, clip, clipStart, entities, t, state.phase, state.questionState, result, scenario.facingUp])

  // Each caption goes to the end of the pitch away from where the ball is when it appears.
  const placedEvents = useMemo(
    () =>
      clip && {
        events: (clip.events ?? []).map((ev) => ({
          ...ev,
          pos: stateAt(clip, clipStart, entities, ev.t, scenario.facingUp).ball.y < 24 ? 'bottom' : 'top',
        })),
      },
    [clip, clipStart, entities, scenario.facingUp],
  )
  const captions = playing && clip ? eventsAt(placedEvents, t) : []
  const highlights = state.phase === 'feedback' ? result.highlights : []

  // Sounds: kick-off whistle, goals and fouls as they happen on the pitch, a short cue for the verdict.
  const heard = useRef(new Set())
  useEffect(() => {
    if (state.phase === 'intro' && state.stageIndex === 0 && !heard.current.has(`ko-${state.runId}`)) {
      heard.current.add(`ko-${state.runId}`)
      playSound('whistle')
    }
  }, [state.phase, state.stageIndex, state.runId])
  useEffect(() => {
    for (const c of captions) {
      const key = `${playKey}-${c.t}-${c.text}`
      if (heard.current.has(key)) continue
      heard.current.add(key)
      if (c.text === 'GOL') playSound(c.tone === 'good' ? 'goalFor' : 'goalAgainst')
      else if (c.text.startsWith('Faul')) playSound('whistle')
    }
  })
  useEffect(() => {
    if (state.phase !== 'feedback' || state.choice?.whatIf) return
    const tone = toneOf(result.quality)
    playSound(tone)
    if (tone === 'bad') buzz(80)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.playId])

  // Answers in random order every run, so players learn the football, not the button position.
  const options = useMemo(() => shuffleWith(stage.options, seeded(scenario.seed * 31 + state.stageIndex + 1)), [stage, scenario.seed, state.stageIndex])

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
      if (ms >= decisionSeconds * 1000) {
        clearInterval(id)
        stopSpeaking()
        dispatch({ type: 'TIMEOUT' })
      }
    }, 100)
    return () => clearInterval(id)
  }, [state.phase, state.playId, decisionSeconds, timerOn])

  const choose = (optionId) => {
    stopSpeaking()
    dispatch({ type: 'CHOOSE', optionId, timeMs: performance.now() - askedAt.current, seconds: decisionSeconds })
  }
  useEffect(() => () => stopSpeaking(), [])

  // Keyboard: 1–4 or A–D picks an answer.
  useEffect(() => {
    if (state.phase !== 'question') return undefined
    const onKey = (e) => {
      const k = e.key.toUpperCase()
      const i = k.length === 1 && '1234'.includes(k) ? Number(k) - 1 : LETTERS.indexOf(k)
      if (i >= 0 && i < options.length) choose(options[i].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Progress: every first attempt, watching all the other outcomes, finishing the situation.
  const reported = useRef(0)
  useEffect(() => {
    if (state.results.length < reported.current) reported.current = 0 // new run
    for (const r of state.results.slice(reported.current)) onDecision?.({ ...r, scenarioId: baseScenario.id, seconds: decisionSeconds })
    reported.current = state.results.length
  }, [state.results, baseScenario.id, onDecision, decisionSeconds])
  useEffect(() => {
    if (state.solved && state.explored.length === stage.options.length - 1) onWhatIfAll?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.explored.length])
  useEffect(() => {
    if (state.phase !== 'summary') return
    if (single) {
      onSingleDone?.(state)
      return
    }
    const best = load(`best:${scenario.id}`, 0)
    if (state.score > best) save(`best:${scenario.id}`, state.score)
    onComplete?.(baseScenario.id, state.score, stars(state))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.runId])

  if (state.phase === 'summary') {
    if (single) return null
    return <Summary state={state} onRestart={restart} onExit={onExit} challenge={challenge} onChallenge={onChallenge} />
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8">
      <TopBar scenario={scenario} state={state} onExit={onExit} sessionLabel={sessionLabel} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <div className="pitch-frame">
          <Pitch entities={entities} world={world} highlights={highlights} captions={captions} homeShirt={shirt} youLabel={youLabel} />
          <Legend entities={entities} shirt={shirt} youLabel={youLabel} />
        </div>
        <section className="panel" aria-label="Decyzja">
          {state.phase === 'intro' && <Watching onSkip={skip} stage={stage} />}
          {state.phase === 'question' && (
            <Question stage={stage} options={options} onChoose={choose} seconds={decisionSeconds} elapsed={elapsed} />
          )}
          {state.phase === 'outcome' && <Playing result={result} choice={state.choice} slow={state.slow} onSkip={skip} />}
          {state.phase === 'feedback' && (
            <Feedback
              key={`${state.playId}-${state.choice?.optionId}`}
              stage={stage}
              state={state}
              result={result}
              last={state.stageIndex === scenario.stages.length - 1}
              single={!!single}
              dispatch={dispatch}
            />
          )}
        </section>
      </div>
    </div>
  )
}

function stepClass(r) {
  if (!r) return 'step-bad'
  return { good: 'step-good', mid: 'step-mid', bad: 'step-bad' }[toneOf(r.quality)]
}

function TopBar({ scenario, state, onExit, sessionLabel }) {
  const stage = currentStage(state)
  return (
    <header className="flex items-center gap-3 py-4">
      <button type="button" onClick={onExit} className="btn-ghost" aria-label="Wróć do listy sytuacji">
        ←
      </button>
      <div className="min-w-0 flex-1">
        <p className="eyebrow">{sessionLabel ?? `${faza(scenario.faza)?.label} · ${fundament(stage.fundament)?.label}`}</p>
        <h1 className="truncate text-lg font-extrabold leading-tight text-white sm:text-xl">{scenario.title}</h1>
      </div>
      <ol className="flex items-center gap-1.5" aria-label="Etapy">
        {scenario.stages.map((s, i) => {
          const r = state.results.find((x) => x.stageId === s.id)
          const cls = i === state.stageIndex ? 'step-current' : i < state.stageIndex ? stepClass(r) : 'step-todo'
          return (
            <li key={s.id} className={`step ${cls}`} title={s.title}>
              <span className="sr-only">
                Etap {i + 1}: {s.title}
              </span>
            </li>
          )
        })}
      </ol>
      {!scenario.single && <div className="score" aria-label={`Punkty: ${state.score}`}>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">pkt</span>
        <span className="tabular-nums">{state.score}</span>
      </div>}
    </header>
  )
}

function Legend({ entities, shirt, youLabel }) {
  const you = entities.find((e) => e.you)
  const has = (team) => entities.some((e) => e.team === team && !e.you)
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-slate-400">
      <span className="flex items-center gap-1.5">
        <i className="dot ring-2 ring-yellow-300" style={{ background: shirt.fill }} /> {youLabel === 'TY' ? 'Ty' : youLabel} (nr {you.number})
      </span>
      {has('home') && (
        <span className="flex items-center gap-1.5">
          <i className="dot" style={{ background: shirt.fill }} /> Twoja drużyna
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <i className="dot bg-red-600" /> Rywale
      </span>
      {has('homeGK') && (
        <span className="flex items-center gap-1.5">
          <i className="dot bg-yellow-400" /> Twój bramkarz
        </span>
      )}
      {has('awayGK') && (
        <span className="flex items-center gap-1.5">
          <i className="dot bg-gray-900 ring-1 ring-slate-300" /> Bramkarz rywali
        </span>
      )}
    </div>
  )
}

function Watching({ stage, onSkip }) {
  return (
    <div className="space-y-4">
      <p className="eyebrow">{stage.title}</p>
      <p className="text-lg font-semibold text-slate-200">Obserwuj sytuację…</p>
      <p className="text-sm text-slate-400">Patrz, co robią rywale. Za chwilę akcja się zatrzyma i podejmiesz decyzję.</p>
      <button type="button" className="btn-secondary" onClick={onSkip}>
        Pomiń animację
      </button>
    </div>
  )
}

function Question({ stage, options, onChoose, seconds, elapsed }) {
  const timerOn = seconds > 0
  const left = Math.max(0, seconds - elapsed / 1000)
  const pct = timerOn ? (left / seconds) * 100 : 0
  const readAloud = () => speak([stage.question, ...options.map((o, i) => `${LETTERS[i]}. ${o.label}.`)].join(' '))
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow">{stage.title}</p>
          {canSpeak() && (
            <button type="button" className="btn-chip" onClick={readAloud} aria-label="Przeczytaj pytanie na głos">
              <span aria-hidden>🔊</span> Przeczytaj
            </button>
          )}
        </div>
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
            <span className="flex-1">{o.label}</span>
            {iconFor(o) && <MoveIcon name={iconFor(o)} className="h-6 w-6 shrink-0 text-slate-400" />}
          </button>
        ))}
      </div>
      <p className="hidden text-xs text-slate-500 sm:block">Skrót: klawisze 1–4 lub A–D</p>
    </div>
  )
}

function Playing({ result, choice, slow, onSkip }) {
  const eyebrow = choice.timedOut
    ? 'Koniec czasu'
    : choice.whatIf
      ? 'Co by było, gdyby…'
      : choice.revealed
        ? 'Najlepsza decyzja'
        : slow
          ? 'Powtórka'
          : 'Twoja decyzja'
  return (
    <div className="space-y-4">
      <p className="eyebrow">{eyebrow}</p>
      <p className="text-lg font-semibold text-white">{choice.timedOut ? 'Nie zdążyłeś zdecydować…' : result.label}</p>
      <button type="button" className="btn-secondary" onClick={onSkip}>
        Pomiń animację
      </button>
    </div>
  )
}

const TONE_CLASSES = {
  good: { badge: 'badge-good', title: 'text-lime-300', icon: '✓' },
  mid: { badge: 'badge-mid', title: 'text-amber-300', icon: '~' },
  bad: { badge: 'badge-bad', title: 'text-red-300', icon: '✗' },
}

function Feedback({ stage, state, result, last, single, dispatch }) {
  const { choice, solved } = state
  const primary = useRef(null)
  useEffect(() => primary.current?.focus(), [])
  const tone = toneOf(result.quality)
  const cls = TONE_CLASSES[tone]
  const tries = state.attempts[stage.id] ?? 0
  const badge = choice.whatIf
    ? `Co by było, gdyby… · ${GRADES[result.quality].label}`
    : choice.revealed
      ? 'Tak należało zagrać'
      : choice.timedOut
        ? 'Za późno'
        : GRADES[result.quality].label
  const others = solved ? stage.options.filter((o) => o.id !== solved.optionId) : []

  return (
    <div className="space-y-4" data-testid="feedback">
      <div className={`badge ${choice.whatIf ? 'badge-info' : cls.badge}`}>
        <span aria-hidden>{choice.whatIf ? '?' : choice.timedOut ? '⏱' : cls.icon}</span> {badge}
      </div>
      <h2 className={`text-2xl font-extrabold leading-tight ${cls.title}`}>{result.outcome}</h2>
      {!choice.timedOut && (
        <p className="text-sm text-slate-400">
          {choice.whatIf ? 'Gdybyś wybrał' : choice.revealed ? 'Najlepsza decyzja' : 'Twój wybór'}:{' '}
          <span className="text-slate-200">{result.label}</span>
        </p>
      )}
      <p className="leading-relaxed text-slate-200">{result.feedback}</p>
      {result.correct && !choice.whatIf && <PrincipleBox stage={stage} />}
      {!result.correct && !choice.whatIf && fundament(stage.fundament)?.sygnal && (
        <div className="rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-sm leading-relaxed text-sky-100" data-testid="hint">
          <span className="font-bold text-sky-300">Podpowiedź — {fundament(stage.fundament).label.toLowerCase()}. Sygnał: </span>
          {fundament(stage.fundament).sygnal}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {choice.whatIf ? (
          <button ref={primary} type="button" className="btn-primary" onClick={() => dispatch({ type: 'BACK' })}>
            ← Wróć do najlepszej decyzji
          </button>
        ) : solved ? (
          <button ref={primary} type="button" className="btn-primary" onClick={() => dispatch({ type: 'NEXT' })}>
            {last && !single ? 'Podsumowanie' : 'Dalej'} →
          </button>
        ) : (
          <button ref={primary} type="button" className="btn-primary" onClick={() => dispatch({ type: 'RETRY' })}>
            {result.quality > 0 ? 'Poszukaj lepszej decyzji' : 'Spróbuj jeszcze raz'}
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={() => dispatch({ type: 'REPLAY' })}>
          Powtórka (zwolnione tempo)
        </button>
        {!solved && tries >= 2 && (
          <button type="button" className="btn-secondary" onClick={() => dispatch({ type: 'REVEAL' })}>
            Pokaż najlepszą decyzję
          </button>
        )}
      </div>

      {solved && (
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <p className="text-sm font-bold text-white">
            Co by było, gdyby…{' '}
            <span className="font-normal text-slate-400">
              (obejrzane {state.explored.length} z {others.length})
            </span>
          </p>
          <div className="grid gap-2">
            {others.map((o) => {
              const seen = state.explored.includes(o.id)
              const current = choice.whatIf && choice.optionId === o.id
              return (
                <button
                  key={o.id}
                  type="button"
                  className={`whatif ${current ? 'whatif-current' : ''}`}
                  onClick={() => dispatch({ type: 'WHATIF', optionId: o.id })}
                  disabled={current}
                >
                  <span aria-hidden className={`whatif-dot ${seen ? `whatif-dot-${toneOf(quality(o))}` : ''}`} />
                  <span>{o.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/** The game principle behind the decision, in the club's own words where its slides give them. */
function PrincipleBox({ stage }) {
  const z = fundament(stage.fundament)
  return (
    <div className="space-y-2 rounded-lg border border-lime-400/30 bg-lime-400/10 p-3 text-sm leading-relaxed text-lime-100" data-testid="principle">
      <p className="text-[11px] font-bold uppercase tracking-wider text-lime-300">
        {grupa(z.grupa)?.label} · {z.nr}. {z.label}
        {z.odWieku ? ` (od ${z.odWieku})` : ''}
      </p>
      <p>{stage.lesson}</p>
      {z.sygnal && (
        <dl className="grid gap-1 border-t border-lime-400/20 pt-2 text-xs text-lime-50/90">
          <div>
            <dt className="inline font-bold text-lime-300">Sygnał: </dt>
            <dd className="inline">{z.sygnal}</dd>
          </div>
          <div>
            <dt className="inline font-bold text-lime-300">Kluczowe zachowanie: </dt>
            <dd className="inline">{z.zachowanie}</dd>
          </div>
        </dl>
      )}
    </div>
  )
}

function Summary({ state, onRestart, onExit, challenge, onChallenge }) {
  const { scenario } = state
  const s = stars(state)
  const best = state.results.filter((r) => r.correct).length
  const [sent, setSent] = useState('')
  const send = async () => setSent(await onChallenge({ scenarioId: scenario.id, seed: scenario.seed, score: state.score, stars: s }))
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
          Najlepsze decyzje za pierwszym razem: <b className="text-white">{best}</b> z {scenario.stages.length}
        </p>
        {!challenge && <p className="text-sm text-slate-400">Zagraj jeszcze raz — sytuacja może potoczyć się inaczej albo drugą stroną boiska.</p>}
      </div>

      {challenge && <Duel challenge={challenge} score={state.score} stars={s} />}

      {onChallenge && (
        <div className="panel mt-4 flex flex-wrap items-center justify-between gap-3 !p-4" data-testid="challenge-box">
          <div className="min-w-0">
            <p className="font-bold text-white">{challenge ? 'Odpowiedz rewanżem' : 'Wyzwij kolegę'}</p>
            <p className="text-sm text-slate-400">
              {challenge
                ? 'Wyślij swój wynik — kolega zagra tę samą wersję jeszcze raz.'
                : 'Kolega zagra dokładnie tę samą wersję sytuacji, z tym samym czasem. Kto zdobędzie więcej punktów?'}
            </p>
            {sent && <p className="mt-1 text-sm text-lime-300">{sent}</p>}
          </div>
          <button type="button" className="btn-primary" onClick={send}>
            {challenge ? 'Wyślij rewanż' : 'Wyzwij kolegę'}
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {scenario.stages.map((st, i) => {
          const r = state.results.find((x) => x.stageId === st.id)
          const label = r?.timedOut ? 'Brak decyzji (koniec czasu)' : st.options.find((o) => o.id === r?.optionId)?.label
          const tone = toneOf(r?.quality ?? 0)
          const dot = { good: 'bg-lime-400 text-slate-900', mid: 'bg-amber-400 text-slate-900', bad: 'bg-red-500 text-white' }[tone]
          return (
            <div key={st.id} className="panel !p-4 text-left">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${dot}`}>
                  {TONE_CLASSES[tone].icon}
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

function Duel({ challenge, score, stars: myStars }) {
  const result = score > challenge.score ? 'win' : score === challenge.score ? 'draw' : 'lose'
  const head = { win: 'Wygrałeś pojedynek!', draw: 'Remis!', lose: 'Tym razem lepszy był kolega' }[result]
  const color = { win: 'text-lime-300', draw: 'text-sky-300', lose: 'text-amber-300' }[result]
  const starRow = (n) => `${'★'.repeat(n)}${'☆'.repeat(3 - n)}`
  return (
    <div className="panel mt-4 text-center" data-testid="duel">
      <p className="eyebrow">Pojedynek</p>
      <p className={`mt-1 text-2xl font-extrabold ${color}`}>{head}</p>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-300">Ty</p>
          <p className="text-4xl font-black tabular-nums text-white">{score}</p>
          <p className="text-yellow-300">{starRow(myStars)}</p>
        </div>
        <p className="text-2xl font-black text-slate-600">:</p>
        <div>
          <p className="truncate text-sm font-semibold text-slate-300">
            {challenge.from}
            {challenge.number ? ` (nr ${challenge.number})` : ''}
          </p>
          <p className="text-4xl font-black tabular-nums text-white">{challenge.score}</p>
          <p className="text-yellow-300">{starRow(challenge.stars)}</p>
        </div>
      </div>
      {result === 'lose' && <p className="mt-3 text-sm text-slate-400">Zagraj jeszcze raz tę samą wersję i spróbuj go pobić.</p>}
    </div>
  )
}

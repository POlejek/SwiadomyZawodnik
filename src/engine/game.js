import { endState, initialState } from './animation'

// Game flow for one scenario:
//   intro (stage animation) → question (frozen, clock running) → outcome (answer animation) → feedback
//   feedback → NEXT (best answer)  → next stage intro, or summary after the last stage
//   feedback → RETRY (any other)   → same question again;  REVEAL → plays the best answer (no points)
//   feedback after the best answer → WHATIF → "what if I had chosen…": plays another answer; BACK returns

export const DECISION_OPTIONS = [15, 25, 40, 0] // seconds; 0 = no time limit
export const DEFAULT_DECISION_SECONDS = 25
export const POINTS_CORRECT = 100
export const POINTS_SPEED_MAX = 50

// Age groups set a sensible decision time: younger players read more slowly.
export const AGE_GROUPS = [
  { id: 'u11', label: 'U11–U12', seconds: 40 },
  { id: 'u13', label: 'U13–U14', seconds: 25 },
  { id: 'u15', label: 'U15–U16', seconds: 15 },
]

// How good a decision is: 3 best (moves the action on), 2 good, 1 weak, 0 wrong.
export const GRADES = {
  3: { label: 'Najlepsza decyzja', tone: 'good' },
  2: { label: 'Dobra decyzja, ale jest lepsza', tone: 'mid' },
  1: { label: 'Słaba decyzja', tone: 'mid' },
  0: { label: 'Zła decyzja', tone: 'bad' },
}

export function quality(option) {
  if (option.correct) return 3
  return option.quality ?? 0
}

export function currentStage(state) {
  return state.scenario.stages[state.stageIndex]
}

export function correctOption(stage) {
  return stage.options.find((o) => o.correct)
}

/** What happened after a decision: the clip to play and the texts to show. */
export function choiceResult(stage, choice) {
  if (!choice) return null
  if (choice.timedOut) {
    const tm = stage.timeout
    const opt = tm.optionId ? stage.options.find((o) => o.id === tm.optionId) : null
    return {
      correct: false,
      quality: 0,
      clip: tm.clip ?? opt.clip,
      label: 'Brak decyzji',
      outcome: tm.outcome ?? opt?.outcome,
      feedback: tm.feedback,
      highlights: tm.highlights ?? opt?.highlights ?? [],
    }
  }
  const opt = stage.options.find((o) => o.id === choice.optionId)
  return {
    correct: !!opt.correct,
    quality: quality(opt),
    clip: opt.clip,
    label: opt.label,
    outcome: opt.outcome,
    feedback: opt.feedback,
    highlights: opt.highlights ?? [],
  }
}

function enterStage(base, stageIndex, introStart) {
  const stage = base.scenario.stages[stageIndex]
  const questionState = endState(stage.intro, introStart, base.scenario.entities, base.scenario.facingUp)
  return {
    ...base,
    stageIndex,
    introStart,
    questionState,
    phase: stage.intro ? 'intro' : 'question',
    choice: null,
    solved: null,
    explored: [],
    playId: base.playId + 1,
    slow: false,
  }
}

/** World at the start of stage k when every earlier stage was played well (for practising one stage on its own). */
export function stageStartState(scenario, k) {
  let s = initialState(scenario)
  for (const st of scenario.stages.slice(0, k)) {
    s = endState(st.intro, s, scenario.entities, scenario.facingUp)
    s = endState(correctOption(st).clip, s, scenario.entities, scenario.facingUp)
  }
  return s
}

/** One stage of a scenario as its own short game. */
export function singleStage(scenario, k) {
  return { ...scenario, stages: [scenario.stages[k]], startState: stageStartState(scenario, k), single: true }
}

export function startGame(scenario, runId = 0) {
  const base = {
    scenario,
    runId,
    score: 0,
    attempts: {},
    results: [],
    playId: 0,
  }
  return enterStage(base, 0, scenario.startState ?? initialState(scenario))
}

/** Points for a first attempt: by the grade, and with a clock up to POINTS_SPEED_MAX extra for a fast decision. */
export function points(grade, timeMs, seconds) {
  if (!grade) return 0
  const share = grade / 3
  const base = Math.round(POINTS_CORRECT * share)
  if (!seconds || timeMs == null) return base
  const left = Math.max(0, 1 - timeMs / (seconds * 1000))
  return base + Math.round(POINTS_SPEED_MAX * left * share)
}

function decide(state, choice, timeMs, seconds) {
  const stage = currentStage(state)
  const tries = state.attempts[stage.id] ?? 0
  const result = choiceResult(stage, choice)
  let { score, results } = state
  if (tries === 0) {
    const gained = points(result.quality, timeMs, seconds)
    score += gained
    results = [
      ...results,
      {
        stageId: stage.id,
        optionId: choice.optionId ?? null,
        timedOut: !!choice.timedOut,
        correct: result.correct,
        quality: result.quality,
        timeMs: timeMs ?? null,
        points: gained,
      },
    ]
  }
  return {
    ...state,
    phase: 'outcome',
    choice,
    solved: result.correct ? choice : state.solved,
    score,
    results,
    attempts: { ...state.attempts, [stage.id]: tries + 1 },
    playId: state.playId + 1,
    slow: false,
  }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START':
      return startGame(action.scenario, (state?.runId ?? -1) + 1)
    case 'RESTART':
      return startGame(state.scenario, state.runId + 1)
    case 'INTRO_DONE':
      return state.phase === 'intro' ? { ...state, phase: 'question' } : state
    case 'CHOOSE':
      if (state.phase !== 'question') return state
      return decide(state, { optionId: action.optionId }, action.timeMs, action.seconds)
    case 'TIMEOUT':
      if (state.phase !== 'question') return state
      return decide(state, { timedOut: true }, null, 0)
    case 'OUTCOME_DONE':
      return state.phase === 'outcome' ? { ...state, phase: 'feedback' } : state
    case 'REPLAY':
      return state.phase === 'feedback' ? { ...state, phase: 'outcome', playId: state.playId + 1, slow: true } : state
    case 'RETRY':
      return state.phase === 'feedback' && !state.solved ? { ...state, phase: 'question', choice: null } : state
    case 'REVEAL': {
      if (state.phase !== 'feedback') return state
      const choice = { optionId: correctOption(currentStage(state)).id, revealed: true }
      return { ...state, phase: 'outcome', choice, solved: choice, playId: state.playId + 1, slow: false }
    }
    case 'WHATIF': {
      if (state.phase !== 'feedback' || !state.solved || action.optionId === state.solved.optionId) return state
      return {
        ...state,
        phase: 'outcome',
        choice: { optionId: action.optionId, whatIf: true },
        explored: state.explored.includes(action.optionId) ? state.explored : [...state.explored, action.optionId],
        playId: state.playId + 1,
        slow: false,
      }
    }
    case 'BACK':
      return state.phase === 'feedback' && state.solved ? { ...state, choice: state.solved } : state
    case 'NEXT': {
      if (state.phase !== 'feedback' || !state.solved) return state
      const stage = currentStage(state)
      if (state.stageIndex === state.scenario.stages.length - 1) return { ...state, phase: 'summary' }
      const result = choiceResult(stage, state.solved)
      const next = endState(result.clip, state.questionState, state.scenario.entities, state.scenario.facingUp)
      return enterStage(state, state.stageIndex + 1, next)
    }
    default:
      return state
  }
}

/** 0–3 stars from the grades of the first attempts (a weak decision counts a little). */
export function stars(state) {
  const total = state.scenario.stages.length * 3
  const sum = state.results.reduce((s, r) => s + (r.quality ?? 0), 0)
  return Math.round((sum / total) * 3)
}

export function maxScore(scenario) {
  return scenario.stages.length * (POINTS_CORRECT + POINTS_SPEED_MAX)
}

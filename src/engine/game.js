import { endState, initialState } from './animation'

// Game flow for one scenario:
//   intro (stage animation) → question (frozen, clock running) → outcome (answer animation) → feedback
//   feedback → NEXT (correct)  → next stage intro, or summary after the last stage
//   feedback → RETRY (wrong)   → same question again;  REVEAL → plays the correct answer (no points)

export const DECISION_OPTIONS = [15, 25, 40, 0] // seconds; 0 = no time limit
export const DEFAULT_DECISION_SECONDS = 25
export const POINTS_CORRECT = 100
export const POINTS_SPEED_MAX = 50

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
    playId: base.playId + 1,
    slow: false,
  }
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
  return enterStage(base, 0, initialState(scenario))
}

/** Points for a first attempt; with a clock, a faster decision earns up to POINTS_SPEED_MAX extra. */
function points(correct, timeMs, seconds) {
  if (!correct) return 0
  if (!seconds || timeMs == null) return POINTS_CORRECT
  const left = Math.max(0, 1 - timeMs / (seconds * 1000))
  return POINTS_CORRECT + Math.round(POINTS_SPEED_MAX * left)
}

function decide(state, choice, timeMs, seconds) {
  const stage = currentStage(state)
  const tries = state.attempts[stage.id] ?? 0
  const result = choiceResult(stage, choice)
  let { score, results } = state
  if (tries === 0) {
    const gained = points(result.correct, timeMs, seconds)
    score += gained
    results = [
      ...results,
      {
        stageId: stage.id,
        optionId: choice.optionId ?? null,
        timedOut: !!choice.timedOut,
        correct: result.correct,
        timeMs: timeMs ?? null,
        points: gained,
      },
    ]
  }
  return {
    ...state,
    phase: 'outcome',
    choice,
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
      return state.phase === 'feedback' ? { ...state, phase: 'question', choice: null } : state
    case 'REVEAL': {
      if (state.phase !== 'feedback') return state
      const opt = correctOption(currentStage(state))
      return { ...state, phase: 'outcome', choice: { optionId: opt.id, revealed: true }, playId: state.playId + 1, slow: false }
    }
    case 'NEXT': {
      if (state.phase !== 'feedback') return state
      const stage = currentStage(state)
      const result = choiceResult(stage, state.choice)
      if (!result.correct) return state
      if (state.stageIndex === state.scenario.stages.length - 1) return { ...state, phase: 'summary' }
      const next = endState(result.clip, state.questionState, state.scenario.entities, state.scenario.facingUp)
      return enterStage(state, state.stageIndex + 1, next)
    }
    default:
      return state
  }
}

/** 0–3 stars: one for each stage decided well on the first attempt (scaled when a scenario has more stages). */
export function stars(state) {
  const total = state.scenario.stages.length
  const good = state.results.filter((r) => r.correct).length
  return Math.round((good / total) * 3)
}

export function maxScore(scenario) {
  return scenario.stages.length * (POINTS_CORRECT + POINTS_SPEED_MAX)
}

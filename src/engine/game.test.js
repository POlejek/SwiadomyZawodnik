import { describe, expect, it } from 'vitest'
import { obrona2v1Skrzydlo as sc } from '../scenarios/obrona2v1Skrzydlo'
import { POINTS_CORRECT, choiceResult, currentStage, gameReducer, maxScore, startGame, stars } from './game'

const correctId = (state) => currentStage(state).options.find((o) => o.correct).id
const wrongId = (state) => currentStage(state).options.find((o) => !o.correct).id
const run = (state, ...actions) => actions.reduce(gameReducer, state)

function answer(state, optionId, extra = {}) {
  return run(state, { type: 'INTRO_DONE' }, { type: 'CHOOSE', optionId, ...extra }, { type: 'OUTCOME_DONE' })
}

describe('game flow', () => {
  it('a perfect run goes through every stage to the summary', () => {
    let s = startGame(sc)
    expect(s.phase).toBe('intro')
    for (let i = 0; i < sc.stages.length; i++) {
      expect(s.stageIndex).toBe(i)
      s = answer(s, correctId(s), { timerOn: false })
      expect(s.phase).toBe('feedback')
      s = gameReducer(s, { type: 'NEXT' })
    }
    expect(s.phase).toBe('summary')
    expect(s.score).toBe(sc.stages.length * POINTS_CORRECT)
    expect(stars(s)).toBe(3)
  })

  it('the next stage starts exactly where the correct answer left the players', () => {
    let s = answer(startGame(sc), correctId(startGame(sc)))
    const before = choiceResult(currentStage(s), s.choice)
    s = gameReducer(s, { type: 'NEXT' })
    const last = (keys) => keys[keys.length - 1]
    expect(s.introStart.players.ty).toMatchObject({ x: last(before.clip.tracks.ty).x, y: last(before.clip.tracks.ty).y })
    expect(s.introStart.ball.owner).toBe('a')
  })

  it('a wrong answer cannot move on; retry brings the question back and scores nothing', () => {
    let s = answer(startGame(sc), wrongId(startGame(sc)))
    expect(choiceResult(currentStage(s), s.choice).correct).toBe(false)
    expect(gameReducer(s, { type: 'NEXT' })).toBe(s)
    s = run(s, { type: 'RETRY' })
    expect(s.phase).toBe('question')
    s = run(s, { type: 'CHOOSE', optionId: correctId(s) }, { type: 'OUTCOME_DONE' })
    expect(s.score).toBe(0) // only the first attempt counts
    expect(s.results).toHaveLength(1)
    expect(s.results[0].correct).toBe(false)
  })

  it('fast correct decisions earn a speed bonus', () => {
    const s = answer(startGame(sc), correctId(startGame(sc)), { timerOn: true, timeMs: 0 })
    expect(s.score).toBe(maxScore(sc) / sc.stages.length)
  })

  it('timeout plays the timeout outcome and counts as wrong', () => {
    let s = run(startGame(sc), { type: 'INTRO_DONE' }, { type: 'TIMEOUT' })
    expect(s.phase).toBe('outcome')
    const r = choiceResult(currentStage(s), s.choice)
    expect(r.correct).toBe(false)
    expect(r.clip).toBeTruthy()
    s = gameReducer(s, { type: 'OUTCOME_DONE' })
    expect(s.results[0]).toMatchObject({ timedOut: true, correct: false })
  })

  it('reveal shows the correct answer and lets the player continue', () => {
    let s = answer(startGame(sc), wrongId(startGame(sc)))
    s = run(s, { type: 'REVEAL' }, { type: 'OUTCOME_DONE' }, { type: 'NEXT' })
    expect(s.stageIndex).toBe(1)
    expect(s.score).toBe(0)
  })

  it('replay plays the same outcome in slow motion; actions out of phase are ignored', () => {
    let s = answer(startGame(sc), correctId(startGame(sc)))
    s = gameReducer(s, { type: 'REPLAY' })
    expect(s).toMatchObject({ phase: 'outcome', slow: true })
    expect(gameReducer(s, { type: 'CHOOSE', optionId: 'x' })).toBe(s)
    expect(gameReducer(s, { type: 'TIMEOUT' })).toBe(s)
  })

  it('restart begins a new run from stage one', () => {
    const s = run(answer(startGame(sc), wrongId(startGame(sc))), { type: 'RESTART' })
    expect(s).toMatchObject({ stageIndex: 0, score: 0, results: [], runId: 1, phase: 'intro' })
  })
})

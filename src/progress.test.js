import { describe, expect, it } from 'vitest'
import {
  addDays,
  dueItems,
  emptyProgress,
  level,
  medalFor,
  pickDaily,
  recordDecision,
  recordScenarioComplete,
  recordTraining,
  recordWhatIfAll,
  streak,
} from './progress'

const T = '2026-11-17'
const decide = (p, stageId, quality, extra = {}) => recordDecision(p, { scenarioId: 's', stageId, quality, points: 100, ...extra }, extra.today ?? T)

describe('spaced repetition', () => {
  it('a best decision comes back later, a mistake tomorrow', () => {
    let { progress: p } = decide(emptyProgress(), 'a', 3)
    expect(p.items['s/a']).toMatchObject({ box: 1, due: addDays(T, 3), best: 1, plays: 1 })
    p = decide(p, 'a', 3).progress
    expect(p.items['s/a']).toMatchObject({ box: 2, due: addDays(T, 7), best: 2 })
    p = decide(p, 'a', 0).progress
    expect(p.items['s/a']).toMatchObject({ box: 0, due: addDays(T, 1) })
  })
  it('lists what is due and builds the daily training: repeats, then new, then the rest', () => {
    let p = decide(emptyProgress(), 'a', 0, { today: '2026-11-10' }).progress // due 11-11
    p = decide(p, 'b', 3, { today: T }).progress // due later
    expect(dueItems(p, T)).toEqual(['s/a'])
    const catalog = ['a', 'b', 'c', 'd', 'e', 'f'].map((id, stageIndex) => ({ key: `s/${id}`, scenarioId: 's', stageIndex }))
    const picked = pickDaily(p, catalog, T, () => 0.5, 5)
    expect(picked[0]).toMatchObject({ key: 's/a', repeat: true })
    expect(picked.slice(1, 5).map((x) => x.key)).toEqual(['s/c', 's/d', 's/e', 's/f'])
  })
})

describe('streak, level, medals, badges', () => {
  it('counts training days in a row, forgiving one missed day', () => {
    const p = { ...emptyProgress(), trainingDays: ['2026-11-10', '2026-11-12', '2026-11-13', '2026-11-15'] }
    expect(streak(p, '2026-11-16')).toBe(4)
    expect(streak(p, '2026-11-18')).toBe(0)
    expect(streak({ ...p, trainingDays: ['2026-11-01', '2026-11-15'] }, '2026-11-15')).toBe(1)
  })
  it('levels and medals', () => {
    expect(level(0).name).toBe('Debiutant')
    expect(level(950)).toMatchObject({ name: 'Zawodnik ligowy', from: 900, to: 2000 })
    expect(level(99999).to).toBeNull()
    expect(medalFor({ best: 0 })).toBeNull()
    expect(medalFor({ best: 1 }).id).toBe('bronze')
    expect(medalFor({ best: 4 }).id).toBe('silver')
    expect(medalFor({ best: 5 }).id).toBe('gold')
  })
  it('awards badges once', () => {
    let r = decide(emptyProgress(), 'a', 3, { timeMs: 3000 })
    expect(r.earned).toEqual(['pierwszy-krok', 'blyskawica'])
    r = decide(r.progress, 'b', 3, { timeMs: 3000 })
    expect(r.earned).toEqual([])
    expect(recordWhatIfAll(r.progress, T).earned).toEqual(['analityk'])
    expect(recordScenarioComplete(r.progress, 'x', ['x', 'y'], T).earned).toEqual([])
    const both = recordScenarioComplete(recordScenarioComplete(r.progress, 'x', ['x', 'y'], T).progress, 'y', ['x', 'y'], T)
    expect(both.earned).toEqual(['komplet'])
  })
  it('daily training gives XP and streak badges', () => {
    let p = emptyProgress()
    const earned = []
    for (const d of ['2026-11-15', '2026-11-16', '2026-11-17']) {
      const r = recordTraining(p, d)
      p = r.progress
      earned.push(...r.earned)
    }
    expect(p.xp).toBe(150)
    expect(earned).toEqual(['trening-dnia', 'seria-3'])
  })
})

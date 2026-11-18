import { describe, expect, it } from 'vitest'
import { BASE, albumCards, albumCompletion, ceiling, computeCard, pointsFor, rating, withCardBest } from './card'
import { addDays, emptyProgress, medalFor, recordDecision, recordTraining } from './progress'
import { CATALOG, SCENARIOS, findScenario } from './scenarios'

const stageOf = (c) => findScenario(c.scenarioId).stages[c.stageIndex]
const cueItem = CATALOG.find((c) => stageOf(c).variants?.length)
const plainItem = CATALOG.find((c) => !stageOf(c).variants?.length)

function play(p, c, quality, day, timeMs = 3000, seconds = 25) {
  const attrs = pointsFor({ stage: stageOf(c), quality, timeMs, seconds })
  return recordDecision(p, { scenarioId: c.scenarioId, stageId: stageOf(c).id, quality, timeMs, points: 100, attrs }, day).progress
}

describe('skill points', () => {
  it('a fast best decision in a cue situation trains its group, reading the game and speed', () => {
    const pts = pointsFor({ stage: stageOf(cueItem), quality: 3, timeMs: 2000, seconds: 25 })
    expect(pts.CZY).toBe(3)
    expect(pts.SZY).toBe(3)
    expect(Object.values(pts).filter((v) => v === 3)).toHaveLength(3)
  })
  it('a wrong decision still counts a little, never for speed', () => {
    const pts = pointsFor({ stage: stageOf(plainItem), quality: 0, timeMs: 1000, seconds: 25 })
    expect(Object.values(pts)).toEqual([0.5])
  })
})

describe('rating curve', () => {
  it('starts at 40, grows ever more slowly and never passes the ceiling', () => {
    expect(rating(0, 80)).toBe(BASE)
    const steps = [0, 60, 120, 240, 480, 960].map((p) => rating(p, 80))
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThanOrEqual(steps[i - 1])
    expect(steps[1] - steps[0]).toBeGreaterThan(steps[5] - steps[4])
    expect(rating(1e9, 80)).toBeLessThanOrEqual(80)
    expect(ceiling(0)).toBe(60)
    expect(ceiling(1)).toBe(99)
  })
  it('a card never goes down', () => {
    const p = { ...emptyProgress(), cardBest: { overall: 70, CZY: 75, ATA: 70, OBR: 70, PRZ: 70, SZY: 70, WYT: 65 } }
    const card = computeCard(p, SCENARIOS, null, '2026-11-18')
    expect(card.overall).toBe(70)
    expect(card.attrs.CZY.value).toBe(75)
    expect(withCardBest(p, card).cardBest.overall).toBe(70)
  })
})

describe('medals need different days', () => {
  it('two best decisions on the same day count once', () => {
    let p = play(emptyProgress(), plainItem, 3, '2026-11-18')
    p = play(p, plainItem, 3, '2026-11-18')
    expect(p.items[plainItem.key].bestDays).toBe(1)
    p = play(p, plainItem, 3, '2026-11-19')
    p = play(p, plainItem, 3, '2026-11-21')
    expect(medalFor(p.items[plainItem.key]).id).toBe('silver')
  })
})

describe('long game: not over in a month', () => {
  // A very keen player: a daily training every day, five decisions, always the best answer, fast.
  function simulate(days) {
    let p = emptyProgress()
    let day = '2026-01-05'
    for (let d = 0; d < days; d++) {
      for (let k = 0; k < 5; k++) p = play(p, CATALOG[(d * 5 + k) % CATALOG.length], 3, day)
      p = recordTraining(p, day).progress
      p = withCardBest(p, computeCard(p, SCENARIOS, null, day))
      day = addDays(day, 1)
    }
    return computeCard(p, SCENARIOS, null, day)
  }
  it('after 30 days of perfect play the card is still far from the top', () => {
    const card = simulate(30)
    expect(card.overall).toBeGreaterThan(BASE + 10)
    expect(card.overall).toBeLessThan(80)
  })
  it('after half a year with gold everywhere it reaches the elite', () => {
    const card = simulate(180)
    expect(card.overall).toBeGreaterThanOrEqual(85)
    expect(card.overall).toBeLessThanOrEqual(99)
  })
})

describe('album', () => {
  it('a fundamental card appears when every decision that teaches it has a medal', () => {
    let p = emptyProgress()
    expect(albumCards(p).every((c) => c.tier === null)).toBe(true)
    const f = plainItem && stageOf(plainItem).fundament
    for (const c of CATALOG.filter((x) => x.fundament === f)) p = play(p, c, 3, '2026-11-18')
    expect(albumCards(p).find((c) => c.id === f).tier).toBe('bronze')
    const done = albumCompletion(p, ['analityk'])
    expect(done.filled).toBe(1)
    expect(done.total).toBe(albumCards(p).length * 3 + 1)
  })
})

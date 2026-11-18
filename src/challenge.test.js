import { describe, expect, it } from 'vitest'
import { challengeLink, readChallenge } from './challenge'
import { prepareRun } from './engine/variants'
import { seeded, shuffleWith } from './rng'
import { SCENARIOS, findScenario } from './scenarios'

describe('seeded randomness', () => {
  it('the same seed gives the same version of a situation and the same answer order', () => {
    for (const sc of SCENARIOS) {
      expect(prepareRun(sc, seeded(424242))).toEqual(prepareRun(sc, seeded(424242)))
    }
    const opts = findScenario('atak-2v1').stages[1].options
    expect(shuffleWith(opts, seeded(7))).toEqual(shuffleWith(opts, seeded(7)))
  })
  it('different seeds give different versions over many runs', () => {
    const sc = findScenario('atak-2v1')
    const versions = new Set(Array.from({ length: 40 }, (_, i) => {
      const r = prepareRun(sc, seeded(i))
      return `${!!r.mirrored}-${r.stages[1].variant}`
    }))
    expect(versions.size).toBe(4)
  })
})

describe('challenge link', () => {
  const base = 'https://example.org/'
  it('round-trips through the link', () => {
    const link = challengeLink({ scenarioId: 'atak-2v1', seed: 123, score: 210, stars: 2, seconds: 25, from: 'Kuba Ż', number: 9 }, base)
    expect(link.startsWith(base + '#wyzwanie=atak-2v1')).toBe(true)
    expect(readChallenge(link.slice(base.length), SCENARIOS)).toEqual({ scenarioId: 'atak-2v1', seed: 123, score: 210, stars: 2, seconds: 25, from: 'Kuba Ż', number: 9 })
  })
  it('rejects edited or broken links', () => {
    expect(readChallenge('#wyzwanie=nie-ma&ziarno=1&pkt=1&gw=1', SCENARIOS)).toBeNull()
    expect(readChallenge('#wyzwanie=atak-2v1&ziarno=1&pkt=99999&gw=1', SCENARIOS)).toBeNull()
    expect(readChallenge('#wyzwanie=atak-2v1&ziarno=-5&pkt=10&gw=1', SCENARIOS)).toBeNull()
    expect(readChallenge('#wyzwanie=atak-2v1&ziarno=1&pkt=10&gw=7', SCENARIOS)).toBeNull()
    const odd = readChallenge('#wyzwanie=atak-2v1&ziarno=1&pkt=10&gw=1&czas=13&od=&nr=500', SCENARIOS)
    expect(odd).toMatchObject({ seconds: 0, from: 'Kolega', number: null })
  })
})

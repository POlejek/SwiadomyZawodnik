import { describe, expect, it } from 'vitest'
import { SCENARIOS } from './scenarios'
import { FUNDAMENTY, GRUPY, checkTaxonomy, filterScenarios, fundamentyOf } from './taxonomy'

describe('taxonomy', () => {
  it('every fundamental belongs to a known group and ids are unique', () => {
    expect(new Set(FUNDAMENTY.map((f) => f.id)).size).toBe(FUNDAMENTY.length)
    for (const f of FUNDAMENTY) expect(GRUPY.some((g) => g.id === f.grupa), f.id).toBe(true)
  })
  it('reports a badly categorised situation', () => {
    const bad = { faza: 'x', strefa: 'y', liczebnosc: '2-1', level: '?', positions: ['bramkarz'], stages: [{ id: 's', fundament: 'nie-ma' }] }
    expect(checkTaxonomy(bad)).toHaveLength(6)
  })
  it('filters by phase (transitions together), fundamental, position, numbers and text', () => {
    const n = (f) => filterScenarios(SCENARIOS, f).length
    expect(n({})).toBe(SCENARIOS.length)
    expect(n({ faza: 'przejscia' })).toBe(SCENARIOS.filter((s) => s.faza.startsWith('przejscie')).length)
    expect(filterScenarios(SCENARIOS, { fundament: 'kontrpressing' }).every((s) => fundamentyOf(s).includes('kontrpressing'))).toBe(true)
    expect(filterScenarios(SCENARIOS, { pozycja: 'napastnik' }).every((s) => s.positions.includes('napastnik'))).toBe(true)
    expect(filterScenarios(SCENARIOS, { liczebnosc: '1v1' }).every((s) => s.liczebnosc === '1v1')).toBe(true)
    expect(n({ q: 'ASEKUR' })).toBe(SCENARIOS.filter((s) => fundamentyOf(s).includes('asekuracja')).length)
    expect(n({ status: 'nowe' })).toBe(SCENARIOS.length)
  })
})

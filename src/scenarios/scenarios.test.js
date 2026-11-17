import { describe, expect, it } from 'vitest'
import { endState, initialState, stateAt } from '../engine/animation'
import { VIEW } from '../engine/pitch'
import { mirrorScenario } from '../engine/variants'
import { SCENARIOS } from '.'
import { checkTaxonomy } from '../taxonomy'
import { validateScenario } from './validate'

// Every way a scenario can be played: each combination of stage variants, on both sides of the pitch.
function allRuns(sc) {
  let combos = [[]]
  for (const st of sc.stages) {
    const { variants = [], ...base } = st
    const versions = [base, ...variants.map((v) => ({ ...base, ...v }))]
    combos = combos.flatMap((c) => versions.map((v) => [...c, v]))
  }
  const plain = combos.map((stages, i) => ({ ...sc, stages, run: `wersja ${i + 1}` }))
  return [...plain, ...plain.map((r) => ({ ...mirrorScenario(r), run: `${r.run}, lustro` }))]
}

describe.each(SCENARIOS.map((s) => [s.id, s]))('scenario %s', (_id, scenario) => {
  it('has no authoring mistakes, also mirrored', () => {
    expect(validateScenario(scenario)).toEqual([])
    expect(validateScenario(mirrorScenario(scenario))).toEqual([])
  })

  it('is categorised: phase, zone, numbers, positions, level and a fundamental for every stage', () => {
    expect(checkTaxonomy(scenario)).toEqual([])
  })

  describe.each(allRuns(scenario).map((r) => [r.run, r]))('%s', (_run, sc) => {

  it('every shot that ends in a goal finishes inside the goal', () => {
    for (const st of sc.stages) {
      for (const o of [...st.options, { id: 'timeout', clip: st.timeout.clip }]) {
        const goal = o.clip?.events?.some((e) => e.text === 'GOL')
        if (!goal) continue
        const last = o.clip.ball[o.clip.ball.length - 1]
        expect(last.y, `${st.id}/${o.id}`).toBeLessThan(0)
        expect(Math.abs(last.x - 34), `${st.id}/${o.id}`).toBeLessThan(3.66)
      }
    }
  })

  it('every clip keeps players inside the visible area from start to end', () => {
    let s = initialState(sc)
    for (const st of sc.stages) {
      const clips = [['intro', st.intro], ...st.options.map((o) => [o.id, o.clip]), ['timeout', st.timeout.clip]]
      const q = endState(st.intro, s, sc.entities, sc.facingUp)
      for (const [name, clip] of clips) {
        if (!clip) continue
        const from = name === 'intro' ? s : q
        for (let t = 0; t <= clip.duration; t += 0.1) {
          const w = stateAt(clip, from, sc.entities, t, sc.facingUp)
          for (const [id, p] of Object.entries(w.players)) {
            expect(p.x, `${st.id}/${name}/${id} t=${t.toFixed(1)}`).toBeGreaterThan(VIEW.x + 1)
            expect(p.x, `${st.id}/${name}/${id} t=${t.toFixed(1)}`).toBeLessThan(VIEW.x + VIEW.width - 1)
            expect(p.y, `${st.id}/${name}/${id} t=${t.toFixed(1)}`).toBeGreaterThan(VIEW.y + 1)
            expect(p.y, `${st.id}/${name}/${id} t=${t.toFixed(1)}`).toBeLessThan(VIEW.y + VIEW.height + 1)
          }
        }
      }
      s = endState(st.options.find((o) => o.correct).clip, q, sc.entities, sc.facingUp)
    }
  })

  it('the correct path keeps the players on the pitch', () => {
    let s = initialState(sc)
    for (const st of sc.stages) {
      s = endState(st.intro, s, sc.entities, sc.facingUp)
      s = endState(st.options.find((o) => o.correct).clip, s, sc.entities, sc.facingUp)
      for (const [id, p] of Object.entries(s.players)) {
        expect(p.x, id).toBeGreaterThanOrEqual(0)
        expect(p.x, id).toBeLessThanOrEqual(68)
      }
    }
  })
  })
})

describe('scenario list', () => {
  it('has unique ids', () => {
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length)
  })
})

describe('validateScenario', () => {
  it('reports broken scenarios', () => {
    const bad = {
      entities: [{ id: 'a', team: 'away', x: 0, y: 0 }],
      ball: { on: 'zz' },
      stages: [{ id: 's', options: [{ id: 'o', correct: false, clip: { duration: 1, tracks: { q: [] } } }] }],
    }
    const p = validateScenario(bad).join('\n')
    expect(p).toMatch(/you: true/)
    expect(p).toMatch(/nieznanego zawodnika "zz"/)
    expect(p).toMatch(/4 odpowiedzi/)
    expect(p).toMatch(/jedna poprawna/)
    expect(p).toMatch(/nieznany zawodnik "q"/)
    expect(p).toMatch(/koniec czasu/)
  })
})

import { describe, expect, it } from 'vitest'
import { endState, initialState } from '../engine/animation'
import { SCENARIOS } from '.'
import { validateScenario } from './validate'

describe.each(SCENARIOS.map((s) => [s.id, s]))('scenario %s', (_id, sc) => {
  it('has no authoring mistakes', () => {
    expect(validateScenario(sc)).toEqual([])
  })

  it('every shot that ends in a goal finishes inside the goal', () => {
    for (const st of sc.stages) {
      for (const o of st.options) {
        const goal = o.clip.events?.some((e) => e.text === 'GOL')
        if (!goal) continue
        const last = o.clip.ball[o.clip.ball.length - 1]
        expect(last.y, `${st.id}/${o.id}`).toBeLessThan(0)
        expect(Math.abs(last.x - 34), `${st.id}/${o.id}`).toBeLessThan(3.66)
      }
    }
  })

  it('the correct path keeps the players on the pitch', () => {
    let s = initialState(sc)
    for (const st of sc.stages) {
      s = endState(st.intro, s, sc.entities)
      s = endState(st.options.find((o) => o.correct).clip, s, sc.entities)
      for (const [id, p] of Object.entries(s.players)) {
        expect(p.x, id).toBeGreaterThanOrEqual(0)
        expect(p.x, id).toBeLessThanOrEqual(68)
      }
    }
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

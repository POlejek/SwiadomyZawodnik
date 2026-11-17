import { describe, expect, it } from 'vitest'
import { iconFor } from './icons'
import { personalise, pitchName, suitsPosition } from './profile'
import { SCENARIOS } from './scenarios'

describe('profile', () => {
  const entities = [
    { id: 'ty', team: 'home', number: 4, you: true },
    { id: 'm', team: 'home', number: 8 },
    { id: 'r', team: 'away', number: 8 },
  ]
  it('puts the player number on "TY" and swaps a team-mate with the same number', () => {
    const out = personalise(entities, { number: 8 })
    expect(out.map((e) => e.number)).toEqual([8, 4, 8])
    expect(personalise(entities, { number: null })).toBe(entities)
  })
  it('shows the name above the player', () => {
    expect(pitchName({ name: '  Kuba ' })).toBe('KUBA')
    expect(pitchName({ name: '' })).toBe('TY')
    expect(pitchName(null)).toBe('TY')
  })
  it('matches situations to the position', () => {
    const sc = { positions: ['obronca'] }
    expect(suitsPosition(sc, { position: 'obronca' })).toBe(true)
    expect(suitsPosition(sc, { position: 'napastnik' })).toBe(false)
    expect(suitsPosition(sc, { position: 'wszystkie' })).toBe(true)
  })
})

describe('answer icons', () => {
  it('every answer in every situation and variant has a pictogram', () => {
    for (const sc of SCENARIOS) {
      for (const st of sc.stages) {
        for (const o of [...st.options, ...(st.variants ?? []).flatMap((v) => v.options ?? [])]) {
          expect(iconFor(o), `${sc.id}/${st.id}: ${o.label}`).toBeTruthy()
        }
      }
    }
  })
})

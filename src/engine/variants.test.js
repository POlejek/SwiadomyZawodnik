import { describe, expect, it } from 'vitest'
import { atak2v1 } from '../scenarios/atak2v1.js'
import { mirrorScenario, mirrorText, pickVariants, prepareRun } from './variants'

describe('mirrorText', () => {
  it('swaps left and right in every form, keeping capitals', () => {
    expect(mirrorText('Kontra prawym skrzydłem, kolega biegnie z lewej')).toBe('Kontra lewym skrzydłem, kolega biegnie z prawej')
    expect(mirrorText('lewą stroną do prawego słupka')).toBe('prawą stroną do lewego słupka')
    expect(mirrorText('Prawy obrońca')).toBe('Lewy obrońca')
  })
  it('leaves other words alone', () => {
    expect(mirrorText('prawie zawsze, prawdziwy lewar')).toBe('prawie zawsze, prawdziwy lewar')
  })
})

describe('mirrorScenario', () => {
  const m = mirrorScenario(atak2v1)
  it('flips every position across the pitch', () => {
    expect(m.entities.find((e) => e.id === 'ty').x).toBe(68 - 40)
    const key = m.stages[0].intro.tracks.ty[0]
    expect(key).toMatchObject({ x: 68 - 39, y: 36 })
    const hl = m.stages[0].options[0].highlights[0]
    expect(hl.from).toEqual([68 - 39, 36])
    expect(hl.labelDx).toBe(-8)
  })
  it('swaps sides in the texts but keeps ids', () => {
    expect(m.brief).toContain('lewą stroną'.replace('lewą', 'prawą'))
    expect(m.stages[0].options.map((o) => o.id)).toEqual(atak2v1.stages[0].options.map((o) => o.id))
  })
  it('mirroring twice gives back the original', () => {
    const back = mirrorScenario(m)
    expect(back.stages).toEqual(atak2v1.stages)
    expect(back.entities).toEqual(atak2v1.entities)
  })
})

describe('pickVariants / prepareRun', () => {
  it('picks the base stage or a variant and drops the variant list', () => {
    const base = pickVariants(atak2v1, () => 0)
    const alt = pickVariants(atak2v1, () => 0.99)
    expect(base.stages[1].variant).toBeNull()
    expect(alt.stages[1].variant).toBe('obronca-przy-koledze')
    expect(alt.stages[1].options.find((o) => o.correct).id).toBe('strzal')
    expect(alt.stages[1].variants).toBeUndefined()
    expect(alt.stages[1].id).toBe(atak2v1.stages[1].id)
  })
  it('mirrors half of the runs', () => {
    expect(prepareRun(atak2v1, () => 0.2).mirrored).toBeUndefined()
    expect(prepareRun(atak2v1, () => 0.7).mirrored).toBe(true)
  })
})

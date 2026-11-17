import { describe, expect, it } from 'vitest'
import { endState, eventsAt, initialState, playerAt, stateAt } from './animation'

const entities = [
  { id: 'a', team: 'away', x: 10, y: 20 },
  { id: 'b', team: 'away', x: 30, y: 20 },
  { id: 'h', team: 'home', x: 20, y: 10 },
]
const sc = { entities, ball: { on: 'a' } }

describe('playerAt', () => {
  it('starts from the current position when the clip has no key at t=0', () => {
    expect(playerAt([{ t: 2, x: 10, y: 0 }], { x: 0, y: 0 }, 0)).toMatchObject({ x: 0, y: 0 })
    expect(playerAt([{ t: 2, x: 10, y: 0 }], { x: 0, y: 0 }, 1).x).toBeCloseTo(5)
    expect(playerAt([{ t: 2, x: 10, y: 0 }], { x: 0, y: 0 }, 5)).toMatchObject({ x: 10, y: 0 })
  })
  it('stays still without keys and keeps the pose of the last key passed', () => {
    expect(playerAt(undefined, { x: 3, y: 4, pose: 'down' }, 1)).toMatchObject({ x: 3, y: 4, pose: 'down' })
    const keys = [{ t: 1, x: 1, y: 0, pose: 'down' }, { t: 2, x: 2, y: 0 }]
    expect(playerAt(keys, { x: 0, y: 0 }, 1.5).pose).toBe('down')
    expect(playerAt(keys, { x: 0, y: 0 }, 2).pose).toBeUndefined()
  })
  it('moves continuously through middle keys', () => {
    const keys = [{ t: 1, x: 10, y: 0 }, { t: 2, x: 20, y: 0 }, { t: 3, x: 30, y: 0 }]
    const xs = [0.5, 1, 1.5, 2, 2.5].map((t) => playerAt(keys, { x: 0, y: 0 }, t).x)
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1])
    expect(playerAt(keys, { x: 0, y: 0 }, 1.5).x).toBeCloseTo(15)
  })
})

describe('stateAt — ball', () => {
  const start = initialState(sc)
  it('puts the ball in front of its owner (opponents attack towards y=0)', () => {
    expect(start.ball).toMatchObject({ x: 10, y: 19, owner: 'a' })
  })
  it('follows the carrier, flies on a pass and is received', () => {
    const clip = {
      duration: 3,
      tracks: { a: [{ t: 1, x: 10, y: 15 }], b: [{ t: 2, x: 30, y: 10 }] },
      ball: [{ t: 1, on: 'a' }, { t: 2, on: 'b', arc: 2 }],
    }
    expect(stateAt(clip, start, entities, 1).ball).toMatchObject({ x: 10, y: 14, owner: 'a' })
    const mid = stateAt(clip, start, entities, 1.5).ball
    expect(mid.owner).toBeNull()
    expect(mid.h).toBeCloseTo(2) // peak of the arc halfway
    expect(stateAt(clip, start, entities, 2.5).ball).toMatchObject({ x: 30, y: 9, owner: 'b' })
  })
  it('flies to a free point and lies there', () => {
    const clip = { duration: 2, ball: [{ t: 1, x: 50, y: 0 }] }
    const end = endState(clip, start, entities)
    expect(end.ball).toEqual({ x: 50, y: 0, h: 0, owner: null })
  })
})

describe('endState / eventsAt', () => {
  it('returns the start unchanged without a clip', () => {
    const s = initialState(sc)
    expect(endState(null, s, entities)).toBe(s)
  })
  it('chains: the end of one clip is the start of the next', () => {
    const s0 = initialState(sc)
    const s1 = endState({ duration: 1, tracks: { h: [{ t: 1, x: 25, y: 5 }] } }, s0, entities)
    expect(s1.players.h).toMatchObject({ x: 25, y: 5 })
    const s2 = stateAt({ duration: 1, tracks: { h: [{ t: 1, x: 30, y: 5 }] } }, s1, entities, 0)
    expect(s2.players.h).toMatchObject({ x: 25, y: 5 })
  })
  it('shows captions only during their window', () => {
    const clip = { events: [{ t: 1, text: 'GOL', dur: 1 }] }
    expect(eventsAt(clip, 0.5)).toEqual([])
    expect(eventsAt(clip, 1.5)).toHaveLength(1)
    expect(eventsAt(clip, 2.1)).toEqual([])
  })
})
